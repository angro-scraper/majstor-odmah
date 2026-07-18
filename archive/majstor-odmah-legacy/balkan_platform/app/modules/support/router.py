from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.identity.models import User
from app.modules.support.models import SupportTicket

router = APIRouter(prefix="/support", tags=["Support"])


class SupportTicketCreate(BaseModel):
    subject: str = Field(min_length=3, max_length=180)
    body: str = Field(min_length=10, max_length=5000)
    module_key: str = Field(default="core", min_length=2, max_length=64)


@router.get("/tickets")
def list_tickets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list(db.scalars(select(SupportTicket).where(SupportTicket.user_id == current_user.id).order_by(SupportTicket.created_at.desc()).limit(100)))


@router.post("/tickets", status_code=status.HTTP_201_CREATED)
def create_ticket(payload: SupportTicketCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ticket = SupportTicket(user_id=current_user.id, **payload.model_dump())
    db.add(ticket); db.commit(); db.refresh(ticket)
    return ticket
