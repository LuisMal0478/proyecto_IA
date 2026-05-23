# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Depends, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
import models, schemas, database
from database import engine

from routers import auth, courses, enrollments, users
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Plataforma de Cursos API")

import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(enrollments.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de la Plataforma de Cursos"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
