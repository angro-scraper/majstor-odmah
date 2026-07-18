"""Add Balkan Local events and in-app support tickets.

Revision ID: 20260718_0003
Revises: 20260718_0002
Create Date: 2026-07-18
"""

from alembic import op

from app.modules.local.models import LocalEvent
from app.modules.support.models import SupportTicket

revision = "20260718_0003"
down_revision = "20260718_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    LocalEvent.__table__.create(bind=op.get_bind(), checkfirst=True)
    SupportTicket.__table__.create(bind=op.get_bind(), checkfirst=True)


def downgrade() -> None:
    SupportTicket.__table__.drop(bind=op.get_bind(), checkfirst=True)
    LocalEvent.__table__.drop(bind=op.get_bind(), checkfirst=True)
