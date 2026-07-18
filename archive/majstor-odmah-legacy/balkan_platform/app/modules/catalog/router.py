from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.catalog.models import Category

router = APIRouter(prefix="/categories", tags=["Catalog"])


@router.get("", response_model=None)
def list_categories(module: str | None = None, db: Session = Depends(get_db)):
    statement = select(Category).where(Category.is_active.is_(True)).order_by(Category.name)
    if module:
        statement = statement.where(Category.module_key == module)
    return list(db.scalars(statement))
