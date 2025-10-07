from fastapi import Header, HTTPException, Depends
from jose import jwt, JWTError
from app.config import settings

SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = settings.JWT_ALGORITHM

def get_current_user_id(authorization: str = Header(None)) -> int:
    """
    Extract and validate JWT token from 'Authorization: Bearer <token>' header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return int(sub)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
