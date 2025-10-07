from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from app.auth_routes import auth_router
from app.job_routes import job_router
from app.database import Base, engine
from flask_bcrypt import Bcrypt  # or from fastapi_bcrypt import Bcrypt if using FastAPI
bcrypt = Bcrypt()


# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="AI-Powered Task Queue Manager")

# Add session middleware for JWT storage
app.add_middleware(SessionMiddleware, secret_key="supersecretkey")

# Include routers
app.include_router(auth_router)
app.include_router(job_router)
