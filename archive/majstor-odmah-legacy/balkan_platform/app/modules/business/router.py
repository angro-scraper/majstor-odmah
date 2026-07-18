from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.modules.business.models import Business, VerificationStatus
from app.modules.business.schemas import BusinessCreateRequest, BusinessResponse
from app.modules.identity.models import User, UserRole

router = APIRouter(prefix="/business", tags=["Business"])


@router.post("", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
def create_business(
    payload: BusinessCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> Business:
    business = Business(owner_user_id=current_user.id, **payload.model_dump())
    db.add(business)
    db.commit()
    db.refresh(business)
    return business


@router.get("/mine", response_model=list[BusinessResponse])
def my_businesses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[Business]:
    return list(db.scalars(select(Business).where(Business.owner_user_id == current_user.id).order_by(Business.created_at.desc())))


@router.get("/{business_id}", response_model=BusinessResponse)
def business_detail(business_id: str, db: Session = Depends(get_db)) -> Business:
    business = db.get(Business, business_id)
    if business is None or not business.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Firma nije pronađena.")
    return business


@router.post("/{business_id}/verify", response_model=BusinessResponse)
def verify_business(
    business_id: str,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.MODERATOR)),
    db: Session = Depends(get_db),
) -> Business:
    business = db.get(Business, business_id)
    if business is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Firma nije pronađena.")
    business.verification_status = VerificationStatus.VERIFIED
    db.commit()
    db.refresh(business)
    return business
