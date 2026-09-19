import sys
import os

# Ensure root directory is in sys.path for Vercel Serverless Python
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.database import engine, Base
from api.routers import admin, catalog, ai_agent

# Create db tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bula Mebel API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(catalog.router, prefix="/api/catalog", tags=["catalog"])
app.include_router(ai_agent.router, prefix="/api/ai", tags=["ai"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

handler = app
