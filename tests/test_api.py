import unittest
from fastapi.testclient import TestClient
from api.index import app

class TestFastAPIBasic(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {"status": "ok"})

    def test_catalog_products(self):
        res = self.client.get("/api/catalog/products/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)
        # Check first product has variants
        self.assertIn("variants", data[0])
        self.assertGreater(len(data[0]["variants"]), 0)

    def test_admin_auth_and_protected_route(self):
        # Invalid login
        res_fail = self.client.post("/api/admin/token", data={"username": "wrong", "password": "wrong"})
        self.assertEqual(res_fail.status_code, 401)

        # Valid login
        res_ok = self.client.post("/api/admin/token", data={"username": "admin", "password": "adminpassword123"})
        self.assertEqual(res_ok.status_code, 200)
        token = res_ok.json()["access_token"]

        # Check me
        res_me = self.client.get("/api/admin/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(res_me.status_code, 200)
        self.assertEqual(res_me.json()["username"], "admin")

    def test_ai_agent_chat_endpoint(self):
        res = self.client.post("/api/ai/chat", json={"message": "Здравствуйте!"})
        self.assertEqual(res.status_code, 200)
        self.assertIn("reply", res.json())

if __name__ == "__main__":
    unittest.main()
