from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId

from app.core.config import settings
from app.db.mongodb import get_database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


class TokenData(BaseModel):
    user_id: Optional[str] = None


async def get_current_user(
    token: str = Depends(oauth2_scheme), db=Depends(get_database)
):
    """
    Get the current authenticated user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception

    user = await db.users.find_one({"_id": ObjectId(token_data.user_id)})
    if user is None:
        raise credentials_exception

    return user
