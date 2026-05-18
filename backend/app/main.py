from fastapi import FastAPI
from app.routes import detection

app = FastAPI()

app.include_router(detection.router)

@app.get("/")
async def root():
    return {"message": "Backend Working"}