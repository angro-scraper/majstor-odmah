import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.business.models import Business
from app.modules.identity.models import User
from app.modules.save_food.models import FoodPackage, FoodReservation

router = APIRouter(prefix="/save-food", tags=["Save Food"])


class PackageCreate(BaseModel):
    business_id: str
    title: str = Field(min_length=3, max_length=180)
    description: str | None = Field(default=None, max_length=2000)
    quantity_available: int = Field(ge=1, le=10000)
    pickup_from: str
    pickup_until: str
    price: float = Field(ge=0)
    currency: str = Field(default="EUR", min_length=3, max_length=3)


class ReserveCreate(BaseModel):
    quantity: int = Field(default=1, ge=1, le=20)


@router.post("/packages", status_code=status.HTTP_201_CREATED)
def create_package(payload: PackageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    business = db.get(Business, payload.business_id)
    if business is None or business.owner_user_id != current_user.id: raise HTTPException(403, "Možeš kreirati paket samo za svoju firmu.")
    package = FoodPackage(**payload.model_dump()); db.add(package); db.commit(); db.refresh(package); return package


@router.get("/packages")
def list_packages(db: Session = Depends(get_db)):
    return list(db.scalars(select(FoodPackage).where(FoodPackage.quantity_available > 0).order_by(FoodPackage.pickup_until).limit(100)))


@router.post("/packages/{package_id}/reserve", status_code=status.HTTP_201_CREATED)
def reserve(package_id: str, payload: ReserveCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    package = db.get(FoodPackage, package_id)
    if package is None or package.quantity_available < payload.quantity: raise HTTPException(409, "Paket više nije dostupan u toj količini.")
    package.quantity_available -= payload.quantity
    reservation = FoodReservation(food_package_id=package.id, user_id=current_user.id, quantity=payload.quantity, pickup_code=secrets.token_urlsafe(8).upper())
    db.add(reservation); db.commit(); db.refresh(reservation); return reservation
