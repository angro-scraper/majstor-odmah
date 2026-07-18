import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class LocalEventType(str, enum.Enum):
    CONCERT = "CONCERT"
    FESTIVAL = "FESTIVAL"
    FAIR = "FAIR"
    SPORT = "SPORT"
    CULTURE = "CULTURE"
    COMMUNITY = "COMMUNITY"
    OTHER = "OTHER"


class LocalEvent(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "local_events"

    organizer_user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    business_id: Mapped[str | None] = mapped_column(ForeignKey("businesses.id", ondelete="SET NULL"), index=True)
    event_type: Mapped[LocalEventType] = mapped_column(Enum(LocalEventType), default=LocalEventType.OTHER, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    venue_name: Mapped[str | None] = mapped_column(String(180))
    address: Mapped[str | None] = mapped_column(String(300))
    country_code: Mapped[str] = mapped_column(String(2), nullable=False, index=True)
    city_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    latitude: Mapped[float | None] = mapped_column()
    longitude: Mapped[float | None] = mapped_column()
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ticket_url: Mapped[str | None] = mapped_column(String(500))
    price: Mapped[float | None] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500))
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
