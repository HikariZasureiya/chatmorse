import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.join(BASE_DIR, "morsechatserver")
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

from fastapi import FastAPI , WebSocket, WebSocketDisconnect
from morsechatserver.appsettings import Fastapigen

app = Fastapigen().get_app()

@app.get("/")
async def val():
    return {"message": "welcome to morsechat"}

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[room_id , list[WebSocket]] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


