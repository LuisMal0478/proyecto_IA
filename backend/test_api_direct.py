from database import SessionLocal
import schemas
from routers.auth import register_user
# pyrefly: ignore [missing-import]
from fastapi import BackgroundTasks
import traceback

db = SessionLocal()
bg_tasks = BackgroundTasks()

user_in = schemas.UserBase(nombre="Test", email="test11@test.com")

try:
    res = register_user(user_in, background_tasks=bg_tasks, db=db)
    print("Success model:", res)
    out = schemas.User.model_validate(res)
    print("Success schema:", out)
except Exception as e:
    traceback.print_exc()
finally:
    db.close()
