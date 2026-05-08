import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from ..processing.change import run_full_pipeline

router = APIRouter(prefix="/api", tags=["detection"])

TEMP_DIR = "data/temp"
os.makedirs(TEMP_DIR, exist_ok=True)


@router.post("/detect")
async def detect_encroachment(
    image_before: UploadFile = File(..., description="Older satellite image"),
    image_after:  UploadFile = File(..., description="Recent satellite image"),
):
    """
    Upload two satellite images (before & after).
    Returns NDVI change analysis and severity classification.
    
    Test at: http://localhost:8000/docs
    """
    # Validate file types
    allowed = {".tif", ".tiff", ".jpg", ".jpeg", ".png"}
    for upload in [image_before, image_after]:
        ext = os.path.splitext(upload.filename)[1].lower()
        if ext not in allowed:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {ext}. Use .tif, .jpg, or .png"
            )

    # Save uploaded files to temp directory
    before_path = os.path.join(TEMP_DIR, f"before_{image_before.filename}")
    after_path  = os.path.join(TEMP_DIR, f"after_{image_after.filename}")

    try:
        for upload, path in [(image_before, before_path), (image_after, after_path)]:
            with open(path, "wb") as f:
                shutil.copyfileobj(upload.file, f)

        # Run the full NDVI change detection pipeline
        result = run_full_pipeline(before_path, after_path)
        return result

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

    finally:
        # Always clean up temp files
        for path in [before_path, after_path]:
            if os.path.exists(path):
                os.remove(path)