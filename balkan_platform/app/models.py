"""Model registry loaded by Alembic before migrations are run."""

from app.modules.business.models import Business, BusinessMember
from app.modules.catalog.models import Category
from app.modules.identity.models import AuditLog, Profile, User
from app.modules.location.models import City, Country, Location
from app.modules.marketplace.models import Favorite, Job, Listing, Message, Product, Review, Service
from app.modules.notifications.models import Notification
from app.modules.offers.models import Offer
from app.modules.payments.models import Subscription, Transaction, Wallet
from app.modules.save_food.models import FoodPackage, FoodReservation

__all__ = [
    "AuditLog", "Business", "BusinessMember", "Category", "City", "Country", "Favorite", "FoodPackage",
    "FoodReservation", "Job", "Listing", "Location", "Message", "Notification", "Offer", "Product",
    "Profile", "Review", "Service", "Subscription", "Transaction", "User", "Wallet",
]
