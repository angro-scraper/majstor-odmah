from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.modules.business.models import VerificationStatus


class BusinessCreateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=180)
    legal_name: str | None = Field(default=None, max_length=180)
    tax_id: str | None = Field(default=None, max_length=64)
    category_id: UUID | None = None
    address: str | None = Field(default=None, max_length=300)
    country_code: str = Field(min_length=2, max_length=2)
    city_name: str = Field(min_length=2, max_length=120)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    opening_hours: dict = Field(default_factory=dict)
    image_urls: list[str] = Field(default_factory=list, max_length=20)
    description: str | None = Field(default=None, max_length=5000)
    website: str | None = Field(default=None, max_length=500)


class BusinessResponse(BusinessCreateRequest):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    owner_user_id: UUID
    verification_status: VerificationStatus
    is_active: bool
