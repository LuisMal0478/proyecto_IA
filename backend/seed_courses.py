import sys
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import schemas
import crud

def seed_data():
    db = SessionLocal()
    
    # 1. Curso: Algoritmos Genéticos
    course1 = models.Course(
        titulo="Algoritmos Genéticos Avanzados",
        descripcion="Aprende los fundamentos de la computación evolutiva. Diseña algoritmos que simulan la selección natural para resolver problemas complejos de optimización.",
        nivel="Intermedio",
        duracion_estimada="15 horas",
        instructor="Dr. Alan Turing"
    )
    db.add(course1)
    db.commit()
    db.refresh(course1)

    # Modulos curso 1
    mod1_c1 = models.CourseModule(curso_id=course1.id, titulo="Fundamentos Biológicos", descripcion="Entendiendo la evolución natural.", orden=1)
    mod2_c1 = models.CourseModule(curso_id=course1.id, titulo="Operadores Genéticos", descripcion="Selección, cruce y mutación.", orden=2)
    mod3_c1 = models.CourseModule(curso_id=course1.id, titulo="Simulación Interactiva", descripcion="Laboratorio práctico.", orden=3)
    db.add_all([mod1_c1, mod2_c1, mod3_c1])
    db.commit()
    
    # Lecciones curso 1
    l1 = models.Lesson(modulo_id=mod1_c1.id, tipo=models.LessonType.text, titulo="Introducción a la Evolución", contenido="<h1>¿Qué son los Algoritmos Genéticos?</h1><p>Los algoritmos genéticos son metaheurísticas inspiradas en el proceso de selección natural...</p>", orden=1)
    l2 = models.Lesson(modulo_id=mod2_c1.id, tipo=models.LessonType.video, titulo="Cruce y Mutación Explicados", contenido="https://www.youtube.com/embed/9zfeTw-uFcM", orden=1)
    l3 = models.Lesson(modulo_id=mod3_c1.id, tipo=models.LessonType.lab, titulo="Laboratorio: Evolución en Tiempo Real", contenido="", orden=1)
    db.add_all([l1, l2, l3])
    db.commit()

    # 2. Curso: Programación Lineal
    course2 = models.Course(
        titulo="Programación Lineal y Optimización",
        descripcion="Domina la investigación de operaciones. Formula modelos matemáticos y maximiza recursos utilizando el método gráfico y Simplex.",
        nivel="Básico",
        duracion_estimada="20 horas",
        instructor="Prof. George Dantzig"
    )
    db.add(course2)
    db.commit()
    db.refresh(course2)

    mod1_c2 = models.CourseModule(curso_id=course2.id, titulo="Modelado Matemático", descripcion="Funciones objetivo y restricciones.", orden=1)
    mod2_c2 = models.CourseModule(curso_id=course2.id, titulo="Método Gráfico", descripcion="Solución visual de 2 variables.", orden=2)
    mod3_c2 = models.CourseModule(curso_id=course2.id, titulo="Resolutor (Solver)", descripcion="Laboratorio interactivo.", orden=3)
    db.add_all([mod1_c2, mod2_c2, mod3_c2])
    db.commit()
    
    l4 = models.Lesson(modulo_id=mod1_c2.id, tipo=models.LessonType.text, titulo="Formulación de Problemas", contenido="<h1>La Función Objetivo</h1><p>Todo problema de programación lineal busca maximizar o minimizar una ecuación lineal sujeta a restricciones de recursos.</p>", orden=1)
    l5 = models.Lesson(modulo_id=mod2_c2.id, tipo=models.LessonType.video, titulo="Solución Gráfica", contenido="https://www.youtube.com/embed/M4K6HYLHREQ", orden=1)
    l6 = models.Lesson(modulo_id=mod3_c2.id, tipo=models.LessonType.lab, titulo="Laboratorio: Método Simplex", contenido="", orden=1)
    db.add_all([l4, l5, l6])
    db.commit()

    # 3. Curso: Inteligencia Artificial
    course3 = models.Course(
        titulo="Inteligencia Artificial: Machine Learning",
        descripcion="Entrena tus propios modelos de datos. Aprende la diferencia entre aprendizaje supervisado y no supervisado de manera interactiva.",
        nivel="Avanzado",
        duracion_estimada="40 horas",
        instructor="Dra. Ada Lovelace"
    )
    db.add(course3)
    db.commit()
    db.refresh(course3)

    mod1_c3 = models.CourseModule(curso_id=course3.id, titulo="Conceptos de Machine Learning", descripcion="Teoría básica y algoritmos.", orden=1)
    mod2_c3 = models.CourseModule(curso_id=course3.id, titulo="Redes Neuronales", descripcion="Introducción al Deep Learning.", orden=2)
    mod3_c3 = models.CourseModule(curso_id=course3.id, titulo="Entrenamiento de Modelos", descripcion="Sube tu CSV.", orden=3)
    db.add_all([mod1_c3, mod2_c3, mod3_c3])
    db.commit()
    
    l7 = models.Lesson(modulo_id=mod1_c3.id, tipo=models.LessonType.text, titulo="Aprendizaje Supervisado", contenido="<h1>Clasificación vs Regresión</h1><p>El aprendizaje supervisado utiliza un conjunto de datos etiquetado para entrenar algoritmos que clasifican datos o predicen resultados con precisión.</p>", orden=1)
    l8 = models.Lesson(modulo_id=mod2_c3.id, tipo=models.LessonType.quiz, titulo="Evaluación Teórica", contenido="", orden=1)
    l9 = models.Lesson(modulo_id=mod3_c3.id, tipo=models.LessonType.lab, titulo="Laboratorio: Entrenar con CSV", contenido="", orden=1)
    db.add_all([l7, l8, l9])
    db.commit()

    print("✅ Base de datos poblada exitosamente con los 3 cursos y su contenido (Módulos y Lecciones).")
    db.close()

if __name__ == "__main__":
    seed_data()
