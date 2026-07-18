from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.modules.identity.models import User, UserRole
from app.modules.local.models import LocalEvent, LocalEventType

router = APIRouter(prefix="/local", tags=["Balkan Local"])


class LocalEventCreate(BaseModel):
    event_type: LocalEventType
    title: str = Field(min_length=3, max_length=180)
    description: str | None = Field(default=None, max_length=5000)
    venue_name: str | None = Field(default=None, max_length=180)
    address: str | None = Field(default=None, max_length=300)
    country_code: str = Field(min_length=2, max_length=2)
    city_name: str = Field(min_length=2, max_length=120)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    starts_at: datetime
    ends_at: datetime | None = None
    ticket_url: str | None = Field(default=None, max_length=500)
    price: float | None = Field(default=None, ge=0)
    currency: str = Field(default="EUR", min_length=3, max_length=3)
    image_url: str | None = Field(default=None, max_length=500)


@router.get("/events")
def list_events(
    country_code: str | None = None,
    city_name: str | None = None,
    event_type: LocalEventType | None = None,
    db: Session = Depends(get_db),
):
    statement = select(LocalEvent).where(LocalEvent.is_published.is_(True), LocalEvent.starts_at >= datetime.now(UTC))
    if country_code:
        statement = statement.where(LocalEvent.country_code == country_code.upper())
    if city_name:
        statement = statement.where(LocalEvent.city_name.ilike(f"%{city_name}%"))
    if event_type:
        statement = statement.where(LocalEvent.event_type == event_type)
    return list(db.scalars(statement.order_by(LocalEvent.starts_at.asc()).limit(100)))


@router.post("/events", status_code=status.HTTP_201_CREATED)
def create_event(
    payload: LocalEventCreate,
    current_user: User = Depends(require_roles(UserRole.BUSINESS, UserRole.PARTNER, UserRole.ADMIN, UserRole.MODERATOR)),
    db: Session = Depends(get_db),
):
    if payload.ends_at and payload.ends_at < payload.starts_at:
        raise HTTPException(422, "Vreme završetka mora biti posle početka događaja.")
    event = LocalEvent(
        organizer_user_id=current_user.id,
        **payload.model_dump(exclude={"country_code", "currency"}),
        country_code=payload.country_code.upper(),
        currency=payload.currency.upper(),
        is_published=current_user.role in {UserRole.ADMIN, UserRole.MODERATOR},
    )
    db.add(event); db.commit(); db.refresh(event)
    return event
