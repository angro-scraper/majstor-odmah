from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.business.models import Business
from app.modules.identity.models import User
from app.modules.offers.models import Offer, OfferSource
from app.modules.offers.schemas import OfferCreateRequest, OfferResponse

router = APIRouter(prefix="/offers", tags=["Offers"])


def is_current(offer: Offer) -> bool:
    """Compare offer dates outside SQL to support legacy timestamp column types."""
    now = datetime.utcnow()
    valid_from = offer.valid_from.replace(tzinfo=None) if offer.valid_from.tzinfo else offer.valid_from
    valid_until = offer.valid_until.replace(tzinfo=None) if offer.valid_until.tzinfo else offer.valid_until
    return valid_from <= now <= valid_until


@router.post("", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
def create_offer(
    payload: OfferCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> Offer:
    business = db.get(Business, payload.business_id)
    if business is None or business.owner_user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Možeš kreirati ponude samo za svoju firmu.")
    offer = Offer(**payload.model_dump())
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


@router.get("", response_model=list[OfferResponse])
def list_offers(
    country_code: str | None = None,
    city_name: str | None = None,
    source: OfferSource | None = None,
    db: Session = Depends(get_db),
) -> list[Offer]:
    statement = select(Offer).where(Offer.is_active.is_(True))
    if country_code:
        statement = statement.where(Offer.country_code == country_code.upper())
    if city_name:
        statement = statement.where(Offer.city_name.ilike(city_name))
    if source:
        statement = statement.where(Offer.source == source)
    return [offer for offer in db.scalars(statement.order_by(Offer.valid_until, Offer.created_at.desc())) if is_current(offer)]
