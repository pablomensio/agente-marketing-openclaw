from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] in ["ok", "error"]

def test_settings_masked():
    response = client.get("/api/settings")
    assert response.status_code == 200
    data = response.json()
    assert "meta_api_key_masked" in data
    assert "****" in data["meta_api_key_masked"]

def test_get_campaigns():
    response = client.get("/api/campaigns")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
