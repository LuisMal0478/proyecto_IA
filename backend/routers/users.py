# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
import models, schemas, security
from deps import get_current_active_user, get_db
import email_service

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user

from deps import get_current_admin_user
import crud

@router.get("/", response_model=list[schemas.User])
def get_all_users(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    return db.query(models.User).all()

@router.post("/admin", response_model=schemas.User)
def create_user_as_admin(
    user: schemas.UserCreateAdmin,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        nombre=user.nombre,
        hashed_password=hashed_password,
        rol=user.rol
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Enviar correo con credenciales
    background_tasks.add_task(email_service.send_credentials_email, user.email, user.nombre, user.password)
    
    return db_user

@router.put("/me", response_model=schemas.User)
def update_user_me(
    user_update: schemas.UserUpdate, 
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if user_update.nombre is not None:
        current_user.nombre = user_update.nombre
    if user_update.foto_perfil is not None:
        current_user.foto_perfil = user_update.foto_perfil
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/me/password")
def update_password_me(
    passwords: schemas.UserPasswordUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not security.verify_password(passwords.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")
    
    current_user.hashed_password = security.get_password_hash(passwords.new_password)
    db.commit()
    return {"message": "Contraseña actualizada exitosamente"}
