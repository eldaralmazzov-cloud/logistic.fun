from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime
import json

def get_settings(db: Session):
    settings = db.query(models.GlobalSettings).all()
    return {s.key: s.value for s in settings}

from decimal import Decimal

def to_serializable(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    if hasattr(obj, "value"): # Handle Enums
        return obj.value
    if isinstance(obj, dict):
        return {k: to_serializable(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_serializable(x) for x in obj]
    return obj

import re

def parse_vol(size_str, places):
    if not size_str or not places: return 0.0
    try:
        # Find all numbers (including floats) in the string
        numbers = [float(n) for n in re.findall(r"(\d+(?:\.\d+)?)", size_str.replace(',', '.'))]
        if len(numbers) >= 3:
            # Smart Unit Detection:
            # If the raw product is large (e.g. 40*40*40 = 64000), it's CM.
            # If it's small (e.g. 0.4*0.4*0.4 = 0.064), it's Meters.
            raw_box_vol = numbers[0] * numbers[1] * numbers[2]
            
            # 10 is a safe threshold (10x10x10cm = 1000cm³; 2x2x2m = 8m³)
            if raw_box_vol > 10.0:
                return round((raw_box_vol * places) / 1_000_000.0, 4)
            else:
                return round(raw_box_vol * places, 4)
    except Exception as e:
        print(f"Error parsing volume from '{size_str}': {e}")
    return 0.0

def recalculate_product_costs(product_obj: models.Product):
    """
    Centralized logic to calculate derived values.
    """
    # Ensure values are not None
    price_cny = product_obj.price_cny or 0.0
    quantity = product_obj.quantity or 0
    cny_rate = product_obj.cny_rate or 0.0
    places_count = product_obj.places_count or 0
    weight_per_box = product_obj.weight_per_box or 0.0
    delivery_rate_usd_per_kg = product_obj.delivery_rate_usd_per_kg or 0.0
    usd_rate = product_obj.usd_rate or 0.0
    service_percent = product_obj.service_percent if product_obj.service_percent is not None else 10.0

    # 1. Total Weight
    product_obj.total_weight = round(places_count * weight_per_box, 2)
    
    # 2. Product Cost in KGS (CNY * Rate)
    product_obj.product_cost_kgs = round(price_cny * quantity * cny_rate, 2)
    
    # 3. Delivery Cost in USD
    product_obj.delivery_cost_usd = round(product_obj.total_weight * delivery_rate_usd_per_kg, 2)
    
    # 4. Delivery Cost in KGS
    product_obj.delivery_cost_kgs = round(product_obj.delivery_cost_usd * usd_rate, 2)
    
    # 5. Service Fee
    product_obj.service_fee = round(product_obj.product_cost_kgs * (service_percent / 100), 2)
    
    # 6. Final Cost
    product_obj.final_cost = round(product_obj.product_cost_kgs + product_obj.delivery_cost_kgs + product_obj.service_fee, 2)

    # 7. Total Volume
    # Use packaging_size if available, otherwise fallback to existing total_volume if it was manually set
    calc_vol = parse_vol(product_obj.packaging_size, places_count)
    if calc_vol > 0:
        product_obj.total_volume = calc_vol
    elif product_obj.volume_m3 and not product_obj.total_volume:
        # Fallback to legacy field only if total_volume is empty
        product_obj.total_volume = product_obj.volume_m3

    # 8. Density (Total Weight / Total Volume)
    if product_obj.total_volume and product_obj.total_volume > 0:
        product_obj.density = round(product_obj.total_weight / product_obj.total_volume, 2)
    else:
        product_obj.density = 0.0

    # Legacy / Compatibility fields
    product_obj.total_cost_som = product_obj.final_cost
    product_obj.final_total_cost = product_obj.final_cost
    product_obj.outstanding_balance = product_obj.final_cost

def create_product(db: Session, product: schemas.ProductCreate, user_id: int):
    product_data = product.dict()
    
    # Create instance first without commit to calculate
    db_product = models.Product(**product_data)
    
    # Run backend calculations (the source of truth)
    recalculate_product_costs(db_product)
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Audit log
    log = models.AuditLog(
        user_id=user_id,
        product_id=db_product.id,
        action="Created Product",
        details={"after": to_serializable(product.dict())}
    )
    db.add(log)
    db.commit()
    
    return db_product

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).order_by(models.Product.id.desc()).offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def update_product(db: Session, product_id: int, product_update: schemas.ProductUpdate, user_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    old_data = {c.name: to_serializable(getattr(db_product, c.name)) for c in db_product.__table__.columns}
    
    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    # Always recalculate on update to ensure source of truth
    recalculate_product_costs(db_product)

    db.commit()
    db.refresh(db_product)
    
    # Audit log
    new_data = {c.name: to_serializable(getattr(db_product, c.name)) for c in db_product.__table__.columns}
    log = models.AuditLog(
        user_id=user_id,
        product_id=db_product.id,
        action="Updated Product",
        details={"before": old_data, "after": new_data}
    )
    db.add(log)
    db.commit()
    
    return db_product
def delete_product(db: Session, product_id: int, user_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return False
    
    # Capture data for audit log before deletion
    old_data = {c.name: to_serializable(getattr(db_product, c.name)) for c in db_product.__table__.columns}
    
    db.delete(db_product)
    db.commit()
    
    # Audit log
    log = models.AuditLog(
        user_id=user_id,
        product_id=None, # Product is gone
        action="Deleted Product",
        details={"before": old_data, "id": product_id}
    )
    db.add(log)
    db.commit()
    
    return True

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_audit_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).offset(skip).limit(limit).all()
