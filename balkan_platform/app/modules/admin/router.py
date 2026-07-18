from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.modules.business.models import Business
from app.modules.identity.models import User, UserRole
from app.modules.identity.models import AuditLog
from app.modules.marketplace.models import Listing
from app.modules.offers.models import Offer

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard")
def dashboard(
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.MODERATOR)), db: Session = Depends(get_db)
) -> dict:
    return {
        "users": db.scalar(select(func.count()).select_from(User)) or 0,
        "businesses": db.scalar(select(func.count()).select_from(Business)) or 0,
        "offers": db.scalar(select(func.count()).select_from(Offer)) or 0,
        "moderation_queue": db.scalar(select(func.count()).select_from(Business).where(Business.verification_status == "PENDING")) or 0,
    }


@router.get("/users")
def list_users(
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.MODERATOR)), db: Session = Depends(get_db)
) -> list[dict]:
    users = db.scalars(select(User).order_by(User.created_at.desc()).limit(200))
    return [
        {"id": str(user.id), "email": user.email, "role": user.role.value, "is_active": user.is_active,
         "email_verified": user.email_verified, "created_at": user.created_at}
        for user in users
    ]


@router.post("/users/{user_id}/block")
def block_user(
    user_id: str, current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.MODERATOR)), db: Session = Depends(get_db)
) -> dict:
    user = db.get(User, user_id)
    if user is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    if user.id == current_user.id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Ne možeš blokirati svoj nalog.")
    user.is_active = False
    db.add(AuditLog(actor_user_id=current_user.id, action="USER_BLOCKED", resource_type="user", resource_id=str(user.id)))
    db.commit()
    return {"blocked": True, "user_id": str(user.id)}


@router.post("/listings/{listing_id}/hide")
def hide_listing(
    listing_id: str, current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.MODERATOR)), db: Session = Depends(get_db)
) -> dict:
    listing = db.get(Listing, listing_id)
    if listing is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Oglas nije pronađen.")
    listing.is_active = False
    db.add(AuditLog(actor_user_id=current_user.id, action="LISTING_HIDDEN", resource_type="listing", resource_id=str(listing.id)))
    db.commit()
    return {"hidden": True, "listing_id": str(listing.id)}
