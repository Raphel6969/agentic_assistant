import uuid
import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

# In-memory users store for instant fallback / local dev
_users_db: Dict[str, Dict[str, Any]] = {
    "user_marco": {
        "user_id": "user_marco",
        "email": "marco@maestro.ai",
        "name": "Marco",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    }
}


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
async def register(req: RegisterRequest):
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    user_data = {
        "user_id": user_id,
        "name": req.name,
        "email": req.email,
        "avatar_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={req.name}",
        "token": f"maestro_jwt_{uuid.uuid4().hex}",
    }
    _users_db[email_key(req.email)] = user_data
    logger.info(f"Registered user {req.name} ({user_id})")
    return user_data


@router.post("/login")
async def login(req: LoginRequest):
    key = email_key(req.email)
    if key in _users_db:
        u = _users_db[key]
        u["token"] = f"maestro_jwt_{uuid.uuid4().hex}"
        return u

    # Default fallback for demo login
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    name = req.email.split("@")[0].capitalize() or "Marco"
    user_data = {
        "user_id": user_id,
        "name": name,
        "email": req.email,
        "avatar_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={name}",
        "token": f"maestro_jwt_{uuid.uuid4().hex}",
    }
    _users_db[key] = user_data
    return user_data


@router.post("/guest")
async def guest_login():
    """Instant 1-click guest login for hackathon judges."""
    user_id = "user_marco"
    user_data = {
        "user_id": user_id,
        "name": "Marco",
        "email": "marco@maestro.ai",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
        "token": f"maestro_jwt_guest_{uuid.uuid4().hex[:8]}",
    }
    return user_data


def email_key(email: str) -> str:
    return email.lower().strip()
