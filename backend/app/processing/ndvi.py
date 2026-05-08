"""
NDVI = (NIR - Red) / (NIR + Red)
Result: -1 to +1
  < 0.1  = bare soil, roads, buildings
  0.1–0.3 = sparse vegetation
  > 0.3  = healthy dense vegetation

A DROP in NDVI between two dates = land was cleared = possible encroachment.
"""

import numpy as np
import rasterio
from pathlib import Path
from typing import Tuple


def load_bands(image_path: str) -> Tuple[np.ndarray, np.ndarray, dict]:
    """
    Load Red and NIR bands from any satellite image file.
    Supports .tif (Sentinel-2) and .jpg/.png (approximate fallback).
    
    Returns: (red_array, nir_array, metadata)
    """
    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    with rasterio.open(image_path) as src:
        band_count = src.count

        meta = {
            "width":     src.width,
            "height":    src.height,
            "bands":     band_count,
            "crs":       str(src.crs),
            "transform": src.transform,
        }

        # Sentinel-2 has 13 bands → Red=4, NIR=8
        # Landsat-8/9 has 11 bands → Red=4, NIR=5
        # Regular RGB images (3 bands) → approximate with R=1, G=2
        if band_count >= 8:
            red = src.read(4).astype(np.float64)
            nir = src.read(8).astype(np.float64)
        elif band_count >= 5:
            red = src.read(4).astype(np.float64)
            nir = src.read(5).astype(np.float64)
        else:
            red = src.read(1).astype(np.float64)
            nir = src.read(min(2, band_count)).astype(np.float64)

        # Sentinel-2 pixel values are in [0, 10000] — normalise to [0, 1]
        if red.max() > 1.0:
            red = red / 10000.0
            nir = nir / 10000.0

    return red, nir, meta


def calculate_ndvi(red: np.ndarray, nir: np.ndarray) -> np.ndarray:
    """
    Core NDVI formula. Handles division-by-zero safely.
    Returns float64 array clipped to [-1, 1].
    """
    red = red.astype(np.float64)
    nir = nir.astype(np.float64)

    denominator = nir + red

    ndvi = np.where(
        denominator == 0,
        0.0,
        (nir - red) / denominator
    )

    # Replace any NaN or Inf values with 0
    ndvi = np.nan_to_num(ndvi, nan=0.0, posinf=1.0, neginf=-1.0)
    return ndvi.clip(-1.0, 1.0)


def align_to_same_shape(
    arr1: np.ndarray,
    arr2: np.ndarray
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Crop both arrays to the same dimensions.
    Needed when two images of the same area have slightly different sizes.
    """
    h = min(arr1.shape[0], arr2.shape[0])
    w = min(arr1.shape[1], arr2.shape[1])
    return arr1[:h, :w], arr2[:h, :w]


def ndvi_stats(ndvi: np.ndarray) -> dict:
    """
    Return key statistics from an NDVI array.
    Used to summarise 'before' and 'after' images.
    """
    valid = ndvi[~np.isnan(ndvi)].flatten()

    if len(valid) == 0:
        return {"error": "No valid pixels"}

    return {
        "mean":           round(float(np.mean(valid)),   4),
        "median":         round(float(np.median(valid)), 4),
        "min":            round(float(np.min(valid)),    4),
        "max":            round(float(np.max(valid)),    4),
        "pct_vegetation": round(float(np.mean(valid > 0.2)) * 100, 2),
        "pct_bare":       round(float(np.mean(valid <= 0.2)) * 100, 2),
        "total_pixels":   int(len(valid)),
    }


# ── Quick self-test: python ndvi.py ───────────────────────────────────────
if __name__ == "__main__":
    print("Testing NDVI calculation with simulated data...")

    # Simulate healthy vegetation (low red, high NIR)
    np.random.seed(42)
    red = np.random.uniform(0.02, 0.10, (200, 200))
    nir = np.random.uniform(0.30, 0.60, (200, 200))

    ndvi = calculate_ndvi(red, nir)
    stats = ndvi_stats(ndvi)

    print(f"  Shape: {ndvi.shape}")
    print(f"  Mean NDVI:    {stats['mean']}  (expect ~0.6 for healthy vegetation)")
    print(f"  Vegetation %: {stats['pct_vegetation']}%")
    print(f"  Bare/urban %: {stats['pct_bare']}%")
    print()

    # Simulate encroachment: before=vegetation, after=construction
    red_after = np.random.uniform(0.15, 0.30, (200, 200))   # more red (bare soil)
    nir_after = np.random.uniform(0.10, 0.20, (200, 200))   # less NIR

    ndvi_after = calculate_ndvi(red_after, nir_after)
    stats_after = ndvi_stats(ndvi_after)

    print(f"  After (post-construction) NDVI mean: {stats_after['mean']}")
    print(f"  NDVI drop: {round(stats['mean'] - stats_after['mean'], 4)}")
    print()
    print("ndvi.py OK")