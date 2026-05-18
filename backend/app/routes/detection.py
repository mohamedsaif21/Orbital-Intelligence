from fastapi import APIRouter

router = APIRouter()


@router.get("/detect")
async def detect():
    return {"status": "Detection route working"}