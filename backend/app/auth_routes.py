from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
from datetime import datetime, timedelta
from app import models, schemas
from app.database import get_db
from app.config import settings
from fastapi import Body
from jose import jwt, JWTError
from app.config import settings
from app.utils.auth_helper import get_current_user_id


SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = settings.JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = 60

auth_router = APIRouter(tags=["Authentication"])  # ✅ removed duplicate /auth prefix


@auth_router.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        email=user.email,
        mobile=user.mobile,
    )
    new_user.set_password(user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@auth_router.post("/login")
def login_user(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Authenticate user using JSON body {email, password}"""
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not user.check_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = jwt.encode(
        {"sub": str(user.id), "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_dict(),
    }

@auth_router.put("/update-profile")
def update_profile(data: schemas.UserResponse, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for field, value in data.dict(exclude_unset=True).items():
        if hasattr(user, field):
            setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return {"message": "Profile updated", "user": user.to_dict()}

@auth_router.post("/change-password")
def change_password(
    old: str = Body(...),
    new: str = Body(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not user.check_password(old):
        raise HTTPException(status_code=400, detail="Old password incorrect")
    user.set_password(new)
    db.commit()
    return {"message": "Password changed successfully"}


