from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



class Fastapigen:
    def __init__(self):
        self.origins=['*']
        self.app = FastAPI()
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=self.origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    def get_app(self):
        return self.app

