from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["reports"])


@router.get("/reports")
def list_reports():
    """List generated reports."""
    return {
        "reports": [
            {"id": 1, "title": "Weekly Encroachment Summary", "date": "2024-11-10", "status": "ready"},
            {"id": 2, "title": "District-Level Analysis",    "date": "2024-11-08", "status": "ready"},
        ]
    }