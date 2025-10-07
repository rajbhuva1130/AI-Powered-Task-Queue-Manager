from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime

from app.database import SessionLocal
from app.models import Job
from app.config import settings
from app.schemas import JobCreate, JobUpdate
from app.utils.auth_helper import get_current_user_id

# --------------------------------------------------------------------
# Router Setup
# --------------------------------------------------------------------
job_router = APIRouter(tags=["Jobs"])

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
# CREATE a new Job
# --------------------------------------------------------------------
@job_router.post("/")
def create_job(data: JobCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
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
def get_all_jobs(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    jobs = db.query(Job).filter(Job.user_id == user_id).order_by(Job.created_at.desc()).all()
    return [job.to_dict() for job in jobs]

# --------------------------------------------------------------------
# READ single Job by ID
# --------------------------------------------------------------------
@job_router.get("/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == user_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job.to_dict()

# --------------------------------------------------------------------
# UPDATE Job
# --------------------------------------------------------------------
@job_router.put("/{job_id}")
def update_job(
    job_id: int,
    data: JobUpdate,
    request: Request,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),  # ✅ FIXED — move Depends here
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == user_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)

    job.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(job)

    return {"message": "Job updated successfully", "job": job.to_dict()}


# --------------------------------------------------------------------
# DELETE Job
# --------------------------------------------------------------------
@job_router.delete("/{job_id}")
def delete_job(
    job_id: int,
    request: Request,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),  # ✅ FIXED
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == user_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()

    return {"message": f"Job {job_id} deleted successfully"}


# --------------------------------------------------------------------
# DELETE ALL Jobs for Current User
# --------------------------------------------------------------------
@job_router.delete("/")
def delete_all_jobs(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    deleted_count = db.query(Job).filter(Job.user_id == user_id).delete()
    db.commit()
    return {"message": f"Deleted {deleted_count} jobs successfully"}


# --------------------------------------------------------------------
# UPDATE Job Status
# --------------------------------------------------------------------
@job_router.put("/{job_id}/status")
def update_job_status(
    job_id: int,
    data: JobUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == user_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if data.status not in ["TODO", "IN PROGRESS", "DONE"]:
        raise HTTPException(status_code=400, detail="Invalid status value")

    job.status = data.status
    job.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(job)
    return {"message": "Status updated", "job": job.to_dict()}
