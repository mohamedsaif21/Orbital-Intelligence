"""
Change detection: compares two NDVI arrays and finds where
vegetation was removed. Removed vegetation = possible encroachment.
"""

import numpy as np
from typing import Tuple
from .ndvi import load_bands, calculate_ndvi, align_to_same_shape, ndvi_stats


def detect_changes(
    ndvi_before: np.ndarray,
    ndvi_after:  np.ndarray,
    threshold:   float = 0.15
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Find pixels where NDVI dropped significantly between two dates.

    Args:
        ndvi_before: NDVI array from the older (reference) image
        ndvi_after:  NDVI array from the recent image
        threshold:   Minimum NDVI drop to count as a change (default 0.15)
                     Lower = more sensitive, more false positives
                     Higher = misses small changes

    Returns:
        change_mask:  Boolean array — True where significant change occurred
        diff_map:     Float array of NDVI differences (before - after)
    """
    ndvi_before, ndvi_after = align_to_same_shape(ndvi_before, ndvi_after)

    # Positive diff = NDVI dropped = vegetation was removed
    diff_map    = ndvi_before - ndvi_after
    change_mask = diff_map > threshold

    return change_mask, diff_map


def classify_severity(area_sqm: float) -> str:
    """
    Convert changed area (square metres) into a severity level.

    Thresholds (adjust based on your district's land parcel sizes):
        HIGH   > 10,000 sqm  (~1 hectare)  — major encroachment
        MEDIUM > 2,000 sqm                 — moderate concern
        LOW    anything smaller             — minor / verify
    """
    if area_sqm > 10_000:
        return "HIGH"
    if area_sqm > 2_000:
        return "MEDIUM"
    return "LOW"


def run_full_pipeline(
    before_path: str,
    after_path:  str,
    threshold:   float = 0.15,
    pixel_area_sqm: float = 10.0,
) -> dict:
    """
    Full detection pipeline: load images → NDVI → change → severity.

    Args:
        before_path:    File path to the older satellite image
        after_path:     File path to the recent satellite image
        threshold:      NDVI drop threshold (default 0.15)
        pixel_area_sqm: Ground area per pixel in sqm (default 10 for Sentinel-2 10m)

    Returns:
        dict with all results ready to send as a JSON API response
    """
    # 1. Load bands from both images
    red_b, nir_b, meta_b = load_bands(before_path)
    red_a, nir_a, _      = load_bands(after_path)

    # 2. Calculate NDVI for both images
    ndvi_before = calculate_ndvi(red_b, nir_b)
    ndvi_after  = calculate_ndvi(red_a, nir_a)

    # 3. Detect changes
    change_mask, diff_map = detect_changes(ndvi_before, ndvi_after, threshold)

    # 4. Calculate stats
    changed_pixels  = int(change_mask.sum())
    total_pixels    = int(change_mask.size)
    area_sqm        = changed_pixels * pixel_area_sqm
    pct_changed     = round(changed_pixels / total_pixels * 100, 2) if total_pixels > 0 else 0
    severity        = classify_severity(area_sqm)

    stats_before = ndvi_stats(ndvi_before)
    stats_after  = ndvi_stats(ndvi_after)

    return {
        "status":           "success",
        "severity":         severity,
        "alert":            severity in ["HIGH", "MEDIUM"],
        "changed_pixels":   changed_pixels,
        "total_pixels":     total_pixels,
        "pct_changed":      pct_changed,
        "area_sqm":         round(area_sqm, 1),
        "ndvi_mean_before": stats_before["mean"],
        "ndvi_mean_after":  stats_after["mean"],
        "ndvi_drop":        round(stats_before["mean"] - stats_after["mean"], 4),
        "pct_vegetation_before": stats_before["pct_vegetation"],
        "pct_vegetation_after":  stats_after["pct_vegetation"],
        "image_meta": {
            "width":  meta_b["width"],
            "height": meta_b["height"],
            "bands":  meta_b["bands"],
        }
    }


# ── Quick self-test: python change.py ─────────────────────────────────────
if __name__ == "__main__":
    import numpy as np

    print("Testing change detection with simulated before/after data...")

    np.random.seed(0)

    # Before: healthy vegetation
    ndvi_before = np.random.uniform(0.4, 0.8, (300, 300))

    # After: half the area was cleared (0.0–0.1 NDVI = bare soil)
    ndvi_after = ndvi_before.copy()
    ndvi_after[100:200, 100:200] = np.random.uniform(0.0, 0.08, (100, 100))

    mask, diff = detect_changes(ndvi_before, ndvi_after, threshold=0.15)

    changed = int(mask.sum())
    area    = changed * 10  # 10 sqm per pixel
    sev     = classify_severity(area)

    print(f"  Changed pixels: {changed}")
    print(f"  Area: {area:,} sqm = {area/10000:.2f} hectares")
    print(f"  Severity: {sev}")
    print(f"  Expected: ~10,000 pixels changed in 100x100 block")
    print()
    print("change.py OK")