"""
File Upload Utilities
Handles file storage, validation, and compression
"""

import os
import uuid
from typing import Optional, Tuple
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from PIL import Image
import io


# Allowed file types
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_DOCUMENT_TYPES = {"application/pdf", "application/msword", 
                           "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                           "text/plain"}
ALLOWED_TYPES = ALLOWED_IMAGE_TYPES | ALLOWED_DOCUMENT_TYPES

# Size limits
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_DOCUMENT_SIZE = 10 * 1024 * 1024  # 10MB
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Image compression settings
IMAGE_MAX_WIDTH = 1920
IMAGE_MAX_HEIGHT = 1080
IMAGE_QUALITY = 85

# Upload directories
UPLOAD_DIR = Path("uploads")
PHOTOS_DIR = UPLOAD_DIR / "photos"
FILES_DIR = UPLOAD_DIR / "files"
TEMP_DIR = UPLOAD_DIR / "temp"


def ensure_upload_dirs():
    """Create upload directories if they don't exist"""
    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    FILES_DIR.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)


def validate_file_size(file: UploadFile, max_size: int) -> None:
    """Validate file size"""
    file.file.seek(0, 2)  # Seek to end
    size = file.file.tell()
    file.file.seek(0)  # Reset to start
    
    if size > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {max_size / (1024 * 1024):.1f}MB"
        )


def validate_file_type(file: UploadFile, allowed_types: set) -> None:
    """Validate file MIME type"""
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
        )


def generate_filename(original_filename: str, prefix: str = "") -> str:
    """Generate unique filename"""
    ext = Path(original_filename).suffix.lower()
    unique_id = str(uuid.uuid4())
    return f"{prefix}{unique_id}{ext}" if prefix else f"{unique_id}{ext}"


def compress_image(image_bytes: bytes, max_width: int = IMAGE_MAX_WIDTH, 
                   max_height: int = IMAGE_MAX_HEIGHT, 
                   quality: int = IMAGE_QUALITY) -> bytes:
    """Compress and resize image"""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Resize if needed
        if img.width > max_width or img.height > max_height:
            img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        
        # Save to bytes
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        return output.getvalue()
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process image: {str(e)}"
        )


async def save_upload_file(file: UploadFile, upload_type: str = "file") -> str:
    """
    Save uploaded file and return the file path
    
    Args:
        file: The uploaded file
        upload_type: 'photo' or 'file'
    
    Returns:
        Relative path to saved file
    """
    ensure_upload_dirs()
    
    # Determine destination and allowed types
    if upload_type == "photo":
        destination_dir = PHOTOS_DIR
        allowed_types = ALLOWED_IMAGE_TYPES
        max_size = MAX_IMAGE_SIZE
        prefix = "photo_"
    else:
        destination_dir = FILES_DIR
        allowed_types = ALLOWED_TYPES
        max_size = MAX_FILE_SIZE
        prefix = "file_"
    
    # Validate
    validate_file_type(file, allowed_types)
    validate_file_size(file, max_size)
    
    # Generate filename
    filename = generate_filename(file.filename, prefix)
    file_path = destination_dir / filename
    
    # Read file content
    content = await file.read()
    
    # Compress images
    if file.content_type in ALLOWED_IMAGE_TYPES and upload_type == "photo":
        content = compress_image(content)
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Return relative path
    return str(file_path.relative_to(UPLOAD_DIR))


def delete_file(file_path: str) -> bool:
    """
    Delete uploaded file
    
    Args:
        file_path: Relative path from uploads directory
    
    Returns:
        True if deleted, False if not found
    """
    full_path = UPLOAD_DIR / file_path
    
    if full_path.exists():
        full_path.unlink()
        return True
    return False


def get_file_url(file_path: Optional[str], base_url: str = "") -> Optional[str]:
    """
    Convert file path to URL
    
    Args:
        file_path: Relative file path
        base_url: Base URL for the application
    
    Returns:
        Full URL to file or None
    """
    if not file_path:
        return None
    
    # Ensure base_url doesn't end with slash
    base_url = base_url.rstrip('/')
    
    # Return URL
    return f"{base_url}/uploads/{file_path}"
