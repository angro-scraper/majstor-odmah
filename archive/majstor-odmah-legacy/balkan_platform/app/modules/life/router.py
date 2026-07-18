from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.modules.identity.models import User, UserRole
from app.modules.life.models import (Appointment, BillReminder, DirectoryEntry, FamilyGroup, FamilyMember,
                                     GiftCard, LifeDirectoryType, ParkingSession, PharmacyReservation, PropertyListing)
from app.modules.save_food.models import FoodReservation

router = APIRouter(prefix="/life", tags=["Balkan Everyday"])


class DirectoryCreate(BaseModel):
    entry_type: LifeDirectoryType
    name: str = Field(min_length=2, max_length=180)
    description: str | None = Field(default=None, max_length=5000)
    country_code: str = Field(min_length=2, max_length=2)
    city_name: str = Field(min_length=2, max_length=120)
    address: str | None = Field(default=None, max_length=300)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    phone: str | None = Field(default=None, max_length=40)
    website_url: str | None = Field(default=None, max_length=500)


class AppointmentCreate(BaseModel):
    directory_entry_id: UUID
    service_name: str = Field(min_length=2, max_length=180)
    starts_at: datetime
    note: str | None = Field(default=None, max_length=2000)


class PharmacyReservationCreate(BaseModel):
    pharmacy_id: UUID
    product_name: str = Field(min_length=2, max_length=180)
    quantity: int = Field(default=1, ge=1, le=20)
    note: str | None = Field(default=None, max_length=1000)


class BillReminderCreate(BaseModel):
    provider_name: str = Field(min_length=2, max_length=180)
    bill_type: str = Field(min_length=2, max_length=48)
    amount: float | None = Field(default=None, ge=0)
    currency: str = Field(default="EUR", min_length=3, max_length=3)
    due_at: datetime
    external_reference: str | None = Field(default=None, max_length=160)


class ParkingCreate(BaseModel):
    zone_entry_id: UUID | None = None
    vehicle_label: str = Field(min_length=2, max_length=32)
    zone_name: str = Field(min_length=2, max_length=120)
    starts_at: datetime
    expires_at: datetime


class PropertyCreate(BaseModel):
    listing_kind: str = Field(pattern="^(SALE|RENT|ROOMMATE|SHORT_STAY)$")
    title: str = Field(min_length=3, max_length=180)
    description: str | None = Field(default=None, max_length=5000)
    country_code: str = Field(min_length=2, max_length=2)
    city_name: str = Field(min_length=2, max_length=120)
    address_hint: str | None = Field(default=None, max_length=240)
    price: float | None = Field(default=None, ge=0)
    currency: str = Field(default="EUR", min_length=3, max_length=3)
    rooms: int | None = Field(default=None, ge=1, le=99)
    square_meters: float | None = Field(default=None, ge=1, le=9999)


class FamilyCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    shared_rewards_enabled: bool = True
    shared_budget_enabled: bool = False


class FamilyMemberCreate(BaseModel):
    user_id: UUID
    relation: str = Field(default="MEMBER", max_length=32)
    can_manage: bool = False


@router.get("/directory")
def directory(entry_type: LifeDirectoryType | None = None, country_code: str | None = None, city_name: str | None = None, db: Session = Depends(get_db)):
    query = select(DirectoryEntry).where(DirectoryEntry.is_active.is_(True))
    if entry_type: query = query.where(DirectoryEntry.entry_type == entry_type)
    if country_code: query = query.where(DirectoryEntry.country_code == country_code.upper())
    if city_name: query = query.where(DirectoryEntry.city_name.ilike(f"%{city_name}%"))
    return list(db.scalars(query.order_by(DirectoryEntry.is_verified.desc(), DirectoryEntry.name.asc()).limit(100)))


@router.post("/directory", status_code=status.HTTP_201_CREATED)
def create_directory(payload: DirectoryCreate, current_user: User = Depends(require_roles(UserRole.BUSINESS, UserRole.PARTNER, UserRole.ADMIN, UserRole.MODERATOR)), db: Session = Depends(get_db)):
    item = DirectoryEntry(owner_user_id=current_user.id, **payload.model_dump(exclude={"country_code"}), country_code=payload.country_code.upper(), is_verified=current_user.role in {UserRole.ADMIN, UserRole.MODERATOR})
    db.add(item); db.commit(); db.refresh(item)
    return item


@router.post("/health/appointments", status_code=status.HTTP_201_CREATED)
def appointment(payload: AppointmentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    provider = db.get(DirectoryEntry, payload.directory_entry_id)
    if not provider or not provider.is_active or provider.entry_type != LifeDirectoryType.HEALTH:
        raise HTTPException(404, "Zdravstveni pružalac nije pronađen.")
    if payload.starts_at <= datetime.now(UTC): raise HTTPException(422, "Termin mora biti u budućnosti.")
    row = Appointment(user_id=current_user.id, **payload.model_dump())
    db.add(row); db.commit(); db.refresh(row); return row


@router.post("/pharmacy/reservations", status_code=status.HTTP_201_CREATED)
def pharmacy_reservation(payload: PharmacyReservationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pharmacy = db.get(DirectoryEntry, payload.pharmacy_id)
    if not pharmacy or pharmacy.entry_type != LifeDirectoryType.PHARMACY or not pharmacy.is_active: raise HTTPException(404, "Apoteka nije pronađena.")
    row = PharmacyReservation(user_id=current_user.id, **payload.model_dump())
    db.add(row); db.commit(); db.refresh(row); return row


@router.post("/bills/reminders", status_code=status.HTTP_201_CREATED)
def create_bill(payload: BillReminderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = BillReminder(user_id=current_user.id, **payload.model_dump(exclude={"currency"}), currency=payload.currency.upper())
    db.add(row); db.commit(); db.refresh(row); return row


@router.post("/parking/sessions", status_code=status.HTTP_201_CREATED)
def create_parking(payload: ParkingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.expires_at <= payload.starts_at: raise HTTPException(422, "Istek mora biti posle početka parkinga.")
    row = ParkingSession(user_id=current_user.id, **payload.model_dump())
    db.add(row); db.commit(); db.refresh(row); return row


@router.get("/homes")
def homes(country_code: str | None = None, city_name: str | None = None, listing_kind: str | None = None, db: Session = Depends(get_db)):
    query = select(PropertyListing).where(PropertyListing.is_active.is_(True))
    if country_code: query = query.where(PropertyListing.country_code == country_code.upper())
    if city_name: query = query.where(PropertyListing.city_name.ilike(f"%{city_name}%"))
    if listing_kind: query = query.where(PropertyListing.listing_kind == listing_kind.upper())
    return list(db.scalars(query.order_by(PropertyListing.created_at.desc()).limit(100)))


@router.post("/homes", status_code=status.HTTP_201_CREATED)
def create_home(payload: PropertyCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = PropertyListing(owner_user_id=current_user.id, **payload.model_dump(exclude={"country_code", "currency", "listing_kind"}), country_code=payload.country_code.upper(), currency=payload.currency.upper(), listing_kind=payload.listing_kind.upper())
    db.add(row); db.commit(); db.refresh(row); return row


@router.get("/family")
def my_families(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    owned = list(db.scalars(select(FamilyGroup).where(FamilyGroup.owner_user_id == current_user.id)))
    memberships = list(db.scalars(select(FamilyMember).where(FamilyMember.user_id == current_user.id)))
    member_group_ids = [item.family_group_id for item in memberships]
    joined = list(db.scalars(select(FamilyGroup).where(FamilyGroup.id.in_(member_group_ids)))) if member_group_ids else []
    return {"owned": owned, "joined": joined, "payment_status": "not_configured"}


@router.post("/family", status_code=status.HTTP_201_CREATED)
def create_family(payload: FamilyCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    group = FamilyGroup(owner_user_id=current_user.id, **payload.model_dump())
    db.add(group); db.flush(); db.add(FamilyMember(family_group_id=group.id, user_id=current_user.id, relation="OWNER", can_manage=True)); db.commit(); db.refresh(group); return group


@router.post("/family/{group_id}/members", status_code=status.HTTP_201_CREATED)
def add_member(group_id: UUID, payload: FamilyMemberCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    group = db.get(FamilyGroup, group_id)
    if not group or group.owner_user_id != current_user.id: raise HTTPException(404, "Porodična grupa nije pronađena.")
    if not db.get(User, payload.user_id): raise HTTPException(404, "Balkan ID nalog nije pronađen.")
    member = FamilyMember(family_group_id=group.id, **payload.model_dump())
    db.add(member)
    try: db.commit()
    except Exception:
        db.rollback(); raise HTTPException(409, "Korisnik je već član ove grupe.")
    db.refresh(member); return member


@router.get("/green-score")
def green_score(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rescued = db.scalar(select(func.count()).select_from(FoodReservation).where(FoodReservation.user_id == current_user.id)) or 0
    # Conservative, clearly-labelled estimate until package-weight integrations are live.
    return {"food_packages_rescued": rescued, "estimated_kg_food_saved": round(rescued * 0.75, 2), "estimated_kg_co2e_avoided": round(rescued * 1.9, 2), "estimated_money_saved": None, "methodology": "Provisional estimate: 0.75 kg hrane i 1.9 kg CO2e po rezervisanom paketu; partner data will replace it."}


@router.get("/dashboard")
def dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bills = db.scalar(select(func.count()).select_from(BillReminder).where(BillReminder.user_id == current_user.id, BillReminder.status == "SCHEDULED")) or 0
    parking = db.scalar(select(func.count()).select_from(ParkingSession).where(ParkingSession.user_id == current_user.id, ParkingSession.expires_at >= datetime.now(UTC))) or 0
    appointments = db.scalar(select(func.count()).select_from(Appointment).where(Appointment.user_id == current_user.id, Appointment.status == "REQUESTED")) or 0
    return {"status": {"health_appointments": appointments, "bill_reminders": bills, "parking_sessions": parking}, "payment_notice": "Plaćanja računa i parkinga biće omogućena tek posle licenciranog payment provajdera i ugovora sa lokalnim operaterima."}
