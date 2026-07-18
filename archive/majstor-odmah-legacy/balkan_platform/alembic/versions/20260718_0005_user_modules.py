"""Add explicit user module activation.

Revision ID: 20260718_0005
Revises: 20260718_0004
Create Date: 2026-07-18
"""

from alembic import op
from app.modules.superapp.models import UserModule

revision = "20260718_0005"
down_revision = "20260718_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    UserModule.__table__.create(bind=op.get_bind(), checkfirst=True)


def downgrade() -> None:
    UserModule.__table__.drop(bind=op.get_bind(), checkfirst=True)
