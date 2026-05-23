# pyrefly: ignore [missing-import]
from fastapi.testclient import TestClient
from main import app
import traceback

client = TestClient(app)

try:
    response = client.post("/api/auth/register", json={"nombre": "Test", "email": "test2@test.com"})
    print("STATUS:", response.status_code)
    print("BODY:", response.json())
except Exception as e:
    traceback.print_exc()
