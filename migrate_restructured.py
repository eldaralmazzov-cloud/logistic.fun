import sqlite3
import os

def migrate():
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'logistics.db')
    if not os.path.exists(db_path):
        db_path = 'backend/logistics.db' 
        
    print(f"Connecting to {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    columns_to_add = [
        ("price_cny", "FLOAT DEFAULT 0.0"),
        ("cny_rate", "FLOAT DEFAULT 0.0"),
        ("places_count", "INTEGER DEFAULT 0"),
        ("weight_per_box", "FLOAT DEFAULT 0.0"),
        ("delivery_rate_usd_per_kg", "FLOAT DEFAULT 0.0"),
        ("usd_rate", "FLOAT DEFAULT 0.0"),
        ("service_percent", "FLOAT DEFAULT 10.0"),
        ("total_weight", "FLOAT DEFAULT 0.0"),
        ("product_cost_kgs", "FLOAT DEFAULT 0.0"),
        ("delivery_cost_usd", "FLOAT DEFAULT 0.0"),
        ("delivery_cost_kgs", "FLOAT DEFAULT 0.0"),
        ("service_fee", "FLOAT DEFAULT 0.0"),
        ("final_cost", "FLOAT DEFAULT 0.0"),
        ("specifications", "JSON")
    ]
    
    # Check existing columns
    cursor.execute("PRAGMA table_info(products)")
    existing_cols = [row[1] for row in cursor.fetchall()]
    
    for col_name, col_def in columns_to_add:
        if col_name not in existing_cols:
            print(f"Adding column {col_name}...")
            try:
                cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_def}")
                conn.commit()
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
        else:
            print(f"Column {col_name} already exists.")
            
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
