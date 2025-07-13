from fastapi import WebSocket
from typing import Dict, Set

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    async def connect(self, room_id: str, websocket: WebSocket):       
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = set()
        self.active_connections[room_id].add(websocket)
    
    async def get_rooms(self):
        return self.active_connections
    
    async def set_rooms(self , rooms: Dict[str, Set[WebSocket]] ):
        self.active_connections = rooms
        return
            
    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.active_connections:
            self.active_connections[room_id].discard(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast(self, room_id: str, message: dict , websocket: WebSocket):
        for connection in self.active_connections.get(room_id, set()):
            if connection!=websocket:
                await connection.send_json(message)