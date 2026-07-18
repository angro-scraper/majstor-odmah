from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.rate_limit import api_rate_limit
from app.core.security import create_access_token, hash_password, verify_password
from app.modules.identity.models import Profile, User
from app.modules.identity.schemas import (
    LoginRequest,
    MeResponse,
    ProfileUpdateRequest,
    RegisterRequest,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["Identity"])
users_router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(api_rate_limit)])
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    if db.scalar(select(User).where(User.email == payload.email.lower())):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email je već registrovan.")
    user = User(email=payload.email.lower(), phone=payload.phone, password_hash=hash_password(payload.password))
    db.add(user)
    db.flush()
    db.add(Profile(user_id=user.id, display_name=payload.display_name, preferred_locale=payload.preferred_locale))
    db.commit()
    return TokenResponse(access_token=create_access_token(str(user.id), user.role.value))


@router.post("/login", response_model=TokenResponse, dependencies=[Depends(api_rate_limit)])
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email ili lozinka nisu ispravni.")
    return TokenResponse(access_token=create_access_token(str(user.id), user.role.value))


@users_router.get("/me", response_model=MeResponse)
def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> MeResponse:
    profile = db.scalar(select(Profile).where(Profile.user_id == current_user.id))
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profil nije pronađen.")
    return MeResponse(user=current_user, profile=profile)


@users_router.patch("/me", response_model=MeResponse)
def update_me(
    payload: ProfileUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> MeResponse:
    profile = db.scalar(select(Profile).where(Profile.user_id == current_user.id))
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profil nije pronađen.")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return MeResponse(user=current_user, profile=profile)
