import sqlite3
import os

db_path = 'backend/logistics.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT id, product_name, packaging_size, places_count, total_volume, density FROM products LIMIT 5")
    rows = cursor.fetchall()
    print("Top 5 products:")
    for row in rows:
        print(row)
    
    cursor.execute("PRAGMA table_info(products)")
    cols = cursor.fetchall()
    print("\nColumns:")
    for col in cols:
        print(col)
    conn.close()
else:
    print(f"Database {db_path} not found")
