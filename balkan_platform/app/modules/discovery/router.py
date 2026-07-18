from datetime import datetime

from fastapi import APIRouter, Query
from sqlalchemy import or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from fastapi import Depends

from app.core.database import get_db
from app.modules.business.models import Business
from app.modules.marketplace.models import Listing
from app.modules.offers.models import Offer
from app.modules.offers.router import is_current
from app.modules.save_food.models import FoodPackage

router = APIRouter(prefix="/discovery", tags=["Discovery"])


def _matches_location(statement, model, country_code: str | None, city_name: str | None):
    if country_code:
        statement = statement.where(model.country_code == country_code.upper())
    if city_name:
        statement = statement.where(model.city_name.ilike(f"%{city_name.strip()}%"))
    return statement


@router.get("/search")
def search(
    q: str = Query(default="", max_length=120),
    country_code: str | None = Query(default=None, min_length=2, max_length=2),
    city_name: str | None = Query(default=None, max_length=120),
    limit: int = Query(default=12, ge=1, le=30),
    db: Session = Depends(get_db),
) -> dict:
    """Return normalized, locally filtered results from every public module."""
    term = q.strip()
    text_filter = f"%{term}%"

    business_statement = select(Business).where(Business.is_active.is_(True))
    listing_statement = select(Listing).where(Listing.is_active.is_(True))
    offer_statement = select(Offer).where(Offer.is_active.is_(True))
    food_statement = select(FoodPackage, Business).join(Business, FoodPackage.business_id == Business.id).where(FoodPackage.quantity_available > 0, Business.is_active.is_(True))
    if term:
        business_statement = business_statement.where(or_(Business.name.ilike(text_filter), Business.description.ilike(text_filter)))
        listing_statement = listing_statement.where(or_(Listing.title.ilike(text_filter), Listing.description.ilike(text_filter)))
        offer_statement = offer_statement.where(or_(Offer.title.ilike(text_filter), Offer.description.ilike(text_filter)))
        food_statement = food_statement.where(or_(FoodPackage.title.ilike(text_filter), FoodPackage.description.ilike(text_filter)))

    business_statement = _matches_location(business_statement, Business, country_code, city_name)
    listing_statement = _matches_location(listing_statement, Listing, country_code, city_name)
    offer_statement = _matches_location(offer_statement, Offer, country_code, city_name)
    food_statement = _matches_location(food_statement, Business, country_code, city_name)

    results = []
    for item in db.scalars(business_statement.order_by(Business.created_at.desc()).limit(limit)):
        results.append({"id": str(item.id), "module": "BUSINESS", "title": item.name, "description": item.description,
                        "country_code": item.country_code, "city_name": item.city_name, "price": None, "currency": None,
                        "url": "/business"})
    for item in db.scalars(listing_statement.order_by(Listing.created_at.desc()).limit(limit)):
        results.append({"id": str(item.id), "module": "MARKET", "title": item.title, "description": item.description,
                        "country_code": item.country_code, "city_name": item.city_name, "price": item.price, "currency": item.currency,
                        "url": "/market"})
    try:
        offers = list(db.scalars(offer_statement.order_by(Offer.valid_until, Offer.created_at.desc()).limit(limit)))
    except SQLAlchemyError:
        db.rollback()
        offers = []
    for item in offers:
        if not is_current(item):
            continue
        results.append({"id": str(item.id), "module": "DEALS", "title": item.title, "description": item.description,
                        "country_code": item.country_code, "city_name": item.city_name, "price": item.price, "currency": item.currency,
                        "url": "/deals"})
    for package, business in db.execute(food_statement.order_by(FoodPackage.pickup_until).limit(limit)):
        results.append({"id": str(package.id), "module": "SAVE_FOOD", "title": package.title, "description": package.description,
                        "country_code": business.country_code, "city_name": business.city_name, "price": package.price, "currency": package.currency,
                        "url": "/save-food"})
    module_order = {"MARKET": 0, "DEALS": 1, "SAVE_FOOD": 2, "BUSINESS": 3}
    results.sort(key=lambda item: module_order[item["module"]])
    return {"query": term, "country_code": country_code.upper() if country_code else None, "city_name": city_name, "results": results}
