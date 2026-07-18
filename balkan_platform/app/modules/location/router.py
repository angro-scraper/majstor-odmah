from math import asin, cos, radians, sin, sqrt

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.location.models import City, Country

router = APIRouter(prefix="/locations", tags=["Location"])

# Bootstrap catalog used until an operator imports the full city dataset.  Keeping
# it in the Core makes web and future mobile clients behave consistently.
REGIONAL_CITIES = (
    ("RS", "Beograd", 44.7866, 20.4489), ("RS", "Novi Sad", 45.2671, 19.8335),
    ("RS", "Niš", 43.3209, 21.8958), ("RS", "Kragujevac", 44.0128, 20.9114),
    ("HR", "Zagreb", 45.8150, 15.9819), ("HR", "Split", 43.5081, 16.4402),
    ("HR", "Rijeka", 45.3271, 14.4422), ("HR", "Osijek", 45.5550, 18.6955),
    ("BA", "Sarajevo", 43.8563, 18.4131), ("BA", "Banja Luka", 44.7722, 17.1910),
    ("BA", "Mostar", 43.3438, 17.8078), ("ME", "Podgorica", 42.4304, 19.2594),
    ("ME", "Budva", 42.2911, 18.8403), ("SI", "Ljubljana", 46.0569, 14.5058),
    ("SI", "Maribor", 46.5547, 15.6459), ("MK", "Skoplje", 41.9981, 21.4254),
    ("MK", "Ohrid", 41.1231, 20.8016), ("BG", "Sofija", 42.6977, 23.3219),
    ("BG", "Plovdiv", 42.1354, 24.7453), ("RO", "Bukurešt", 44.4268, 26.1025),
    ("RO", "Temišvar", 45.7489, 21.2087), ("AL", "Tirana", 41.3275, 19.8187),
    ("XK", "Priština", 42.6629, 21.1655), ("DE", "Berlin", 52.5200, 13.4050),
    ("AT", "Beč", 48.2082, 16.3738), ("CH", "Cirih", 47.3769, 8.5417),
)
REGIONAL_COUNTRIES = (
    ("RS", "Srbija"), ("HR", "Hrvatska"), ("BA", "Bosna i Hercegovina"),
    ("ME", "Crna Gora"), ("SI", "Slovenija"), ("MK", "Severna Makedonija"),
    ("BG", "Bugarska"), ("RO", "Rumunija"), ("AL", "Albanija"),
    ("XK", "Kosovo"), ("DE", "Dijaspora · Nemačka"), ("AT", "Dijaspora · Austrija"),
    ("CH", "Dijaspora · Švajcarska"),
)


def haversine_km(latitude_a: float, longitude_a: float, latitude_b: float, longitude_b: float) -> float:
    lat_delta = radians(latitude_b - latitude_a)
    lon_delta = radians(longitude_b - longitude_a)
    arc = sin(lat_delta / 2) ** 2 + cos(radians(latitude_a)) * cos(radians(latitude_b)) * sin(lon_delta / 2) ** 2
    return 6371.0088 * 2 * asin(sqrt(arc))


@router.get("/countries", response_model=None)
def list_countries(db: Session = Depends(get_db)):
    countries = list(db.scalars(select(Country).where(Country.is_active.is_(True)).order_by(Country.name)))
    if not countries:
        return [{"code": code, "name": name, "is_balkan": code not in {"DE", "AT", "CH"}} for code, name in REGIONAL_COUNTRIES]
    return [{"id": str(country.id), "code": country.code, "name": country.name, "is_balkan": country.is_balkan} for country in countries]


@router.get("/cities", response_model=None)
def list_cities(country_code: str | None = None, db: Session = Depends(get_db)):
    statement = select(City).where(City.is_active.is_(True)).order_by(City.name)
    if country_code:
        statement = statement.join(Country).where(Country.code == country_code.upper())
    cities = list(db.scalars(statement))
    if not cities:
        return [
            {"country_code": code, "name": name, "latitude": latitude, "longitude": longitude}
            for code, name, latitude, longitude in REGIONAL_CITIES
            if not country_code or code == country_code.upper()
        ]
    country_codes = {str(country.id): country.code for country in db.scalars(select(Country))}
    return [
        {"id": str(city.id), "country_code": country_codes.get(str(city.country_id)), "name": city.name,
         "latitude": city.latitude, "longitude": city.longitude}
        for city in cities
    ]


@router.get("/nearby-cities")
def nearby_cities(latitude: float, longitude: float, radius_km: float = 50, db: Session = Depends(get_db)) -> list[dict]:
    radius_km = min(max(radius_km, 1), 500)
    cities = list(db.scalars(select(City).where(City.is_active.is_(True))))
    if not cities:
        matches = []
        for country_code, name, city_latitude, city_longitude in REGIONAL_CITIES:
            distance_km = haversine_km(latitude, longitude, city_latitude, city_longitude)
            if distance_km <= radius_km:
                matches.append({"country_code": country_code, "name": name, "latitude": city_latitude,
                                "longitude": city_longitude, "distance_km": round(distance_km, 2)})
        return sorted(matches, key=lambda item: item["distance_km"])
    matches = []
    for city in cities:
        distance_km = haversine_km(latitude, longitude, city.latitude, city.longitude)
        if distance_km <= radius_km:
            matches.append({"id": str(city.id), "name": city.name, "distance_km": round(distance_km, 2)})
    return sorted(matches, key=lambda item: item["distance_km"])
