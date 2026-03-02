import sys
import os

# Ensure backend directory is in path for imports
sys.path.append(os.path.join(os.getcwd(), 'backend'))

import models
from database import SessionLocal
from crud import recalculate_product_costs

def recalculate_all():
    db = SessionLocal()
    try:
        products = db.query(models.Product).all()
        print(f"Found {len(products)} products to recalculate.")
        
        for p in products:
            print(f"Recalculating product ID {p.id}: {p.product_name}")
            recalculate_product_costs(p)
            
        db.commit()
        print("Successfully recalculated all products.")
    except Exception as e:
        db.rollback()
        print(f"Error during recalculation: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    recalculate_all()
