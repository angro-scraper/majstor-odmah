from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.identity.models import User
from app.modules.payments.models import Transaction, Wallet

router = APIRouter(prefix="/payments", tags=["Payments"])


class PaymentIntentCreate(BaseModel):
    reference_type: str = Field(min_length=2, max_length=64)
    reference_id: str = Field(min_length=1, max_length=64)
    amount: float = Field(gt=0)
    currency: str = Field(default="EUR", min_length=3, max_length=3)
    commission_amount: float = Field(default=0, ge=0)


def wallet_for(user: User, db: Session) -> Wallet:
    wallet = db.scalar(select(Wallet).where(Wallet.user_id == user.id))
    if wallet is None:
        wallet = Wallet(user_id=user.id); db.add(wallet); db.flush()
    return wallet


@router.get("/wallet")
def wallet(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = wallet_for(current_user, db); db.commit(); db.refresh(result); return result


@router.post("/intents", status_code=status.HTTP_201_CREATED)
def create_intent(payload: PaymentIntentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wallet_record = wallet_for(current_user, db)
    transaction = Transaction(wallet_id=wallet_record.id, **payload.model_dump())
    db.add(transaction); db.commit(); db.refresh(transaction)
    return {"transaction": transaction, "provider": "not-configured", "status": "PENDING"}


@router.get("/transactions")
def transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wallet_record = wallet_for(current_user, db); db.commit()
    return list(db.scalars(select(Transaction).where(Transaction.wallet_id == wallet_record.id).order_by(Transaction.created_at.desc()).limit(100)))
