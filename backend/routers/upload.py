"""
Cloudinary signed upload proxy.
The frontend sends the file here; this endpoint signs the request using
server-side API credentials and forwards to Cloudinary.
Only the returned secure_url is stored in media_urls — no binary data in DB.
"""
import os
import time
import hashlib
import hmac
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import JSONResponse
import httpx

import models
import dependencies

router = APIRouter(prefix="/upload", tags=["Поле данных"])

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
CLOUDINARY_API_KEY     = os.getenv("CLOUDINARY_API_KEY", "")
CLOUDINARY_API_SECRET  = os.getenv("CLOUDINARY_API_SECRET", "")


def _make_signature(params: dict, api_secret: str) -> str:
    """Generate Cloudinary upload signature."""
    # Sort params alphabetically and concat as key=value&key=value
    sorted_params = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
    to_sign = sorted_params + api_secret
    return hashlib.sha256(to_sign.encode("utf-8")).hexdigest()


@router.post("/media", summary="Upload image/video to Cloudinary")
async def upload_media(
    file: UploadFile = File(...),
    current_user: models.User = Depends(dependencies.get_current_active_user),
):
    """
    Accepts a single image or video file.
    Signs the upload with server-side Cloudinary credentials.
    Returns: { url, public_id, resource_type, format, bytes }
    """
    if not CLOUDINARY_CLOUD_NAME or not CLOUDINARY_API_KEY or not CLOUDINARY_API_SECRET:
        raise HTTPException(
            status_code=503,
            detail="Cloudinary is not configured on the server. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET env vars on Render.",
        )

    timestamp = int(time.time())
    params = {
        "folder": "logistics",
        "timestamp": timestamp,
    }
    signature = _make_signature(params, CLOUDINARY_API_SECRET)

    # Read file bytes
    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Forward to Cloudinary
    upload_url = f"https://api.cloudinary.com/v1_1/{CLOUDINARY_CLOUD_NAME}/auto/upload"

    form_data = {
        "api_key": CLOUDINARY_API_KEY,
        "timestamp": str(timestamp),
        "signature": signature,
        "folder": "logistics",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            upload_url,
            data=form_data,
            files={"file": (file.filename, file_bytes, file.content_type)},
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Cloudinary upload failed: {response.text}",
        )

    data = response.json()
    return JSONResponse({
        "url": data["secure_url"],
        "public_id": data["public_id"],
        "resource_type": data["resource_type"],
        "format": data.get("format", ""),
        "bytes": data.get("bytes", 0),
    })
