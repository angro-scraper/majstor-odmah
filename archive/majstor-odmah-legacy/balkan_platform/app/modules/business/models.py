import enum

from sqlalchemy import Boolean, Enum, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class VerificationStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class Business(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "businesses"

    owner_user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    category_id: Mapped[str | None] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), index=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False, index=True)
    legal_name: Mapped[str | None] = mapped_column(String(180))
    tax_id: Mapped[str | None] = mapped_column(String(64), index=True)
    address: Mapped[str | None] = mapped_column(String(300))
    country_code: Mapped[str] = mapped_column(String(2), nullable=False, index=True)
    city_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    latitude: Mapped[float | None] = mapped_column()
    longitude: Mapped[float | None] = mapped_column()
    opening_hours: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    image_urls: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    website: Mapped[str | None] = mapped_column(String(500))
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False, index=True
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class BusinessMember(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "business_members"

    business_id: Mapped[str] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    permission_key: Mapped[str] = mapped_column(String(80), default="manager", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
