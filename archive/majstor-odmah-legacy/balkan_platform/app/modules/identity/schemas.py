from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.modules.identity.models import UserRole


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=10, max_length=128)
    display_name: str = Field(min_length=2, max_length=120)
    phone: str | None = Field(default=None, max_length=32)
    preferred_locale: str = Field(default="sr", min_length=2, max_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    display_name: str
    avatar_url: str | None
    country_code: str | None
    city_name: str | None
    preferred_locale: str
    latitude: float | None
    longitude: float | None


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    phone: str | None
    role: UserRole
    email_verified: bool
    phone_verified: bool


class MeResponse(BaseModel):
    user: UserResponse
    profile: ProfileResponse


class ProfileUpdateRequest(BaseModel):
    display_name: str | None = Field(default=None, min_length=2, max_length=120)
    avatar_url: str | None = Field(default=None, max_length=500)
    country_code: str | None = Field(default=None, min_length=2, max_length=2)
    city_name: str | None = Field(default=None, min_length=2, max_length=120)
    preferred_locale: str | None = Field(default=None, min_length=2, max_length=8)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
