import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database import SessionLocal, engine, Base
import models, schemas, crud
from sqlalchemy.orm import Session

def verify_kgs():
    db: Session = SessionLocal()
    try:
        # 1. Trigger startup event to seed settings
        print("Seeding settings...")
        from main import startup_event
        startup_event()
        
        # 2. Test Create
        print("\nTesting CREATE with KGS fields...")
        user = db.query(models.User).first()
        p_in = schemas.ProductCreate(
            product_name="KGS_TEST_PROD",
            supplier_name="S",
            order_number="ORDER-KGS-001",
            purchase_price=10.0,
            price_cny=100.0,           # 100 CNY * 12.5 = 1250 KGS
            weight_kg=2.0,             # 2.0 kg
            delivery_usd_per_kg=5.0,  # 5 USD/kg * 2 kg = 10 USD
                                       # 10 USD * 89.0 = 890 KGS
                                       # Total = 1250 + 890 = 2140 KGS
            quantity=1
        )
        
        product = crud.create_product(db, p_in, user.id)
        print(f"Created Product ID: {product.id}")
        print(f"Persisted total_cost_som: {product.total_cost_som}")
        
        expected = (100.0 * 12.5) + (5.0 * 2.0 * 89.0)
        if abs(product.total_cost_som - expected) < 0.01:
            print(f"SUCCESS: Calculation matches expected {expected}")
        else:
            print(f"FAILURE: Expected {expected}, got {product.total_cost_som}")
            
        # 3. Test Update
        print("\nTesting UPDATE KGS fields...")
        p_up = schemas.ProductUpdate(
            price_cny=200.0 # 200 * 12.5 = 2500. Total = 2500 + 890 = 3390
        )
        updated = crud.update_product(db, product.id, p_up, user.id)
        print(f"Updated total_cost_som: {updated.total_cost_som}")
        
        new_expected = (200.0 * 12.5) + (5.0 * 2.0 * 89.0)
        if abs(updated.total_cost_som - new_expected) < 0.01:
            print(f"SUCCESS: Update calculation matches expected {new_expected}")
        else:
            print(f"FAILURE: Update expected {new_expected}, got {updated.total_cost_som}")

    finally:
        db.close()

if __name__ == "__main__":
    verify_kgs()
