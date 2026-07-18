from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 - registers every model with SQLAlchemy metadata
from app.core.config import get_settings
from app.core.database import Base, engine
from app.modules.admin.router import router as admin_router
from app.modules.business.router import router as business_router
from app.modules.business_tools.router import router as business_tools_router
from app.modules.catalog.router import router as catalog_router
from app.modules.discovery.router import router as discovery_router
from app.modules.identity.router import router as auth_router
from app.modules.identity.router import users_router
from app.modules.location.router import router as location_router
from app.modules.marketplace.router import router as marketplace_router
from app.modules.notifications.router import router as notifications_router
from app.modules.offers.router import router as offers_router
from app.modules.payments.router import router as payments_router
from app.modules.save_food.router import router as save_food_router

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.auto_create_schema:
        Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Modularni Core API za Balkan.works super-app ekosistem.",
    lifespan=lifespan,
    openapi_url=f"{settings.api_prefix}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)


@app.get("/health", tags=["Platform"])
def health() -> dict:
    return {"status": "ok", "service": "balkan-core", "environment": settings.app_env}


for router in (
    auth_router,
    users_router,
    business_router,
    catalog_router,
    discovery_router,
    location_router,
    offers_router,
    marketplace_router,
    save_food_router,
    payments_router,
    notifications_router,
    business_tools_router,
    admin_router,
):
    app.include_router(router, prefix=settings.api_prefix)
