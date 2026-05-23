# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db
from deps import get_current_user, get_current_admin_user
from typing import List
import models

router = APIRouter(prefix="/api/enrollments", tags=["enrollments"])

@router.get("/requests", response_model=List[schemas.EnrollmentRequest])
def get_all_requests(
    skip: int = 0, limit: int = 100, 
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    return crud.get_all_enrollment_requests(db, skip=skip, limit=limit)

@router.get("/my-requests", response_model=List[schemas.EnrollmentRequest])
def get_my_requests(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_enrollment_requests_by_user(db, user_id=current_user.id)

@router.post("/request", response_model=schemas.EnrollmentRequest)
def request_course_enrollment(
    enrollment: schemas.EnrollmentRequestCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    course = db.query(models.Course).filter(models.Course.id == enrollment.curso_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    if not course.is_active:
        raise HTTPException(status_code=400, detail="Este curso está inactivo y no acepta solicitudes.")
    return crud.request_enrollment(db=db, enrollment=enrollment, user_id=current_user.id)

from deps import get_current_admin_user
import email_service
# pyrefly: ignore [missing-import]
from fastapi import BackgroundTasks

@router.put("/{enrollment_id}/approve", response_model=schemas.EnrollmentRequest)
def approve_enrollment(
    enrollment_id: int, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    db_enrollment = db.query(models.EnrollmentRequest).filter(models.EnrollmentRequest.id == enrollment_id).first()
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    
    db_enrollment.estado = models.EnrollmentStatus.approved
    db.commit()
    db.refresh(db_enrollment)

    # Crear la inscripción real
    db_enrollment_actual = models.Enrollment(usuario_id=db_enrollment.usuario_id, curso_id=db_enrollment.curso_id)
    db.add(db_enrollment_actual)
    db.commit()

    user = db_enrollment.usuario
    course = db_enrollment.curso
    background_tasks.add_task(email_service.send_approval_email, user.email, course.titulo, user.nombre)

    return db_enrollment

@router.put("/{enrollment_id}/reject", response_model=schemas.EnrollmentRequest)
def reject_enrollment(
    enrollment_id: int, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    db_enrollment = db.query(models.EnrollmentRequest).filter(models.EnrollmentRequest.id == enrollment_id).first()
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    
    db_enrollment.estado = models.EnrollmentStatus.rejected
    db.commit()
    db.refresh(db_enrollment)

    user = db_enrollment.usuario
    course = db_enrollment.curso
    background_tasks.add_task(email_service.send_rejection_email, user.email, course.titulo, user.nombre)

    return db_enrollment
