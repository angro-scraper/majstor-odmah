import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ReservationStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    COLLECTED = "COLLECTED"


class FoodPackage(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "food_packages"

    business_id: Mapped[str] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    description: Mapped[str | None] = mapped_column(String(2000))
    quantity_available: Mapped[int] = mapped_column(Integer, nullable=False)
    pickup_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    pickup_until: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)


class FoodReservation(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "food_reservations"

    food_package_id: Mapped[str] = mapped_column(ForeignKey("food_packages.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    pickup_code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False, index=True)
    status: Mapped[ReservationStatus] = mapped_column(Enum(ReservationStatus), default=ReservationStatus.PENDING, nullable=False)
