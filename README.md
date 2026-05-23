<<<<<<< HEAD
# Plataforma de Cursos Virtuales (LMS) - Proyecto IA

Una plataforma integral de aprendizaje en línea (LMS) diseñada para gestionar cursos, inscripciones de estudiantes, contenido interactivo y seguimiento del progreso. El proyecto incluye un panel de administración para la gestión de usuarios y contenido, así como un entorno de estudiante para tomar lecciones, realizar exámenes (quizzes) e interactuar con herramientas dinámicas.

---

## 🚀 Características Principales

### 👨‍🎓 Para Estudiantes
* **Registro e Inicio de Sesión:** Sistema de autenticación con envío de credenciales por correo electrónico.
* **Exploración de Cursos:** Visualización del catálogo de cursos disponibles clasificados por nivel (Básico, Intermedio, Avanzado).
* **Inscripción a Cursos:** Solicitud de inscripción a cursos, sujeta a la aprobación de un administrador.
* **Visualizador de Cursos (Course Viewer):** Entorno de estudio que muestra los módulos y lecciones de forma estructurada. Soporte para contenido en formato de texto enriquecido, recursos multimedia y cuestionarios interactivos.
* **Módulos Interactivos Especiales:** Incluye herramientas como simuladores de *Algoritmos Genéticos*.
* **Seguimiento de Progreso:** Marca automática y manual de lecciones completadas para llevar el rastreo del avance en cada curso.

### 🛡️ Para Administradores (Admin Dashboard)
* **Gestión de Usuarios:** Creación de nuevos usuarios (Estudiantes y Administradores) con generación automática de contraseñas y notificaciones por correo.
* **Gestión de Solicitudes:** Aprobación o rechazo de las solicitudes de inscripción a los cursos.
* **Creador de Cursos (Course Builder):** Herramienta completa para estructurar cursos mediante la creación de Módulos y Lecciones.
* **Editor de Contenido WYSIWYG:** Integración de un editor de texto enriquecido y un *Quiz Builder* para crear exámenes directamente desde el panel de administración.

---

## 🛠️ Tecnologías Utilizadas

### Frontend (Interfaz de Usuario)
* **React.js (Vite):** Framework principal para la construcción de interfaces dinámicas y rápidas.
* **React Router DOM:** Para la navegación y enrutamiento entre páginas (Dashboard, Editor, Viewer).
* **Tailwind CSS:** Para estilos rápidos, responsivos y estética moderna (Dark mode soportado).
* **Lucide React:** Biblioteca de iconos ligeros y consistentes.
* **Axios:** Para la comunicación HTTP con la API del backend.

### Backend (Servidor y API)
* **FastAPI:** Framework de Python altamente eficiente para la creación de la API REST.
* **SQLAlchemy:** ORM para la gestión y estructuración de la base de datos de manera relacional.
* **SQLite:** Base de datos ligera y portátil (`sql_app.db`) ideal para entornos de desarrollo y proyectos de pequeña/mediana escala.
* **Pydantic:** Para la validación de datos (Schemas) de manera estricta y automática.
* **PyJWT & Passlib:** Manejo de seguridad mediante autenticación por tokens JWT y encriptación de contraseñas.
* **Smtplib (Python nativo):** Servicio en segundo plano (`BackgroundTasks`) para el envío automatizado de correos electrónicos.

---

## 📂 Estructura del Proyecto

El proyecto está dividido en dos partes principales:

```text
proyecto_IA/
│
├── backend/                  # Código del servidor (FastAPI)
│   ├── main.py               # Punto de entrada de la aplicación
│   ├── models.py             # Modelos de base de datos (SQLAlchemy)
│   ├── schemas.py            # Validadores de datos (Pydantic)
│   ├── crud.py               # Operaciones directas a la base de datos (Create, Read, Update, Delete)
│   ├── database.py           # Configuración de conexión a SQLite
│   ├── email_service.py      # Lógica de envío de correos por SMTP
│   ├── security.py           # Utilidades de encriptación y tokens
│   ├── deps.py               # Dependencias de inyección (Autenticación y Sesión DB)
│   └── routers/              # Controladores de rutas divididos por dominio
│       ├── auth.py           # Login y Registro
│       ├── users.py          # Gestión de usuarios
│       ├── courses.py        # Gestión de cursos y módulos
│       └── enrollments.py    # Inscripciones y progreso
│
└── frontend/                 # Código de la aplicación web (React)
    ├── package.json          # Dependencias y scripts de Node
    ├── vite.config.js        # Configuración de empaquetador
    └── src/
        ├── App.jsx           # Enrutador principal de React
        ├── api/
        │   └── axios.js      # Configuración del cliente HTTP e Interceptores
        ├── components/       # Componentes reutilizables (Navbar, Layouts, Dashboards)
        └── pages/            # Vistas principales de la aplicación
            ├── Login.jsx     
            ├── Register.jsx  
            ├── CourseEditor.jsx # Herramienta de creación del curso
            └── CourseViewer.jsx # Visualizador para el estudiante
```

---

## ⚙️ Instalación y Configuración Local

### Requisitos Previos
* Node.js y npm instalados.
* Python 3.9 o superior.

### 1. Configuración del Backend
1. Abre una terminal y navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Crea y activa un entorno virtual:
   ```bash
   python -m venv venv
   # En Windows:
   .\venv\Scripts\activate
   ```
3. Instala las dependencias:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic pydantic[email] passlib[bcrypt] python-jose python-multipart
   ```
4. Inicia el servidor:
   ```bash
   uvicorn main:app --reload
   ```
   > El servidor backend correrá en `http://localhost:8000`. Puedes ver la documentación de la API generada automáticamente en `http://localhost:8000/docs`.

### 2. Configuración del Frontend
1. Abre una nueva pestaña en la terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de Node:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   > La aplicación web estará disponible en `http://localhost:5173`.

---

## 💡 Notas de Desarrollo
* **Variables de Entorno y Seguridad:** En entornos de producción, las credenciales del servicio de correos (`email_service.py`) y las claves secretas JWT (`security.py`) deben moverse a variables de entorno (`.env`) para evitar su exposición en el código fuente.
* **Manejo de Correos:** El servicio de correo está configurado actualmente con SMTP de Gmail. En entornos de red restringidos (como Firewalls corporativos o ISPs bloqueando el puerto 587/465), el backend imprimirá automáticamente las contraseñas creadas en la consola como medida de contingencia (fallback).
=======
# proyecto_IA
>>>>>>> 7505974026a68fe32a57f1c78e42e33db52037b9
