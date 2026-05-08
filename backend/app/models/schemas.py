"""
Pydantic schemas — define the shape of API request/response JSON.
FastAPI uses these for automatic validation and documentation.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import date


class DetectionResponse(BaseModel):
    status:                  str
    severity:                str          # HIGH / MEDIUM / LOW
    alert:                   bool
    changed_pixels:          int
    total_pixels:            int
    pct_changed:             float
    area_sqm:                float
    ndvi_mean_before:        float
    ndvi_mean_after:         float
    ndvi_drop:               float
    pct_vegetation_before:   float
    pct_vegetation_after:    float


class AlertSchema(BaseModel):
    id:            int
    code:          str
    zone:          str
    severity:      str
    time:          str
    desc:          str
    lat:           float
    lon:           float
    land_cover:    str
    confidence:    float
    gps_lat:       str
    gps_lon:       str


class AlertsResponse(BaseModel):
    alerts: list[AlertSchema]
    total:  int