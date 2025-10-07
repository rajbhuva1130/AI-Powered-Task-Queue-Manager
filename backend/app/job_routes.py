from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime

from app.database import SessionLocal
from app.models import Job
from app.config import settings
from app.schemas import JobCreate, JobUpdate

# --------------------------------------------------------------------
# Router Setup
# --------------------------------------------------------------------
job_router = APIRouter(prefix="/jobs", tags=["Jobs"])

SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = settings.JWT_ALGORITHM


# --------------------------------------------------------------------
# Dependency: Get Database Session
# --------------------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------------------------
# Helper: Get Current User ID from Session JWT
# --------------------------------------------------------------------
def get_current_user_id(request: Request):
    """
    Extracts the user's ID from JWT stored in session.
    If token is invalid or missing, raises HTTP 401.
    """
    token = request.session.get("jwt_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return int(sub)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# --------------------------------------------------------------------
# CREATE a new Job
# --------------------------------------------------------------------
@job_router.post("/")
def create_job(data: JobCreate, request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user_id(request)

    if not data.title:
        raise HTTPException(status_code=400, detail="Title is required")

    job = Job(
        user_id=user_id,
        title=data.title,
        description=data.description,
        status="queued",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return {"message": "Job created successfully", "job": job.to_dict()}


# --------------------------------------------------------------------
# READ all Jobs for Current User
# --------------------------------------------------------------------
@job_router.get("/")
def get_all_jobs(request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user_id(request)
    jobs = db.query(Job).filter(Job.user_id == user_id).order_by(Job.created_at.desc()).all()
    return [job.to_dict() for job in jobs]


# --------------------------------------------------------------------
# READ single Job by ID
# --------------------------------------------------------------------
@job_router.get("/{job_id}")
def get_job(job_id: int, request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user_id(request)
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == user_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return job.to_dict()


# --------------------------------------------------------------------
# UPDATE Job
# --------------------------------------------------------------------
@job_router.put("/{job_id}")
def update_job(job_id: int, data: JobUpdate, request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user_id(request)
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == user_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Use `data.dict(exclude_unset=True)` to update only provided fields
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)

    job.updated_at = datetime.utcnow()  # type: ignore
    db.commit()
    db.refresh(job)

    return {"message": "Job updated successfully", "job": job.to_dict()}


# --------------------------------------------------------------------
# DELETE Job
# --------------------------------------------------------------------
@job_router.delete("/{job_id}")
def delete_job(job_id: int, request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user_id(request)
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == user_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()

    return {"message": f"Job {job_id} deleted successfully"}
