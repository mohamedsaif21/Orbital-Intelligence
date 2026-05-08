"""
Image preprocessing before NDVI calculation.
Handles cloud masking and image alignment.
"""

import numpy as np


def remove_clouds(band: np.ndarray, cloud_threshold: float = 0.85) -> np.ndarray:
    """
    Basic cloud masking: set very bright pixels to NaN.
    Clouds appear extremely bright in all bands.
    
    For production: use Sentinel-2's SCL (Scene Classification Layer) band instead.
    """
    masked = band.copy().astype(np.float64)
    masked[band > cloud_threshold] = np.nan
    return masked


def normalise_band(band: np.ndarray) -> np.ndarray:
    """
    Normalise a band to [0, 1] range.
    Handles Sentinel-2 uint16 values (0–10000) and regular uint8 (0–255).
    """
    band = band.astype(np.float64)
    if band.max() > 1.0:
        scale = 10000.0 if band.max() > 255 else 255.0
        band = band / scale
    return band.clip(0.0, 1.0)


def apply_median_filter(band: np.ndarray, size: int = 3) -> np.ndarray:
    """
    Apply median filter to reduce salt-and-pepper noise.
    size=3 is a 3x3 filter — gentle noise reduction.
    """
    try:
        from scipy.ndimage import median_filter
        return median_filter(band, size=size)
    except ImportError:
        # Fall back gracefully if scipy is not installed
        return band