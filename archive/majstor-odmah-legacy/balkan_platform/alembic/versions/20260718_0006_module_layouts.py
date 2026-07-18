"""Add personal dashboard module layout.

Revision ID: 20260718_0006
Revises: 20260718_0005
Create Date: 2026-07-18
"""

from alembic import op
from app.modules.superapp.models import UserModuleLayout

revision = "20260718_0006"
down_revision = "20260718_0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    UserModuleLayout.__table__.create(bind=op.get_bind(), checkfirst=True)


def downgrade() -> None:
    UserModuleLayout.__table__.drop(bind=op.get_bind(), checkfirst=True)
