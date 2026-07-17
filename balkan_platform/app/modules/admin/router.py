from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.modules.business.models import Business
from app.modules.identity.models import User, UserRole
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
