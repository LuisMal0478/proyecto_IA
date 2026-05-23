from database import SessionLocal
from models import User, RoleEnum
import security

db = SessionLocal()

admin_email = "admin@plataforma.com"
admin_password = "adminpassword123"

admin_user = db.query(User).filter(User.email == admin_email).first()

if not admin_user:
    hashed_pwd = security.get_password_hash(admin_password)
    new_admin = User(
        nombre="Administrador Principal",
        email=admin_email,
        hashed_password=hashed_pwd,
        rol=RoleEnum.admin,
        is_active=True
    )
    db.add(new_admin)
    db.commit()
    print("Admin user created successfully.")
else:
    admin_user.hashed_password = security.get_password_hash(admin_password)
    admin_user.rol = RoleEnum.admin
    db.commit()
    print("Admin user updated successfully.")

db.close()
