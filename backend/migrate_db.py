import sqlite3
from database import engine, Base
import models

def upgrade_db():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    new_columns = [
        ("nivel", "VARCHAR"),
        ("duracion_estimada", "VARCHAR"),
        ("instructor", "VARCHAR"),
        ("objetivos", "TEXT"),
        ("habilidades", "TEXT"),
        ("requisitos", "TEXT"),
        ("is_active", "BOOLEAN DEFAULT 1")
    ]
    
    for col, dtype in new_columns:
        try:
            cursor.execute(f"ALTER TABLE cursos ADD COLUMN {col} {dtype}")
            print(f"Added column {col} to cursos")
        except sqlite3.OperationalError as e:
            print(f"Skipped {col}: {e}")
            
    conn.commit()
    conn.close()
    
    Base.metadata.create_all(bind=engine)
    print("Tablas nuevas creadas o actualizadas.")
    
if __name__ == "__main__":
    upgrade_db()
