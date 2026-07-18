"""Model registry loaded by Alembic before migrations are run."""

from app.modules.business.models import Business, BusinessMember
from app.modules.catalog.models import Category
from app.modules.identity.models import AuditLog, Profile, User
from app.modules.location.models import City, Country, Location
from app.modules.local.models import LocalEvent
from app.modules.life.models import (Appointment, BillReminder, DirectoryEntry, FamilyGroup, FamilyMember,
                                     GiftCard, ParkingSession, PharmacyReservation, PropertyListing)
from app.modules.marketplace.models import Favorite, Job, Listing, Message, Product, Review, Service
from app.modules.media.models import MediaAsset
from app.modules.notifications.models import Notification
from app.modules.offers.models import Offer
from app.modules.payments.models import Subscription, Transaction, Wallet
from app.modules.save_food.models import FoodPackage, FoodReservation
from app.modules.support.models import SupportTicket
from app.modules.superapp.models import UserModule

__all__ = [
    "AuditLog", "Business", "BusinessMember", "Category", "City", "Country", "Favorite", "FoodPackage",
    "FoodReservation", "Job", "Listing", "Location", "Message", "Notification", "Offer", "Product",
    "LocalEvent", "MediaAsset", "Profile", "Review", "Service", "Subscription", "SupportTicket", "Transaction", "User", "Wallet",
    "Appointment", "BillReminder", "DirectoryEntry", "FamilyGroup", "FamilyMember", "GiftCard", "ParkingSession",
    "PharmacyReservation", "PropertyListing",
    "UserModule",
]
