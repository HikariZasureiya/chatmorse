from typing import Optional
from fastapi import HTTPException
import random
import string
from models import User , Texts
from datetime import datetime ,timezone
from socketmanager import ConnectionManager

async def adduser(ip:str):
    userex: Optional[User] = await User.find_one(User.ipaddress == ip)
    if userex:
        return userex.username
     
    username=''
    while True:
        username = ''.join(random.choices(string.ascii_letters + string.digits, k=9))
        user: Optional[User] = await User.find_one(User.username == username)
        if not user:
            break
        
    newuser: User = User(
        username=username,
        ipaddress=str(ip),
        timestamp=str(datetime.now(tz=timezone.utc))
    )
    await newuser.insert() 
    return username


async def deleteuser(ip: str) -> bool:
    try:
        exip : Optional[User] = await User.find_one(User.ipaddress == ip)
        if exip:
            await exip.delete()
            return True
        return False
    except Exception as e:
        print(e)
        return False

