from sqlalchemy import Boolean, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class UserModule(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Explicit user opt-in. Home never has to assume every product is relevant."""
    __tablename__ = "user_modules"
    __table_args__ = (UniqueConstraint("user_id", "module_key", name="uq_user_module"),)

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    module_key: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)


class UserModuleLayout(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Per-user dashboard order, separate from module activation for safe expansion."""
    __tablename__ = "user_module_layouts"
    __table_args__ = (UniqueConstraint("user_id", "module_key", name="uq_user_module_layout"),)

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    module_key: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    position: Mapped[int] = mapped_column(default=0, nullable=False, index=True)
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
