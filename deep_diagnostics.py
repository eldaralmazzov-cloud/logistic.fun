import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database import SessionLocal, engine, Base
import models, schemas, crud
from sqlalchemy.orm import Session
import sqlite3

def run_diagnostics():
    db: Session = SessionLocal()
    try:
        # Check table columns via sqlite3 directly
        print("Checking actual SQLite table structure...")
        conn = sqlite3.connect('backend/logistics.db')
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(products)")
        cols = [row[1] for row in cursor.fetchall()]
        print(f"Columns found in products table: {cols}")
        
        required_cols = ['media_urls', 'characteristics', 'price', 'weight', 'size', 'packaging_size']
        missing = [c for c in required_cols if c not in cols]
        if missing:
            print(f"CRITICAL: Missing columns in DB: {missing}")
            # If columns are missing, we should probably run the migration
        else:
            print("All required columns exist in DB.")
        
        # Test a live update
        user = db.query(models.User).first()
        if not user:
            print("No user found, creating test user...")
            user = models.User(username="diag_user", email="diag@test.com", role=models.UserRole.ADMIN)
            db.add(user)
            db.commit()
            db.refresh(user)
        
        product = db.query(models.Product).first()
        if not product:
            print("No product found, creating test product...")
            p_in = schemas.ProductCreate(
                product_name="DIAG_PROD",
                supplier_name="DIAG_SUPP",
                order_number="DIAG-001",
                purchase_price=100.0,
                price=150.0,
                quantity=10,
                characteristics="initial diag"
            )
            product = crud.create_product(db, p_in, user.id)
            print(f"Created product ID: {product.id}")
        
        print(f"Initial Characteristics: {product.characteristics}")
        
        print("\nAttempting UPDATE via crud.update_product...")
        p_up = schemas.ProductUpdate(
            characteristics="DIAGNOSED_STATE_" + str(os.getpid()),
            media_urls=["https://test.com/diag.jpg"]
        )
        
        try:
            updated = crud.update_product(db, product.id, p_up, user.id)
            print(f"Update returned Characteristics: {updated.characteristics}")
        except Exception as e:
            print(f"UPDATE FAILED with error: {e}")
            import traceback
            traceback.print_exc()
            return

        # Commit again just in case (crud.py already does it but let's be sure)
        db.commit()
        
        # Read back purely through sqlite3 to bypass SQLAlchemy cache
        print("\nVerifying via direct sqlite3 query...")
        cursor.execute("SELECT characteristics, media_urls FROM products WHERE id = ?", (product.id,))
        row = cursor.fetchone()
        print(f"DB Current State: {row}")
        
        if row and row[0] == p_up.characteristics:
            print("\nSUCCESS: Data persisted correctly.")
        else:
            print("\nFAILURE: Data NOT persisted.")
            
        conn.close()

    finally:
        db.close()

if __name__ == "__main__":
    run_diagnostics()
