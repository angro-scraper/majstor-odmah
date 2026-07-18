"""Authoritative module map for the Balkan.works super-app.

External products are registered as future connectors only. This endpoint never
calls their domains, exchanges user records, or treats them as a second login.
"""

from fastapi import APIRouter
from app.core.config import get_settings

router = APIRouter(prefix="/platform", tags=["Platform Foundation"])


@router.get("/features")
def features() -> dict:
    """Public MVP release gates. Routes may exist while their product surface stays disabled."""
    settings = get_settings()
    return {"release": "mvp_v1", "features": {
        "deals": settings.deals_enabled, "save_food": settings.save_food_enabled,
        "business": settings.business_enabled, "notifications": settings.notifications_enabled,
        "rewards": settings.rewards_enabled, "marketplace": settings.marketplace_enabled,
        "services": settings.services_enabled, "jobs": settings.jobs_enabled,
        "money": settings.wallet_enabled, "wallet": settings.wallet_enabled,
        "payments": settings.payments_enabled, "assistant": settings.ai_assistant_enabled,
        "health": settings.health_enabled, "auto": settings.auto_enabled,
        "real_estate": settings.real_estate_enabled,
    }}


@router.get("/registry")
def registry() -> dict:
    return {
        "platform": {
            "name": "Balkan.works",
            "role": "super_app_root",
            "identity": "Balkan ID",
            "principle": "Jedan korisnik, jedan nalog, više modularnih proizvoda.",
        },
        "foundation": [
            {"key": "identity", "name": "Balkan ID", "status": "active", "layer": "core"},
            {"key": "location", "name": "Location Engine", "status": "active", "layer": "core"},
            {"key": "trust", "name": "Trust & Ratings", "status": "active", "layer": "core"},
            {"key": "notifications", "name": "Inbox & Notifications", "status": "active", "layer": "core"},
            {"key": "media", "name": "Private Media", "status": "active", "layer": "core"},
            {"key": "admin", "name": "Administration", "status": "active", "layer": "core"},
        ],
        "native_modules": [
            {"key": "deals", "name": "Balkan.works Deals", "status": "active"},
            {"key": "save_food", "name": "Save Food", "status": "active"},
            {"key": "market", "name": "Balkan.Works Market", "status": "active"},
            {"key": "local", "name": "Balkan Local", "status": "active"},
            {"key": "rewards", "name": "Balkan Rewards", "status": "foundation_ready"},
            {"key": "wallet", "name": "Balkan Wallet", "status": "foundation_ready"},
            {"key": "assistant", "name": "Balkan Assistant", "status": "credential_pending"},
            {"key": "everyday", "name": "Balkan Everyday", "status": "foundation_ready", "description": "Health, pharmacy, bills, fuel, parking, homes, pets and family"},
            {"key": "green_score", "name": "Balkan Green Score", "status": "active", "description": "Transparent Save Food impact estimate"},
        ],
        "future_connectors": [
            {
                "key": "sacuvaj_hranu",
                "product": "sacuvaj-hranu.rs",
                "target_module": "save_food",
                "status": "not_connected",
                "contract": "opt_in_api_connector",
            },
            {
                "key": "opsnestone",
                "product": "opsnestone.com",
                "target_module": "business",
                "status": "not_connected",
                "contract": "opt_in_api_connector",
            },
            {
                "key": "stock_radar",
                "product": "stock-radar.com",
                "target_module": "money",
                "status": "not_connected",
                "contract": "opt_in_api_connector",
            },
        ],
        "safety": {
            "shared_login": "only_balkan_id",
            "external_data_sync": "disabled_until_explicit_connector_setup",
            "payments": "provider_not_connected",
        },
    }
