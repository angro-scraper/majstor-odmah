import enum

from sqlalchemy import Boolean, Enum, ForeignKey, Integer, JSON, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ListingType(str, enum.Enum):
    JOB = "JOB"
    CRAFTSMAN = "CRAFTSMAN"
    SERVICE = "SERVICE"
    PRODUCT = "PRODUCT"
    BUSINESS = "BUSINESS"


class Listing(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "listings"

    author_user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    business_id: Mapped[str | None] = mapped_column(ForeignKey("businesses.id", ondelete="SET NULL"), index=True)
    category_id: Mapped[str | None] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), index=True)
    listing_type: Mapped[ListingType] = mapped_column(Enum(ListingType), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(220), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[float | None] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)
    image_urls: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    country_code: Mapped[str] = mapped_column(String(2), nullable=False, index=True)
    city_name: Mapped[str | None] = mapped_column(String(120), index=True)
    latitude: Mapped[float | None] = mapped_column()
    longitude: Mapped[float | None] = mapped_column()
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)


class Favorite(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "favorites"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    listing_id: Mapped[str] = mapped_column(ForeignKey("listings.id", ondelete="CASCADE"), nullable=False, index=True)


class Product(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "products"

    business_id: Mapped[str] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id: Mapped[str | None] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), index=True)
    name: Mapped[str] = mapped_column(String(220), nullable=False, index=True)
    price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)
    stock_quantity: Mapped[int | None] = mapped_column(Integer)
    image_urls: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Service(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "services"

    business_id: Mapped[str | None] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    provider_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    category_id: Mapped[str | None] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), index=True)
    name: Mapped[str] = mapped_column(String(220), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    from_price: Mapped[float | None] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Job(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "jobs"

    author_user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    business_id: Mapped[str | None] = mapped_column(ForeignKey("businesses.id", ondelete="SET NULL"), index=True)
    category_id: Mapped[str | None] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), index=True)
    title: Mapped[str] = mapped_column(String(220), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    budget: Mapped[float | None] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)
    country_code: Mapped[str] = mapped_column(String(2), nullable=False, index=True)
    city_name: Mapped[str | None] = mapped_column(String(120), index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Review(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "reviews"

    author_user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    subject_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    business_id: Mapped[str | None] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str | None] = mapped_column(Text)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Message(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "messages"

    sender_user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recipient_user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    listing_id: Mapped[str | None] = mapped_column(ForeignKey("listings.id", ondelete="SET NULL"), index=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
