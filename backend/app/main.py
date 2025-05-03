from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import random
import logging
from fastapi import APIRouter

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logger configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# WebSocket connection management
clients = set()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)
    try:
        while True:
            await asyncio.sleep(15)
            await websocket.send_json({
                "value": "Heartbeat"
            })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        clients.remove(websocket)


class Message(BaseModel):
    value: str
    status: int

@app.post("/api/send-message")
async def send_message(msg: Message):
    disconnected = []
    for client in clients:
        try:
            await client.send_json({"value": msg.value, "status": msg.status})
        except Exception as e:
            disconnected.append(client)
    # Clean up disconnected clients
    for d in disconnected:
        clients.remove(d)
    return {"status": "message sent", "to": len(clients)}

router = APIRouter()


class Metric(BaseModel):
    id: int
    value: float
    timestamp: str

@app.get("/api/historical-data")
async def get_historical_data():
    # return [{"timestamp": "2025-05-03T12:00:00Z", "value": 42}]
    result = [  ]
    for i in range(10):
        result.append(Metric(
        id=random.randint(1, 1000),
        value=random.uniform(0, 100),
        timestamp="2023-10-01T12:00:00Z"  # Placeholder timestamp
    ))
    return result