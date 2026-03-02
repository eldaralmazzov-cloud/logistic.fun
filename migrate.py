import sqlite3
import os

def migrate():
    try:
        db_path = os.path.join(os.path.dirname(__file__), "logistics.db")
        if not os.path.exists(db_path):
            print(f"Database not found at {db_path}")
            return

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # ... (columns list remains same)
        columns_to_add = [
            ("media_urls", "JSON"),
            ("characteristics", "TEXT"),
            ("price", "FLOAT DEFAULT 0.0 NOT NULL"),
            ("weight", "FLOAT"),
            ("size", "VARCHAR(100)"),
            ("packaging_size", "VARCHAR(100)"),
            
            # New Restructured Input Fields
            ("price_cny", "FLOAT DEFAULT 0.0"),
            ("cny_rate", "FLOAT DEFAULT 0.0"),
            ("places_count", "INTEGER DEFAULT 0"),
            ("weight_per_box", "FLOAT DEFAULT 0.0"),
            ("delivery_rate_usd_per_kg", "FLOAT DEFAULT 0.0"),
            ("usd_rate", "FLOAT DEFAULT 0.0"),
            ("service_percent", "FLOAT DEFAULT 10.0"),
            
            # Calculated Fields
            ("total_weight", "FLOAT DEFAULT 0.0"),
            ("product_cost_kgs", "FLOAT DEFAULT 0.0"),
            ("delivery_cost_usd", "FLOAT DEFAULT 0.0"),
            ("delivery_cost_kgs", "FLOAT DEFAULT 0.0"),
            ("service_fee", "FLOAT DEFAULT 0.0"),
            ("final_cost", "FLOAT DEFAULT 0.0"),
            ("total_volume", "FLOAT DEFAULT 0.0"),
            ("density", "FLOAT DEFAULT 0.0"),
            
            # Structured Data
            ("specifications", "JSON"),
            
            # Legacy / Compatibility
            ("delivery_usd_per_kg", "FLOAT DEFAULT 0.0"),
            ("total_cost_som", "FLOAT DEFAULT 0.0")
        ]

        for col_name, col_type in columns_to_add:
            try:
                cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}")
                print(f"Added column {col_name}")
            except sqlite3.OperationalError as e:
                if "duplicate column name" in str(e):
                    pass # Fine
                else:
                    print(f"Error adding column {col_name}: {e}")

        # Ensure existing quantities are not NULL
        try:
            cursor.execute("UPDATE products SET quantity = 0 WHERE quantity IS NULL")
        except: pass

        conn.commit()
        conn.close()
        print("Migration completed.")
    except Exception as e:
        print(f"CRITICAL: Migration failed: {e}")

if __name__ == "__main__":
    migrate()
