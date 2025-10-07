from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .auth_routes import auth_router
from .job_routes import job_router
from .database import engine, Base
import os

# -----------------------------
# Create app and DB
# -----------------------------
app = FastAPI(title="AI-Powered Task Queue Manager")

Base.metadata.create_all(bind=engine)

# -----------------------------
# Middleware
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend (adjust later)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Add this for session support
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY", "supersecretkey123"),
)

# -----------------------------
# Routers
# -----------------------------
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(job_router, prefix="/jobs", tags=["Jobs"])

@app.get("/")
def root():
    return {"message": "FastAPI backend running!"}
