# pyrefly: ignore [missing-import]
from datetime import timedelta
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
# pyrefly: ignore [missing-import]
from fastapi.security import OAuth2PasswordRequestForm
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
import crud, models, schemas, security
from database import get_db
import email_service
import secrets
import string

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserRegisterResponse)
def register_user(user: schemas.UserBase, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    
    # Generar contraseña aleatoria de 10 caracteres
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(10))
    
    new_user = crud.create_user(db=db, user=user, plain_password=password)
    
    # Enviar correo con credenciales
    background_tasks.add_task(email_service.send_credentials_email, user.email, user.nombre, password)
    
    return {
        "id": new_user.id,
        "email": new_user.email,
        "nombre": new_user.nombre,
        "rol": new_user.rol,
        "is_active": new_user.is_active,
        "created_at": new_user.created_at,
        "foto_perfil": new_user.foto_perfil,
        "password_plain": password
    }

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
