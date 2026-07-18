from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Category(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "categories"

    key: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    module_key: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    parent_id: Mapped[str | None] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
