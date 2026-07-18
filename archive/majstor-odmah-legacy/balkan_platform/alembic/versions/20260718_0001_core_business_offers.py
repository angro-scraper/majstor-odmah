"""Create Balkan.works core, business and offer platform schema.

Revision ID: 20260718_0001
Revises:
Create Date: 2026-07-18
"""

from alembic import op

from app import models  # noqa: F401
from app.core.database import Base

revision = "20260718_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create the initial modular platform schema in dependency-safe metadata order."""
    Base.metadata.create_all(bind=op.get_bind())


def downgrade() -> None:
    """Drop only the tables owned by the initial platform migration."""
    Base.metadata.drop_all(bind=op.get_bind())
