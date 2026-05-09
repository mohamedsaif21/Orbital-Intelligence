from fastapi import APIRouter, Query
from typing import Optional
from ..data.land_data import GOVERNMENT_LANDS, ENCROACHED_LANDS

router = APIRouter(prefix="/api", tags=["lands"])


@router.get("/lands")
def get_all_lands(type: Optional[str] = Query(default=None)):
    if type == "government":
        return {"lands": GOVERNMENT_LANDS, "total": len(GOVERNMENT_LANDS)}
    if type == "encroached":
        return {"lands": ENCROACHED_LANDS, "total": len(ENCROACHED_LANDS)}
    return {
        "government": GOVERNMENT_LANDS,
        "encroached": ENCROACHED_LANDS,
        "total_government": len(GOVERNMENT_LANDS),
        "total_encroached": len(ENCROACHED_LANDS),
    }


@router.get("/lands/{land_id}")
def get_land_by_id(land_id: str):
    for land in GOVERNMENT_LANDS + ENCROACHED_LANDS:
        if land["id"] == land_id:
            return land
    return {"error": f"Land {land_id} not found"}