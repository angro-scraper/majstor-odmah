from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.modules.offers.models import OfferSource


class OfferCreateRequest(BaseModel):
    business_id: UUID
    category_id: UUID | None = None
    source: OfferSource = OfferSource.DEALS
    title: str = Field(min_length=2, max_length=220)
    description: str | None = Field(default=None, max_length=5000)
    image_url: str | None = Field(default=None, max_length=500)
    price: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    old_price: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2)
    currency: str = Field(default="EUR", min_length=3, max_length=3)
    valid_from: datetime
    valid_until: datetime
    country_code: str = Field(min_length=2, max_length=2)
    city_name: str | None = Field(default=None, max_length=120)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    available_quantity: int | None = Field(default=None, ge=0)

    @model_validator(mode="after")
    def validate_period(self):
        if self.valid_until <= self.valid_from:
            raise ValueError("Datum isteka mora biti posle datuma početka.")
        if self.old_price is not None and self.old_price <= self.price:
            raise ValueError("Stara cena mora biti veća od aktuelne cene.")
        return self


class OfferResponse(OfferCreateRequest):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    is_active: bool
