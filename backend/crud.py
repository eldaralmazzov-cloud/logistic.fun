from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime
import json

def get_settings(db: Session):
    settings = db.query(models.GlobalSettings).all()
    return {s.key: s.value for s in settings}

def calculate_costs(product_data: dict, settings: dict):
    # Default values from settings if not present
    customs_rate_kg = settings.get("customs_rate_kg", 2.5)
    customs_percent = settings.get("customs_percent", 0.15)
    delivery_rate_kg = settings.get("delivery_rate_kg", 1.5)
    delivery_rate_m3 = settings.get("delivery_rate_m3", 150)
    
    # Calculation Mode (should be configurable in settings, for now we do standard)
    # Customs: Max of per kg or percentage
    customs_kg = product_data["weight_kg"] * customs_rate_kg
    customs_val = product_data["purchase_price"] * customs_percent
    customs_cost = max(customs_kg, customs_val)
    
    # Delivery: Max of per kg or per m3
    delivery_kg = product_data["weight_kg"] * delivery_rate_kg
    delivery_m3 = product_data["volume_m3"] * delivery_rate_m3
    delivery_cost = max(delivery_kg, delivery_m3)
    
    total_logistics = customs_cost + delivery_cost
    subtotal = product_data["purchase_price"] + total_logistics
    
    margin_val = (product_data["margin_percent"] / 100) * subtotal
    final_total = subtotal + margin_val
    
    return {
        "customs_cost": customs_cost,
        "delivery_cost": delivery_cost,
        "final_total_cost": final_total,
        "outstanding_balance": final_total # Initially balance is full cost
    }

def create_product(db: Session, product: schemas.ProductCreate, user_id: int):
    settings = get_settings(db)
    calc_results = calculate_costs(product.dict(), settings)
    
    db_product = models.Product(
        **product.dict(),
        **calc_results
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Audit log
    log = models.AuditLog(
        user_id=user_id,
        product_id=db_product.id,
        action="Created Product",
        details={"after": product.dict()}
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
    
    old_data = {c.name: getattr(db_product, c.name) for c in db_product.__table__.columns if not isinstance(getattr(db_product, c.name), datetime)}
    
    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    # Recalculate if financial/logistics fields changed
    trigger_fields = ["weight_kg", "volume_m3", "purchase_price", "margin_percent"]
    if any(field in update_data for field in trigger_fields):
        settings = get_settings(db)
        # Use existing values if not updated
        current_data = {
            "weight_kg": db_product.weight_kg,
            "volume_m3": db_product.volume_m3,
            "purchase_price": db_product.purchase_price,
            "margin_percent": db_product.margin_percent
        }
        calc_results = calculate_costs(current_data, settings)
        for key, value in calc_results.items():
            setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    
    # Audit log
    new_data = {c.name: getattr(db_product, c.name) for c in db_product.__table__.columns if not isinstance(getattr(db_product, c.name), datetime)}
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
    old_data = {c.name: getattr(db_product, c.name) for c in db_product.__table__.columns if not isinstance(getattr(db_product, c.name), datetime)}
    
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
