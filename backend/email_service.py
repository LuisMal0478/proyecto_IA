import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "maldonadourielesluis@gmail.com")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "ustv syxq dxlv lhra")

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    # Intento 1: Puerto 587 (STARTTLS) con timeout de 6 segundos
    try:
        print(f"Intentando enviar correo vía STARTTLS (puerto {SMTP_PORT})...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=6)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Correo enviado exitosamente a {to_email} (STARTTLS)")
        return True
    except Exception as e587:
        print(f"Error con STARTTLS en puerto {SMTP_PORT}: {e587}")
        
        # Intento 2: Puerto 465 (SSL) como fallback con timeout de 6 segundos
        try:
            print("Intentando enviar correo vía SSL (puerto 465)...")
            server = smtplib.SMTP_SSL(SMTP_SERVER, 465, timeout=6)
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
            server.quit()
            print(f"Correo enviado exitosamente a {to_email} (SSL)")
            return True
        except Exception as e465:
            print(f"Error definitivo enviando correo a {to_email}: SSL={e465}, STARTTLS={e587}")
            return False

def send_approval_email(to_email: str, course_name: str, username: str):
    subject = f"¡Tu inscripción al curso {course_name} ha sido aprobada!"
    body = f"""
    <html>
        <body>
            <h2>¡Felicidades {username}!</h2>
            <p>Tu solicitud de inscripción para el curso <strong>{course_name}</strong> ha sido aprobada.</p>
            <p>Ya puedes iniciar sesión en la plataforma y comenzar a aprender.</p>
            <br>
            <p>Saludos,</p>
            <p>El equipo de la Plataforma de Cursos</p>
        </body>
    </html>
    """
    return send_email(to_email, subject, body)

def send_rejection_email(to_email: str, course_name: str, username: str):
    subject = f"Actualización sobre tu solicitud al curso {course_name}"
    body = f"""
    <html>
        <body>
            <h2>Hola {username},</h2>
            <p>Lamentamos informarte que tu solicitud de inscripción para el curso <strong>{course_name}</strong> no ha sido aprobada en esta ocasión.</p>
            <p>Si tienes alguna duda, por favor contáctanos.</p>
            <br>
            <p>Saludos,</p>
            <p>El equipo de la Plataforma de Cursos</p>
        </body>
    </html>
    """
    return send_email(to_email, subject, body)

def send_credentials_email(to_email: str, username: str, password_plain: str):
    subject = "Tus credenciales de acceso a la Plataforma de Cursos"
    body = f"""
    <html>
        <body>
            <h2>¡Hola {username}!</h2>
            <p>Tu cuenta ha sido creada exitosamente. Aquí están tus credenciales de acceso:</p>
            <ul>
                <li><strong>Correo:</strong> {to_email}</li>
                <li><strong>Contraseña:</strong> {password_plain}</li>
            </ul>
            <p>Por razones de seguridad, te recomendamos iniciar sesión y cambiar esta contraseña lo antes posible.</p>
            <br>
            <p>Saludos,</p>
            <p>El equipo de la Plataforma de Cursos</p>
        </body>
    </html>
    """
    print("\n" + "="*50)
    print("NUEVAS CREDENCIALES GENERADAS")
    print(f"Usuario: {to_email}")
    print(f"Contraseña: {password_plain}")
    print("="*50 + "\n")
    return send_email(to_email, subject, body)
