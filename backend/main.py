from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router

class App:
    def __init__(self):
        self.app = FastAPI()
        self.origins = ["http://localhost:3000"]
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=self.origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        self.app.include_router(router)

app = App().app
