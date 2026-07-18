from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class MediaAsset(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A private object owned by one Balkan ID account.

    Objects are never exposed by their raw Storage URL. The API creates a short-lived
    signed URL only after checking the authenticated owner.
    """

    __tablename__ = "media_assets"

    owner_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    bucket: Mapped[str] = mapped_column(String(120), nullable=False)
    object_path: Mapped[str] = mapped_column(String(500), nullable=False, unique=True, index=True)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(80), nullable=False)
    byte_size: Mapped[int] = mapped_column(Integer, nullable=False)
    usage: Mapped[str] = mapped_column(String(40), default="general", nullable=False, index=True)
