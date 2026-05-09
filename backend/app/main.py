from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routes import detection, alerts, reports, lands

app = FastAPI(
    title="OrbitaGen API",
    description="AI-driven GIS land encroachment detection backend",
    version="1.0.0",
)

# Allow requests from your Next.js frontend
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detection.router)
app.include_router(alerts.router)
app.include_router(reports.router)
app.include_router(lands.router)


@app.get("/")
def health():
    return {
        "status":  "running",
        "system":  "OrbitaGen v1.0",
        "docs":    "http://localhost:8000/docs",
    }