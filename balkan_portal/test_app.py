from fastapi.testclient import TestClient

from app import app


def test_portal_renders_without_core_network(monkeypatch):
    async def offline():
        return "checking"

    monkeypatch.setattr("app.core_status", offline)
    client = TestClient(app)
    response = client.get("/?lang=EN")
    assert response.status_code == 200
    assert "Balkan.works" in response.text
    assert "EN" in response.text
