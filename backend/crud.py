# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
import models, schemas, security

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserBase, plain_password: str):
    hashed_password = security.get_password_hash(plain_password)
    db_user = models.User(
        nombre=user.nombre,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_courses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Course).offset(skip).limit(limit).all()

def create_course(db: Session, course: schemas.CourseCreate):
    db_course = models.Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def update_course(db: Session, course_id: int, course: schemas.CourseUpdate):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_course:
        return None
    
    # Obtener los datos como diccionario excluyendo los no establecidos
    update_data = course.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_course, key, value)
        
    db.commit()
    db.refresh(db_course)
    return db_course

def request_enrollment(db: Session, enrollment: schemas.EnrollmentRequestCreate, user_id: int):
    db_enrollment = models.EnrollmentRequest(
        curso_id=enrollment.curso_id,
        usuario_id=user_id,
        estado=models.EnrollmentStatus.pending
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment
def get_all_enrollment_requests(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.EnrollmentRequest).offset(skip).limit(limit).all()

def get_enrollment_requests_by_user(db: Session, user_id: int):
    return db.query(models.EnrollmentRequest).filter(models.EnrollmentRequest.usuario_id == user_id).all()

def get_course_by_id(db: Session, course_id: int):
    return db.query(models.Course).filter(models.Course.id == course_id).first()

def create_module(db: Session, modulo: schemas.ModuleCreate, course_id: int):
    db_module = models.CourseModule(**modulo.model_dump(), curso_id=course_id)
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module

def update_module(db: Session, module_id: int, modulo: schemas.ModuleUpdate):
    db_module = db.query(models.CourseModule).filter(models.CourseModule.id == module_id).first()
    if not db_module: return None
    if modulo.titulo is not None: db_module.titulo = modulo.titulo
    if modulo.descripcion is not None: db_module.descripcion = modulo.descripcion
    db.commit()
    db.refresh(db_module)
    return db_module

def create_lesson(db: Session, lesson: schemas.LessonCreate, module_id: int):
    db_lesson = models.Lesson(**lesson.model_dump(), modulo_id=module_id)
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

def update_lesson(db: Session, lesson_id: int, lesson: schemas.LessonUpdate):
    db_lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not db_lesson: return None
    if lesson.titulo is not None: db_lesson.titulo = lesson.titulo
    if lesson.tipo is not None: db_lesson.tipo = lesson.tipo
    if lesson.contenido is not None: db_lesson.contenido = lesson.contenido
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

def mark_lesson_completed(db: Session, user_id: int, course_id: int, lesson_id: int):
    # First get the lesson to find the modulo_id
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson: return None

    # Check if progress exists
    prog = db.query(models.UserProgress).filter(
        models.UserProgress.usuario_id == user_id,
        models.UserProgress.leccion_id == lesson_id
    ).first()

    if not prog:
        prog = models.UserProgress(
            usuario_id=user_id,
            curso_id=course_id,
            modulo_id=lesson.modulo_id,
            leccion_id=lesson_id,
            completada=True
        )
        db.add(prog)
    else:
        prog.completada = True

    db.commit()
    db.refresh(prog)
    return prog

def get_user_progress(db: Session, user_id: int, course_id: int):
    return db.query(models.UserProgress).filter(
        models.UserProgress.usuario_id == user_id,
        models.UserProgress.curso_id == course_id,
        models.UserProgress.completada == True
    ).all()

def delete_module(db: Session, module_id: int):
    db_module = db.query(models.CourseModule).filter(models.CourseModule.id == module_id).first()
    if not db_module:
        return False
    # Eliminar explícitamente el progreso de los usuarios para evitar conflictos de clave foránea
    db.query(models.UserProgress).filter(models.UserProgress.modulo_id == module_id).delete()
    db.delete(db_module)
    db.commit()
    return True

def delete_lesson(db: Session, lesson_id: int):
    db_lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not db_lesson:
        return False
    # Eliminar explícitamente el progreso de los usuarios para esta lección
    db.query(models.UserProgress).filter(models.UserProgress.leccion_id == lesson_id).delete()
    db.delete(db_lesson)
    db.commit()
    return True
