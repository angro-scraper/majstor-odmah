from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.business.models import Business, VerificationStatus
from app.modules.identity.models import Profile, User
from app.modules.marketplace.models import Favorite, Listing, Message, Review
from app.modules.payments.models import Wallet
from app.modules.save_food.models import FoodReservation

router = APIRouter(prefix="/super-app", tags=["Super App Hub"])


def wallet_for(user: User, db: Session) -> Wallet:
    wallet = db.scalar(select(Wallet).where(Wallet.user_id == user.id))
    if wallet is None:
        wallet = Wallet(user_id=user.id)
        db.add(wallet)
        db.flush()
    return wallet


@router.get("/hub")
def hub(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    """The shared state every Balkan.works client can render on its home screen."""
    profile = db.scalar(select(Profile).where(Profile.user_id == current_user.id))
    businesses = list(db.scalars(select(Business).where(Business.owner_user_id == current_user.id, Business.is_active.is_(True))))
    favorites = db.scalar(select(func.count()).select_from(Favorite).where(Favorite.user_id == current_user.id)) or 0
    messages = db.scalar(select(func.count()).select_from(Message).where(Message.recipient_user_id == current_user.id, Message.is_read.is_(False))) or 0
    reservations = db.scalar(select(func.count()).select_from(FoodReservation).where(FoodReservation.user_id == current_user.id)) or 0
    verified_businesses = sum(item.verification_status == VerificationStatus.VERIFIED for item in businesses)

    trust_score = 35
    badges = []
    if current_user.email_verified:
        trust_score += 20; badges.append("EMAIL_VERIFIED")
    if current_user.phone_verified:
        trust_score += 15; badges.append("PHONE_VERIFIED")
    if profile and profile.country_code and profile.city_name:
        trust_score += 10; badges.append("LOCAL_PROFILE")
    if verified_businesses:
        trust_score += min(20, verified_businesses * 10); badges.append("VERIFIED_BUSINESS")
    trust_score = min(trust_score, 100)

    reward_points = int(favorites * 2 + messages + reservations * 10 + verified_businesses * 25)
    location_filters = [Listing.is_active.is_(True)]
    if profile and profile.country_code:
        location_filters.append(Listing.country_code == profile.country_code)
    if profile and profile.city_name:
        location_filters.append(Listing.city_name.ilike(f"%{profile.city_name}%"))
    recommendations = list(db.scalars(select(Listing).where(*location_filters).order_by(Listing.created_at.desc()).limit(6)))

    wallet = wallet_for(current_user, db)
    db.commit(); db.refresh(wallet)
    return {
        "balkan_id": {"user_id": str(current_user.id), "role": current_user.role.value, "email_verified": current_user.email_verified,
                      "phone_verified": current_user.phone_verified, "locale": profile.preferred_locale if profile else "sr"},
        "wallet": {"balance": wallet.balance, "currency": wallet.currency, "provider_status": "not_configured"},
        "rewards": {"points": reward_points, "tier": "START" if reward_points < 250 else "LOCAL", "note": "Poeni se računaju iz aktivnosti dok payment/loyalty provajder nije povezan."},
        "trust": {"score": trust_score, "badges": badges, "verified_businesses": verified_businesses},
        "activity": {"favorites": favorites, "unread_messages": messages, "food_reservations": reservations},
        "recommendations": [{"id": str(item.id), "title": item.title, "listing_type": item.listing_type.value,
                               "city_name": item.city_name, "country_code": item.country_code, "price": item.price,
                               "currency": item.currency} for item in recommendations],
    }


@router.get("/capabilities")
def capabilities() -> dict:
    """Stable integration contract for partners and future external services."""
    return {"platform": "Balkan.works", "modules": [
        {"key": "identity", "status": "active", "description": "Balkan ID / JWT / roles"},
        {"key": "market", "status": "active", "description": "Local services and listings"},
        {"key": "deals", "status": "active", "description": "Digital flyers and offers"},
        {"key": "save_food", "status": "active", "description": "Food rescue reservations"},
        {"key": "business", "status": "adapter_ready", "description": "Opsnestone integration layer"},
        {"key": "money", "status": "adapter_ready", "description": "Wallet, rewards and Stock Radar layer"},
        {"key": "assistant", "status": "discovery_ready", "description": "Balkan Assistant can use cross-module search"},
        {"key": "local", "status": "active", "description": "Regional events, fairs, sports and local culture"},
        {"key": "health", "status": "foundation_ready", "description": "Appointments, verified clinics and therapy reminders"},
        {"key": "pharmacy", "status": "foundation_ready", "description": "Pharmacy discovery and product reservation requests"},
        {"key": "bills", "status": "foundation_ready", "description": "Bill reminders; regulated bill payment is not connected"},
        {"key": "fuel", "status": "foundation_ready", "description": "Fuel station directory; live price feeds need verified sources"},
        {"key": "parking", "status": "foundation_ready", "description": "Parking session reminders; municipal payment is not connected"},
        {"key": "homes", "status": "foundation_ready", "description": "Property, roommate and short-stay listings"},
        {"key": "gift_cards", "status": "foundation_ready", "description": "Partner gift-card structure"},
        {"key": "pets", "status": "foundation_ready", "description": "Veterinarian, pet-shop and pet-service discovery"},
        {"key": "family", "status": "foundation_ready", "description": "Family groups with opt-in shared rewards and future shared budget"},
        {"key": "green_score", "status": "active", "description": "Save Food impact score with clearly labelled provisional estimates"},
    ]}
