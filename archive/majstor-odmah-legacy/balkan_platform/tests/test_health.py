from app.main import health


def test_health_contract() -> None:
    response = health()
    assert response["status"] == "ok"
    assert response["service"] == "balkan-core"
