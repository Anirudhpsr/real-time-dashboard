import sys
import os
import pytest
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocketDisconnect

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app, Message

client = TestClient(app)

# Test for the WebSocket endpoint
@pytest.mark.asyncio
async def test_websocket_endpoint():
    with client.websocket_connect("/ws") as websocket:
        # Receive the initial heartbeat message
        data = websocket.receive_json()
        assert data["value"] == "Heartbeat"

# Test for the POST /api/send-message endpoint
def test_send_message():
    payload = {"value": "Hello, World!", "status": 200}
    response = client.post("/api/send-message", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "message sent"
    assert response.json()["to"] == 0  # No active WebSocket clients in this test

# Test for the GET /api/historical-data endpoint
def test_get_historical_data():
    response = client.get("/api/historical-data")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10  # Ensure 10 metrics are returned
    for metric in data:
        assert "id" in metric
        assert "value" in metric
        assert "timestamp" in metric