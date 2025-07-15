import os
import sys
from dotenv import load_dotenv
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.join(BASE_DIR, "morsechatserver")
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

load_dotenv()
mongoconnector = os.getenv("MONGO_CONNECTOR")
from fastapi import FastAPI , WebSocket, WebSocketDisconnect , Request , HTTPException
from socketmanager import ConnectionManager
from models import User , Texts
from fastapi.middleware.cors import CORSMiddleware
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime ,timezone
from utils.utils import adduser , deleteuser
from typing import Optional
import random
import string

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://morsetalk.vercel.app", "https://www.cron-job.org" , "http://localhost:3000"],
    # allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


publicmanager = ConnectionManager()
@app.on_event("startup")
async def app_init():
    try:
        client = AsyncIOMotorClient(mongoconnector)
        await init_beanie(database=client.testdb, document_models=[User , Texts])
    except Exception as e:
        print("failed" , e)


@app.get("/")
async def val():
    return {"message": "welcome to morsechat"}


@app.get("/ws/createroom")
async def create_room():
    for _ in range(500):
        code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
        public_rooms = await publicmanager.get_rooms()
        if code not in public_rooms:
            public_rooms = public_rooms.copy()
            public_rooms[code] = set()
            await publicmanager.set_rooms(public_rooms)
            return {"code": code}
    return {"error": "Failed to generate a unique room code after multiple attempts"}
    

@app.get("/genuser")
async def usernam(request: Request):
    username:str = await adduser(request.client.host)
    return {"username": username}

@app.get("/deluser")
async def delusrname(request: Request):
    try:
        ip = request.client.host
        await deleteuser(ip)
        return {"success": "deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid request")

# @app.get("/getalluser")
# async def getall():
#     all_users = await User.find_all().to_list()
#     return all_users

# @app.get("/getallrooms")
# async def getall():
#     public_rooms = await publicmanager.get_rooms()
#     print("public_rooms: " , public_rooms)

@app.get("/getrooms")
async def getall():
    public_rooms = await publicmanager.get_rooms()
    arr = sorted(public_rooms.keys(), key=lambda x: len(public_rooms[x]), reverse=True)
    ret = []
    for room_id in arr[:20]:
        if len(public_rooms[room_id]) > 0:
            ret.append({
                "roomid": room_id,
                "number": len(public_rooms[room_id]) 
            })
        else:
            del public_rooms[room_id]
    return ret

@app.get("/roomhas/{room_id}")
async def room_has(request: Request , room_id: str):
    public_rooms = await publicmanager.get_rooms()
    if room_id not in public_rooms:
        raise HTTPException(status_code=404, detail="room not found")
    return {"message": "room found"}
    


@app.websocket("/ws/morsechatserver/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await publicmanager.connect(room_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await publicmanager.broadcast(room_id, data , websocket)
    except WebSocketDisconnect:
        await deleteuser(websocket.client.host)
        publicmanager.disconnect(room_id, websocket)
