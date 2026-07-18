from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.identity.models import User
from app.modules.notifications.models import Notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("")
def list_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list(db.scalars(select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).limit(100)))


@router.post("/{notification_id}/read")
def mark_read(notification_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notification = db.get(Notification, notification_id)
    if notification is None or notification.user_id != current_user.id: raise HTTPException(404, "Obaveštenje nije pronađeno.")
    notification.is_read = True; db.commit(); return {"read": True}


@router.post("/read-all")
def mark_all_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notifications = db.scalars(select(Notification).where(Notification.user_id == current_user.id, Notification.is_read.is_(False)))
    count = 0
    for notification in notifications:
        notification.is_read = True
        count += 1
    db.commit()
    return {"read": True, "count": count}
