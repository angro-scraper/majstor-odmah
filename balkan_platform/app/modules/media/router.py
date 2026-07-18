import uuid
from pathlib import Path
from urllib.parse import quote

import httpx
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.identity.models import User
from app.modules.media.models import MediaAsset

router = APIRouter(prefix="/media", tags=["Media"])
settings = get_settings()

ALLOWED_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/heic": ".heic",
}


def require_storage_configuration() -> None:
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Storage još nije konfigurisan na serveru.",
        )


def detect_image_mime(content: bytes) -> str | None:
    if content.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if content.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if content.startswith(b"RIFF") and content[8:12] == b"WEBP":
        return "image/webp"
    if len(content) >= 12 and content[4:8] == b"ftyp" and content[8:12] in {b"heic", b"heix", b"hevc", b"hevx", b"mif1"}:
        return "image/heic"
    return None


def storage_headers() -> dict[str, str]:
    return {
        "apikey": settings.supabase_service_role_key,
        "Authorization": f"Bearer {settings.supabase_service_role_key}",
    }


@router.post("/assets", status_code=status.HTTP_201_CREATED)
def upload_asset(
    file: UploadFile = File(...),
    usage: str = "general",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload one private image under the current Balkan ID account."""
    require_storage_configuration()
    if not file.filename:
        raise HTTPException(400, "Izaberi sliku za upload.")

    content = file.file.read(settings.media_max_bytes + 1)
    if not content:
        raise HTTPException(400, "Fajl je prazan.")
    if len(content) > settings.media_max_bytes:
        raise HTTPException(413, f"Slika može imati najviše {settings.media_max_bytes // 1024 // 1024} MB.")

    actual_mime = detect_image_mime(content)
    if actual_mime is None:
        raise HTTPException(415, "Dozvoljeni su samo JPEG, PNG, WebP i HEIC formati.")

    safe_usage = "".join(char for char in usage.lower() if char.isalnum() or char in "-_")[:40] or "general"
    original_name = Path(file.filename).name[:255]
    object_path = f"{current_user.id}/{safe_usage}/{uuid.uuid4().hex}{ALLOWED_MIME_TYPES[actual_mime]}"
    encoded_path = quote(object_path, safe="/")
    storage_url = f"{settings.supabase_url.rstrip('/')}/storage/v1/object/{settings.supabase_storage_bucket}/{encoded_path}"

    try:
        response = httpx.put(
            storage_url,
            content=content,
            headers={**storage_headers(), "Content-Type": actual_mime, "x-upsert": "false"},
            timeout=20.0,
        )
        response.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(502, "Storage trenutno ne prihvata sliku. Pokušaj ponovo.") from exc

    asset = MediaAsset(
        owner_user_id=current_user.id,
        bucket=settings.supabase_storage_bucket,
        object_path=object_path,
        original_filename=original_name,
        content_type=actual_mime,
        byte_size=len(content),
        usage=safe_usage,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@router.get("/assets")
def list_my_assets(
    usage: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    statement = select(MediaAsset).where(MediaAsset.owner_user_id == current_user.id)
    if usage:
        statement = statement.where(MediaAsset.usage == usage)
    return list(db.scalars(statement.order_by(MediaAsset.created_at.desc()).limit(100)))


@router.post("/assets/{asset_id}/signed-url")
def create_signed_url(
    asset_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return a temporary URL after an ownership check; raw objects stay private."""
    require_storage_configuration()
    asset = db.scalar(
        select(MediaAsset).where(MediaAsset.id == asset_id, MediaAsset.owner_user_id == current_user.id)
    )
    if asset is None:
        raise HTTPException(404, "Slika nije pronađena.")

    encoded_path = quote(asset.object_path, safe="/")
    sign_url = (
        f"{settings.supabase_url.rstrip('/')}/storage/v1/object/sign/"
        f"{asset.bucket}/{encoded_path}"
    )
    try:
        response = httpx.post(
            sign_url,
            json={"expiresIn": settings.media_signed_url_ttl_seconds},
            headers=storage_headers(),
            timeout=15.0,
        )
        response.raise_for_status()
        signed_path = response.json().get("signedURL")
    except (httpx.HTTPError, ValueError) as exc:
        raise HTTPException(502, "Privremeni link za sliku nije mogao biti napravljen.") from exc
    if not signed_path:
        raise HTTPException(502, "Storage nije vratio privremeni link.")
    return {
        "asset_id": asset.id,
        "url": f"{settings.supabase_url.rstrip('/')}/storage/v1{signed_path}",
        "expires_in": settings.media_signed_url_ttl_seconds,
    }
