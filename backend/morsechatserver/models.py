from beanie import Document

class User(Document):
    username: str
    ipaddress: str
    timestamp: str

class Texts(Document):
    ipaddress: str
    roomid: str
    text: str
    morsetext: str
    timestamp: str