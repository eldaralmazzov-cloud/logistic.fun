import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.database import SessionLocal, engine, Base
from backend import models, schemas, crud
from sqlalchemy.orm import Session

def test_persistence():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # 1. Create a test product
        print("--- Testing Create ---")
        p_in = schemas.ProductCreate(
            product_name="REPRO_TEST",
            supplier_name="TEST_SUPP",
            order_number="REPRO-123",
            purchase_price=10.0,
            price=25.0,
            characteristics="initial characteristics",
            media_urls=["https://res.cloudinary.com/test1.jpg"],
            weight_kg=1.0,
            volume_m3=0.1,
            quantity=5
        )
        
        # We need a user ID for the audit log. Let's find or create one.
        user = db.query(models.User).first()
        if not user:
            user = models.User(username="testuser", email="test@test.com", hashed_password="---", role=models.UserRole.ADMIN)
            db.add(user)
            db.commit()
            db.refresh(user)
        
        user_id = user.id
        print(f"Using user_id: {user_id}")
        
        db_product = crud.create_product(db, p_in, user_id)
        print(f"Product created with ID: {db_product.id}")
        
        # Verify persistence after create
        db.refresh(db_product)
        print(f"Persisted Product Name: {db_product.product_name}")
        print(f"Persisted Characteristics: {db_product.characteristics}")
        print(f"Persisted Media URLs: {db_product.media_urls}")
        
        # 2. Update the product
        print("\n--- Testing Update ---")
        p_update = schemas.ProductUpdate(
            characteristics="updated characteristics",
            media_urls=["https://res.cloudinary.com/test1.jpg", "https://res.cloudinary.com/test2.jpg"]
        )
        
        updated_product = crud.update_product(db, db_product.id, p_update, user_id)
        print(f"Product updated. Characteristics: {updated_product.characteristics}")
        print(f"Product updated. Media URLs: {updated_product.media_urls}")
        
        # Verify persistence after update
        db.expire_all() # Ensure we fetch fresh from DB
        final_product = db.query(models.Product).filter(models.Product.id == db_product.id).first()
        print(f"\n--- Final Verification ---")
        print(f"Final Characteristics: {final_product.characteristics}")
        print(f"Final Media URLs: {final_product.media_urls}")
        
        if final_product.characteristics == "updated characteristics":
            print("SUCCESS: Persistence confirmed.")
        else:
            print("FAILURE: Persistence failed.")
            
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_persistence()
