from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.identity.models import User
from app.modules.marketplace.models import Favorite, Listing, ListingType, Message, Review
from app.modules.notifications.models import Notification, NotificationChannel

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])


class ListingCreate(BaseModel):
    listing_type: ListingType
    title: str = Field(min_length=3, max_length=220)
    description: str = Field(min_length=3)
    country_code: str = Field(min_length=2, max_length=2)
    city_name: str | None = Field(default=None, max_length=120)
    price: float | None = Field(default=None, ge=0)
    currency: str = Field(default="EUR", min_length=3, max_length=3)
    category_id: str | None = None
    business_id: str | None = None
    image_urls: list[str] = Field(default_factory=list, max_length=12)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)


class MessageCreate(BaseModel):
    recipient_user_id: str
    body: str = Field(min_length=1, max_length=5000)
    listing_id: str | None = None


class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str | None = Field(default=None, max_length=3000)
    subject_user_id: str | None = None
    business_id: str | None = None


@router.post("/listings", status_code=status.HTTP_201_CREATED)
def create_listing(payload: ListingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    listing = Listing(author_user_id=current_user.id, **payload.model_dump(), country_code=payload.country_code.upper())
    db.add(listing); db.commit(); db.refresh(listing)
    return listing


@router.get("/listings")
def list_listings(listing_type: ListingType | None = None, country_code: str | None = None, city_name: str | None = None, db: Session = Depends(get_db)):
    statement = select(Listing).where(Listing.is_active.is_(True))
    if listing_type: statement = statement.where(Listing.listing_type == listing_type)
    if country_code: statement = statement.where(Listing.country_code == country_code.upper())
    if city_name: statement = statement.where(Listing.city_name.ilike(f"%{city_name}%"))
    return list(db.scalars(statement.order_by(Listing.created_at.desc()).limit(100)))


@router.post("/listings/{listing_id}/favorite")
def toggle_favorite(listing_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if db.get(Listing, listing_id) is None: raise HTTPException(404, "Oglas nije pronađen.")
    favorite = db.scalar(select(Favorite).where(Favorite.user_id == current_user.id, Favorite.listing_id == listing_id))
    if favorite:
        db.delete(favorite); db.commit(); return {"favorited": False}
    db.add(Favorite(user_id=current_user.id, listing_id=listing_id)); db.commit(); return {"favorited": True}


@router.get("/favorites")
def favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list(db.scalars(select(Listing).join(Favorite).where(Favorite.user_id == current_user.id, Listing.is_active.is_(True))))


@router.post("/messages", status_code=status.HTTP_201_CREATED)
def send_message(payload: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.recipient_user_id == str(current_user.id): raise HTTPException(400, "Ne možeš poslati poruku sebi.")
    message = Message(sender_user_id=current_user.id, **payload.model_dump())
    db.add(message)
    db.add(Notification(
        user_id=payload.recipient_user_id,
        channel=NotificationChannel.IN_APP,
        title="Nova poruka na Balkan.works",
        body="Stigla ti je nova poruka u Market modulu.",
        payload_json={"listing_id": payload.listing_id, "sender_user_id": str(current_user.id)},
    ))
    db.commit(); db.refresh(message); return message


@router.get("/messages")
def inbox(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list(db.scalars(select(Message).where(Message.recipient_user_id == current_user.id).order_by(Message.created_at.desc()).limit(100)))


@router.post("/reviews", status_code=status.HTTP_201_CREATED)
def create_review(payload: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not payload.subject_user_id and not payload.business_id: raise HTTPException(400, "Izaberi korisnika ili firmu za ocenu.")
    review = Review(author_user_id=current_user.id, **payload.model_dump()); db.add(review); db.commit(); db.refresh(review); return review
