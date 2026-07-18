import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class OfferSource(str, enum.Enum):
    DEALS = "DEALS"
    FLYER = "FLYER"
    SAVE_FOOD = "SAVE_FOOD"
    MARKETPLACE = "MARKETPLACE"


class Offer(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "offers"

    business_id: Mapped[str] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id: Mapped[str | None] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), index=True)
    source: Mapped[OfferSource] = mapped_column(Enum(OfferSource), default=OfferSource.DEALS, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(220), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(500))
    price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    old_price: Mapped[float | None] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)
    valid_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    valid_until: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    country_code: Mapped[str] = mapped_column(String(2), nullable=False, index=True)
    city_name: Mapped[str | None] = mapped_column(String(120), index=True)
    latitude: Mapped[float | None] = mapped_column()
    longitude: Mapped[float | None] = mapped_column()
    available_quantity: Mapped[int | None] = mapped_column(Integer)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
