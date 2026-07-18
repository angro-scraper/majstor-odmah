import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class LifeDirectoryType(str, enum.Enum):
    HEALTH = "HEALTH"
    PHARMACY = "PHARMACY"
    FUEL = "FUEL"
    PARKING = "PARKING"
    PET = "PET"
    HOME = "HOME"


class DirectoryEntry(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Verified local providers, pharmacies, fuel stations, parking zones and pet services."""
    __tablename__ = "life_directory_entries"

    owner_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    entry_type: Mapped[LifeDirectoryType] = mapped_column(Enum(LifeDirectoryType), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    country_code: Mapped[str] = mapped_column(String(2), nullable=False, index=True)
    city_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    address: Mapped[str | None] = mapped_column(String(300))
    latitude: Mapped[float | None] = mapped_column()
    longitude: Mapped[float | None] = mapped_column()
    phone: Mapped[str | None] = mapped_column(String(40))
    website_url: Mapped[str | None] = mapped_column(String(500))
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)


class Appointment(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "life_appointments"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    directory_entry_id: Mapped[str] = mapped_column(ForeignKey("life_directory_entries.id", ondelete="RESTRICT"), nullable=False, index=True)
    service_name: Mapped[str] = mapped_column(String(180), nullable=False)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    note: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="REQUESTED", nullable=False, index=True)


class PharmacyReservation(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "pharmacy_reservations"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    pharmacy_id: Mapped[str] = mapped_column(ForeignKey("life_directory_entries.id", ondelete="RESTRICT"), nullable=False, index=True)
    product_name: Mapped[str] = mapped_column(String(180), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="REQUESTED", nullable=False, index=True)
    note: Mapped[str | None] = mapped_column(Text)


class BillReminder(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "bill_reminders"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider_name: Mapped[str] = mapped_column(String(180), nullable=False)
    bill_type: Mapped[str] = mapped_column(String(48), nullable=False, index=True)
    amount: Mapped[float | None] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), default="SCHEDULED", nullable=False, index=True)
    external_reference: Mapped[str | None] = mapped_column(String(160))


class ParkingSession(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "parking_sessions"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    zone_entry_id: Mapped[str | None] = mapped_column(ForeignKey("life_directory_entries.id", ondelete="SET NULL"), index=True)
    vehicle_label: Mapped[str] = mapped_column(String(32), nullable=False)
    zone_name: Mapped[str] = mapped_column(String(120), nullable=False)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), default="REMINDER_ONLY", nullable=False, index=True)


class PropertyListing(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "property_listings"

    owner_user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    listing_kind: Mapped[str] = mapped_column(String(32), nullable=False, index=True)  # SALE, RENT, ROOMMATE, SHORT_STAY
    title: Mapped[str] = mapped_column(String(180), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    country_code: Mapped[str] = mapped_column(String(2), nullable=False, index=True)
    city_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    address_hint: Mapped[str | None] = mapped_column(String(240))
    price: Mapped[float | None] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)
    rooms: Mapped[int | None] = mapped_column(Integer)
    square_meters: Mapped[float | None] = mapped_column(Numeric(8, 2))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)


class GiftCard(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "gift_cards"

    issuer_entry_id: Mapped[str | None] = mapped_column(ForeignKey("life_directory_entries.id", ondelete="SET NULL"), index=True)
    owner_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    code: Mapped[str] = mapped_column(String(80), unique=True, nullable=False, index=True)
    value: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="ISSUED", nullable=False, index=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class FamilyGroup(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "family_groups"

    owner_user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    shared_rewards_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    shared_budget_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class FamilyMember(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "family_members"
    __table_args__ = (UniqueConstraint("family_group_id", "user_id", name="uq_family_membership"),)

    family_group_id: Mapped[str] = mapped_column(ForeignKey("family_groups.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    relation: Mapped[str] = mapped_column(String(32), default="MEMBER", nullable=False)
    can_manage: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
