from sqlalchemy import Boolean, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Country(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "countries"

    code: Mapped[str] = mapped_column(String(2), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    is_balkan: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class City(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "cities"

    country_id: Mapped[str] = mapped_column(ForeignKey("countries.id", ondelete="RESTRICT"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Location(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "locations"

    country_id: Mapped[str | None] = mapped_column(ForeignKey("countries.id", ondelete="SET NULL"), index=True)
    city_id: Mapped[str | None] = mapped_column(ForeignKey("cities.id", ondelete="SET NULL"), index=True)
    address: Mapped[str | None] = mapped_column(String(300))
    latitude: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=False, index=True)
