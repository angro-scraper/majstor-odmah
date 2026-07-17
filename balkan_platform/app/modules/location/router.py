from math import asin, cos, radians, sin, sqrt

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.location.models import City, Country

router = APIRouter(prefix="/locations", tags=["Location"])


def haversine_km(latitude_a: float, longitude_a: float, latitude_b: float, longitude_b: float) -> float:
    lat_delta = radians(latitude_b - latitude_a)
    lon_delta = radians(longitude_b - longitude_a)
    arc = sin(lat_delta / 2) ** 2 + cos(radians(latitude_a)) * cos(radians(latitude_b)) * sin(lon_delta / 2) ** 2
    return 6371.0088 * 2 * asin(sqrt(arc))


@router.get("/countries", response_model=None)
def list_countries(db: Session = Depends(get_db)):
    return list(db.scalars(select(Country).where(Country.is_active.is_(True)).order_by(Country.name)))


@router.get("/cities", response_model=None)
def list_cities(country_code: str | None = None, db: Session = Depends(get_db)):
    statement = select(City).where(City.is_active.is_(True)).order_by(City.name)
    if country_code:
        statement = statement.join(Country).where(Country.code == country_code.upper())
    return list(db.scalars(statement))


@router.get("/nearby-cities")
def nearby_cities(latitude: float, longitude: float, radius_km: float = 50, db: Session = Depends(get_db)) -> list[dict]:
    radius_km = min(max(radius_km, 1), 500)
    cities = db.scalars(select(City).where(City.is_active.is_(True)))
    matches = []
    for city in cities:
        distance_km = haversine_km(latitude, longitude, city.latitude, city.longitude)
        if distance_km <= radius_km:
            matches.append({"id": str(city.id), "name": city.name, "distance_km": round(distance_km, 2)})
    return sorted(matches, key=lambda item: item["distance_km"])
