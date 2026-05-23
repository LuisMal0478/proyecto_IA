from database import SessionLocal
import models

db = SessionLocal()

try:
    # Obtener usuarios que son estudiantes
    students = db.query(models.User).filter(models.User.rol == "student").all()
    count = len(students)
    
    for student in students:
        db.delete(student)
        
    db.commit()
    print(f"Borrados {count} usuarios estudiantes.")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
