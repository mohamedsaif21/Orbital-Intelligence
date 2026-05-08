from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/api", tags=["alerts"])

# ── Mock alerts (replace with real DB queries in Week 4) ──────────────────
MOCK_ALERTS = [
    {
        "id": 1,
        "code": "Parcel #882-NORTH",
        "zone": "Lat: 11.127, Long: 78.657",
        "severity": "breach-critical",
        "time": "2m ago",
        "desc": "Unauthorised structural expansion detected on government land parcel.",
        "lat": 11.127, "lon": 78.657,
        "land_cover": "+12.4",
        "confidence": 98.4,
        "gps_lat": "11.1271° N",
        "gps_lon": "78.6569° E",
    },
    {
        "id": 2,
        "code": "Zone-DELTA / Sector 4",
        "zone": "Vegetation index drop detected",
        "severity": "under-review",
        "time": "14m ago",
        "desc": "Significant vegetation loss. Possible agricultural encroachment.",
        "lat": 11.55, "lon": 79.20,
        "land_cover": "+7.1",
        "confidence": 81.2,
        "gps_lat": "11.5501° N",
        "gps_lon": "79.2003° E",
    },
    {
        "id": 3,
        "code": "Plot #114-ALPHA",
        "zone": "Routine maintenance verified",
        "severity": "cleared",
        "time": "1h ago",
        "desc": "Earthworks reviewed by field officer — no boundary violation found.",
        "lat": 10.90, "lon": 78.10,
        "land_cover": "-1.2",
        "confidence": 62.0,
        "gps_lat": "10.9012° N",
        "gps_lon": "78.1034° E",
    },
]


@router.get("/alerts")
def get_alerts(
    severity: Optional[str] = Query(
        default=None,
        description="Filter by severity: breach-critical, under-review, cleared"
    )
):
    """Get all current encroachment alerts, optionally filtered by severity."""
    alerts = MOCK_ALERTS
    if severity:
        alerts = [a for a in alerts if a["severity"] == severity]
    return {"alerts": alerts, "total": len(alerts)}


@router.get("/alerts/{alert_id}")
def get_alert_by_id(alert_id: int):
    """Get details for a single alert by ID."""
    for alert in MOCK_ALERTS:
        if alert["id"] == alert_id:
            return alert
    return {"error": f"Alert {alert_id} not found"}


@router.get("/stats")
def get_stats():
    """Summary statistics for the KPI cards in the dashboard."""
    high   = sum(1 for a in MOCK_ALERTS if a["severity"] == "breach-critical")
    review = sum(1 for a in MOCK_ALERTS if a["severity"] == "under-review")
    cleared = sum(1 for a in MOCK_ALERTS if a["severity"] == "cleared")
    return {
        "land_monitored_ha":  1240,
        "total_encroachments": len(MOCK_ALERTS),
        "breach_critical":    high,
        "under_review":       review,
        "cleared":            cleared,
        "verified_cases":     5,
        "action_taken_pct":   88,
    }