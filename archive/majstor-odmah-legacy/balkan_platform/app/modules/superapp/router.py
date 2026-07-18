from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.business.models import Business, VerificationStatus
from app.modules.identity.models import Profile, User
from app.modules.marketplace.models import Favorite, Listing, Message, Review
from app.modules.payments.models import Wallet
from app.modules.save_food.models import FoodReservation
from app.modules.superapp.models import UserModule, UserModuleLayout

router = APIRouter(prefix="/super-app", tags=["Super App Hub"])

MODULE_CATALOG = {
    "food": {"name": "Save Food", "path": "/save-food"}, "deals": {"name": "Deals", "path": "/deals"},
    "services": {"name": "Services", "path": "/market"}, "jobs": {"name": "Jobs", "path": "/market"},
    "business": {"name": "Business", "path": "/business"}, "money": {"name": "Money", "path": "/account"},
    "auto": {"name": "Auto", "path": "/everyday"}, "health": {"name": "Health", "path": "/everyday"},
    "tickets": {"name": "Tickets", "path": "/"}, "local": {"name": "Balkan Local", "path": "/local"},
}


class ModuleChange(BaseModel):
    module_key: str
    is_active: bool = True


class ModuleLayoutChange(BaseModel):
    module_keys: list[str]


def module_payload(rows: list[UserModule], layouts: dict[str, UserModuleLayout] | None = None) -> list[dict]:
    result = []
    for item in rows:
        if item.module_key not in MODULE_CATALOG:
            continue
        layout = (layouts or {}).get(item.module_key)
        result.append({"key": item.module_key, "active": item.is_active, "position": layout.position if layout else 9999,
                       "pinned": layout.is_pinned if layout else False, **MODULE_CATALOG[item.module_key]})
    return sorted(result, key=lambda item: (not item["pinned"], item["position"], item["name"]))


def layouts_for(user: User, db: Session) -> dict[str, UserModuleLayout]:
    rows = list(db.scalars(select(UserModuleLayout).where(UserModuleLayout.user_id == user.id)))
    return {item.module_key: item for item in rows}


def ensure_layout(user: User, key: str, db: Session) -> UserModuleLayout:
    layout = db.scalar(select(UserModuleLayout).where(UserModuleLayout.user_id == user.id, UserModuleLayout.module_key == key))
    if layout is None:
        position = db.scalar(select(func.max(UserModuleLayout.position)).where(UserModuleLayout.user_id == user.id))
        layout = UserModuleLayout(user_id=user.id, module_key=key, position=(position or 0) + 1)
        db.add(layout)
    return layout


@router.get("/modules")
def my_modules(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    rows = list(db.scalars(select(UserModule).where(UserModule.user_id == current_user.id, UserModule.is_active.is_(True)).order_by(UserModule.created_at.asc())))
    return {"active_modules": module_payload(rows, layouts_for(current_user, db)), "catalog": [{"key": key, **value} for key, value in MODULE_CATALOG.items()]}


@router.put("/modules")
def set_module(payload: ModuleChange, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    key = payload.module_key.strip().lower()
    if key not in MODULE_CATALOG:
        raise HTTPException(status_code=422, detail="Nepoznat Balkan.works modul.")
    row = db.scalar(select(UserModule).where(UserModule.user_id == current_user.id, UserModule.module_key == key))
    if row is None:
        row = UserModule(user_id=current_user.id, module_key=key, is_active=payload.is_active)
        db.add(row)
    else:
        row.is_active = payload.is_active
    if payload.is_active:
        ensure_layout(current_user, key, db)
    db.commit(); db.refresh(row)
    layout = layouts_for(current_user, db).get(key)
    return {"key": key, "active": row.is_active, "position": layout.position if layout else None, **MODULE_CATALOG[key]}


@router.put("/modules/layout")
def set_module_layout(payload: ModuleLayoutChange, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    requested = [key.strip().lower() for key in payload.module_keys]
    if len(requested) != len(set(requested)) or any(key not in MODULE_CATALOG for key in requested):
        raise HTTPException(status_code=422, detail="Neispravan raspored modula.")
    active = {item.module_key for item in db.scalars(select(UserModule).where(UserModule.user_id == current_user.id, UserModule.is_active.is_(True)))}
    if set(requested) != active:
        raise HTTPException(status_code=422, detail="Raspored mora sadržati sve i samo aktivirane module.")
    for position, key in enumerate(requested, start=1):
        layout = ensure_layout(current_user, key, db)
        layout.position = position
    db.commit()
    rows = list(db.scalars(select(UserModule).where(UserModule.user_id == current_user.id, UserModule.is_active.is_(True))))
    return {"active_modules": module_payload(rows, layouts_for(current_user, db))}


@router.get("/dashboard")
def dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    rows = list(db.scalars(select(UserModule).where(UserModule.user_id == current_user.id, UserModule.is_active.is_(True))))
    return {"layout": "personal_module_dashboard", "modules": module_payload(rows, layouts_for(current_user, db)), "empty_state": "Izaberi module u Profile delu da oblikuješ svoj Home."}


@router.get("/profile")
def profile_center(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    profile = db.scalar(select(Profile).where(Profile.user_id == current_user.id))
    wallet = wallet_for(current_user, db)
    db.commit(); db.refresh(wallet)
    active = list(db.scalars(select(UserModule).where(UserModule.user_id == current_user.id, UserModule.is_active.is_(True))))
    favorites = db.scalar(select(func.count()).select_from(Favorite).where(Favorite.user_id == current_user.id)) or 0
    reservations = db.scalar(select(func.count()).select_from(FoodReservation).where(FoodReservation.user_id == current_user.id)) or 0
    return {
        "balkan_id": {"display_name": profile.display_name if profile else "Balkan korisnik", "email": current_user.email, "role": current_user.role.value},
        "wallet": {"balance": wallet.balance, "currency": wallet.currency, "status": "provider_not_connected"},
        "rewards": {"points": int(favorites * 2 + reservations * 10), "status": "active"},
        "verifications": [{"key": "email", "label": "Email", "verified": current_user.email_verified}, {"key": "phone", "label": "Telefon", "verified": current_user.phone_verified}, {"key": "location", "label": "Lokacija", "verified": bool(profile and profile.country_code and profile.city_name)}],
        "active_modules": module_payload(active, layouts_for(current_user, db)),
        "settings": {"locale": profile.preferred_locale if profile else "sr", "country_code": profile.country_code if profile else None, "city_name": profile.city_name if profile else None},
    }


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
