# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from typing import List
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db

router = APIRouter(prefix="/api/courses", tags=["courses"])

@router.get("/", response_model=List[schemas.Course])
def read_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    courses = crud.get_courses(db, skip=skip, limit=limit)
    return courses

from deps import get_current_admin_user
import models

@router.post("/", response_model=schemas.Course)
def create_course(
    course: schemas.CourseCreate, 
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    return crud.create_course(db=db, course=course)

@router.put("/{course_id}", response_model=schemas.Course)
def update_course(
    course_id: int,
    course: schemas.CourseUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    updated = crud.update_course(db=db, course_id=course_id, course=course)
    if updated is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return updated

@router.get("/{course_id}", response_model=schemas.Course)
def read_course(course_id: int, db: Session = Depends(get_db)):
    course = crud.get_course_by_id(db, course_id=course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/{course_id}/modules", response_model=schemas.ModuleResponse)
def create_module_for_course(
    course_id: int, 
    modulo: schemas.ModuleCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    return crud.create_module(db=db, modulo=modulo, course_id=course_id)

@router.post("/modules/{module_id}/lessons", response_model=schemas.LessonResponse)
def create_lesson_for_module(
    module_id: int,
    lesson: schemas.LessonCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    return crud.create_lesson(db=db, lesson=lesson, module_id=module_id)

@router.put("/modules/{module_id}", response_model=schemas.ModuleResponse)
def update_module(
    module_id: int,
    modulo: schemas.ModuleUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    updated = crud.update_module(db, module_id, modulo)
    if not updated: raise HTTPException(status_code=404, detail="Module not found")
    return updated

@router.put("/lessons/{lesson_id}", response_model=schemas.LessonResponse)
def update_lesson(
    lesson_id: int,
    lesson: schemas.LessonUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    updated = crud.update_lesson(db, lesson_id, lesson)
    if not updated: raise HTTPException(status_code=404, detail="Lesson not found")
    return updated

from deps import get_current_active_user

@router.get("/{course_id}/progress")
def get_progress(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    progress = crud.get_user_progress(db, user_id=current_user.id, course_id=course_id)
    return [p.leccion_id for p in progress]

@router.post("/{course_id}/progress/{lesson_id}")
def mark_progress(
    course_id: int,
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    prog = crud.mark_lesson_completed(db, user_id=current_user.id, course_id=course_id, lesson_id=lesson_id)
    if not prog:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"message": "Progreso guardado"}

@router.delete("/modules/{module_id}")
def delete_module(
    module_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    success = crud.delete_module(db, module_id)
    if not success:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"message": "Módulo eliminado"}

@router.delete("/lessons/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    success = crud.delete_lesson(db, lesson_id)
    if not success:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"message": "Lección eliminada"}
