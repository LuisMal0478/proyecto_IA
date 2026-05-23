# pyrefly: ignore [missing-import]
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import RoleEnum, EnrollmentStatus

class UserBase(BaseModel):
    email: EmailStr
    nombre: str

class UserCreate(UserBase):
    password: str

class UserCreateAdmin(UserBase):
    password: str
    rol: RoleEnum

class UserUpdate(BaseModel):
    nombre: Optional[str] = None
    foto_perfil: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class User(UserBase):
    id: int
    rol: RoleEnum
    foto_perfil: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserRegisterResponse(User):
    password_plain: str

class CourseBase(BaseModel):
    titulo: str
    descripcion: str
    imagen_url: Optional[str] = None
    nivel: Optional[str] = None
    duracion_estimada: Optional[str] = None
    instructor: Optional[str] = None
    objetivos: Optional[str] = None
    habilidades: Optional[str] = None
    requisitos: Optional[str] = None
    is_active: Optional[bool] = True

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    nivel: Optional[str] = None
    duracion_estimada: Optional[str] = None
    instructor: Optional[str] = None
    objetivos: Optional[str] = None
    habilidades: Optional[str] = None
    requisitos: Optional[str] = None
    is_active: Optional[bool] = None

class LessonBase(BaseModel):
    titulo: str
    tipo: str
    contenido: Optional[str] = None
    orden: int = 0

class LessonCreate(LessonBase):
    pass

class LessonUpdate(BaseModel):
    titulo: Optional[str] = None
    tipo: Optional[str] = None
    contenido: Optional[str] = None

class LessonResponse(LessonBase):
    id: int
    modulo_id: int
    class Config:
        from_attributes = True

class ModuleBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    tiempo_estimado: Optional[str] = None
    orden: int = 0

class ModuleCreate(ModuleBase):
    pass

class ModuleUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None

class ModuleResponse(ModuleBase):
    id: int
    curso_id: int
    lecciones: List[LessonResponse] = []
    class Config:
        from_attributes = True

class Course(CourseBase):
    id: int
    created_at: datetime
    modulos: List[ModuleResponse] = []

    class Config:
        from_attributes = True

class EnrollmentRequestBase(BaseModel):
    curso_id: int

class EnrollmentRequestCreate(EnrollmentRequestBase):
    pass

class EnrollmentRequest(EnrollmentRequestBase):
    id: int
    usuario_id: int
    estado: EnrollmentStatus
    fecha_solicitud: datetime
    usuario: Optional[UserBase] = None
    curso: Optional[CourseBase] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
