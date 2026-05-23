# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Enum
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
# pyrefly: ignore [missing-import]
from sqlalchemy.sql import func
import enum

from database import Base

class RoleEnum(str, enum.Enum):
    admin = "admin"
    student = "student"

class LessonType(str, enum.Enum):
    text = "text"
    video = "video"
    lab = "lab"
    quiz = "quiz"

class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    rol = Column(Enum(RoleEnum), default=RoleEnum.student)
    foto_perfil = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    solicitudes = relationship("EnrollmentRequest", back_populates="usuario")
    inscripciones = relationship("Enrollment", back_populates="usuario")

class Course(Base):
    __tablename__ = "cursos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    descripcion = Column(Text)
    imagen_url = Column(String, nullable=True)
    nivel = Column(String, nullable=True) # Basico, Intermedio, Avanzado
    duracion_estimada = Column(String, nullable=True)
    instructor = Column(String, nullable=True)
    objetivos = Column(Text, nullable=True) # Almacenado como texto/JSON
    habilidades = Column(Text, nullable=True) # Almacenado como texto/JSON
    requisitos = Column(Text, nullable=True) # Almacenado como texto/JSON
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    solicitudes = relationship("EnrollmentRequest", back_populates="curso")
    inscripciones = relationship("Enrollment", back_populates="curso")
    modulos = relationship("CourseModule", back_populates="curso", cascade="all, delete-orphan")
    progreso = relationship("UserProgress", back_populates="curso", cascade="all, delete-orphan")

class CourseModule(Base):
    __tablename__ = "modulos"

    id = Column(Integer, primary_key=True, index=True)
    curso_id = Column(Integer, ForeignKey("cursos.id"))
    titulo = Column(String)
    descripcion = Column(Text, nullable=True)
    tiempo_estimado = Column(String, nullable=True)
    orden = Column(Integer, default=0)

    curso = relationship("Course", back_populates="modulos")
    lecciones = relationship("Lesson", back_populates="modulo", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lecciones"

    id = Column(Integer, primary_key=True, index=True)
    modulo_id = Column(Integer, ForeignKey("modulos.id"))
    tipo = Column(Enum(LessonType), default=LessonType.text)
    titulo = Column(String)
    contenido = Column(Text, nullable=True) # Texto Markdown, URL de video, JSON de lab/quiz
    orden = Column(Integer, default=0)

    modulo = relationship("CourseModule", back_populates="lecciones")
    progreso_usuarios = relationship("UserProgress", back_populates="leccion", cascade="all, delete-orphan")

class UserProgress(Base):
    __tablename__ = "progreso_usuarios"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    curso_id = Column(Integer, ForeignKey("cursos.id"))
    modulo_id = Column(Integer, ForeignKey("modulos.id"))
    leccion_id = Column(Integer, ForeignKey("lecciones.id"))
    completada = Column(Boolean, default=False)
    puntaje = Column(Integer, nullable=True) # Para quizzes
    fecha_completado = Column(DateTime(timezone=True), nullable=True)

    usuario = relationship("User")
    curso = relationship("Course", back_populates="progreso")
    leccion = relationship("Lesson", back_populates="progreso_usuarios")

class EnrollmentStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class EnrollmentRequest(Base):
    __tablename__ = "solicitudes_inscripcion"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    curso_id = Column(Integer, ForeignKey("cursos.id"))
    estado = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.pending)
    fecha_solicitud = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("User", back_populates="solicitudes")
    curso = relationship("Course", back_populates="solicitudes")

class Enrollment(Base):
    __tablename__ = "inscripciones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    curso_id = Column(Integer, ForeignKey("cursos.id"))
    fecha_inscripcion = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("User", back_populates="inscripciones")
    curso = relationship("Course", back_populates="inscripciones")
