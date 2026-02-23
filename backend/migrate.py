import sqlite3
import os

def migrate():
    db_path = os.path.join(os.path.dirname(__file__), "logistics.db")
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Add new columns
    columns_to_add = [
        ("media_urls", "JSON"),
        ("characteristics", "TEXT"),
        ("price", "FLOAT DEFAULT 0.0 NOT NULL"),
        ("weight", "FLOAT"),
        ("size", "VARCHAR(100)"),
        ("packaging_size", "VARCHAR(100)")
    ]

    for col_name, col_type in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print(f"Column {col_name} already exists")
            else:
                print(f"Error adding column {col_name}: {e}")

    # Update quantity if needed (SQLite doesn't support ALTER TABLE CHANGE COLUMN)
    # We can at least ensure existing NULLs are 0
    try:
        cursor.execute("UPDATE products SET quantity = 0 WHERE quantity IS NULL")
        print("Updated existing NULL quantities to 0")
    except Exception as e:
        print(f"Error updating quantity: {e}")

    conn.commit()
    conn.close()
    print("Migration completed.")

if __name__ == "__main__":
    migrate()
