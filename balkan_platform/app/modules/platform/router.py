"""Authoritative module map for the Balkan.works super-app.

External products are registered as future connectors only. This endpoint never
calls their domains, exchanges user records, or treats them as a second login.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/platform", tags=["Platform Foundation"])


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
