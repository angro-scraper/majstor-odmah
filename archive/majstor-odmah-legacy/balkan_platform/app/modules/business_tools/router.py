from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.modules.identity.models import User

router = APIRouter(prefix="/business-tools", tags=["Business Tools"])


@router.get("/capabilities")
def capabilities(current_user: User = Depends(get_current_user)) -> dict:
    return {
        "business_id": None,
        "provider": "opsnestone",
        "capabilities": ["inventory", "products", "sales", "invoices", "analytics"],
        "status": "adapter-ready",
    }
