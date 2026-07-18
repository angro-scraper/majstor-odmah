from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Balkan.works Core Platform"
    app_env: str = "development"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./balkan_works.db"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: str = "change-me-in-production-to-a-long-random-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    cors_origins: str = "http://localhost:3000,http://localhost:8080,https://balkan.works"
    auto_create_schema: bool = False
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_storage_bucket: str = "balkan-media"
    media_max_bytes: int = 10 * 1024 * 1024
    media_signed_url_ttl_seconds: int = 900
    deals_enabled: bool = True
    save_food_enabled: bool = True
    business_enabled: bool = True
    notifications_enabled: bool = True
    rewards_enabled: bool = False
    marketplace_enabled: bool = False
    services_enabled: bool = False
    jobs_enabled: bool = False
    wallet_enabled: bool = False
    payments_enabled: bool = False
    ai_assistant_enabled: bool = False
    health_enabled: bool = False
    auto_enabled: bool = False
    real_estate_enabled: bool = False

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
