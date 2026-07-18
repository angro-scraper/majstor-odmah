"""Add private Balkan.works media asset registry.

Revision ID: 20260718_0002
Revises: 20260718_0001
Create Date: 2026-07-18
"""

from alembic import op

from app.modules.media.models import MediaAsset

revision = "20260718_0002"
down_revision = "20260718_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    MediaAsset.__table__.create(bind=op.get_bind(), checkfirst=True)


def downgrade() -> None:
    MediaAsset.__table__.drop(bind=op.get_bind(), checkfirst=True)
