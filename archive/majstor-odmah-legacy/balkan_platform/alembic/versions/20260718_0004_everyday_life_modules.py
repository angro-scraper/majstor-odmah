"""Add Balkan Everyday module foundation.

Revision ID: 20260718_0004
Revises: 20260718_0003
Create Date: 2026-07-18
"""

from alembic import op

from app.modules.life.models import (Appointment, BillReminder, DirectoryEntry, FamilyGroup, FamilyMember,
                                     GiftCard, ParkingSession, PharmacyReservation, PropertyListing)

revision = "20260718_0004"
down_revision = "20260718_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    for table in (DirectoryEntry, Appointment, PharmacyReservation, BillReminder, ParkingSession, PropertyListing,
                  GiftCard, FamilyGroup, FamilyMember):
        table.__table__.create(bind=op.get_bind(), checkfirst=True)


def downgrade() -> None:
    for table in (FamilyMember, FamilyGroup, GiftCard, PropertyListing, ParkingSession, BillReminder,
                  PharmacyReservation, Appointment, DirectoryEntry):
        table.__table__.drop(bind=op.get_bind(), checkfirst=True)
