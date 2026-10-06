import math
from typing import Dict, Any, List

def calculate_zone_risk(
    rainfall: float,
    water_level: float,
    elevation: float,
    population_density: float
) -> Dict[str, Any]:
    """
    Transparent & Explainable AI Risk Scoring Model
    Returns risk score (0-100), risk classification, and factor attribution breakdown.
    """
    # 1. Rainfall score (max 35 pts)
    rainfall_pts = min(35.0, round((rainfall / 160.0) * 35.0, 1))

    # 2. Water level score (max 35 pts)
    water_pts = min(35.0, round((water_level / 4.5) * 35.0, 1))

    # 3. Elevation vulnerability score (max 20 pts)
    elevation_pts = 0.0
    if elevation < 30.0:
        elevation_pts = round(((30.0 - max(0.0, elevation)) / 30.0) * 20.0, 1)
    elevation_pts = max(0.0, min(20.0, elevation_pts))

    # 4. Population density impact bonus (max 10 pts)
    pop_pts = min(10.0, round((population_density / 10000.0) * 10.0, 1))

    raw_score = rainfall_pts + water_pts + elevation_pts + pop_pts
    score = int(min(100, max(0, round(raw_score))))

    # Classification
    if score >= 70:
        level = "HIGH"
    elif score >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    factors = [
        {
            "factor": "Rainfall Volume",
            "points": rainfall_pts,
            "maxPoints": 35.0,
            "icon": "CloudRain",
            "valueString": f"{rainfall} mm",
            "description": "Precipitation level impacting urban drainage."
        },
        {
            "factor": "Water Level",
            "points": water_pts,
            "maxPoints": 35.0,
            "icon": "Waves",
            "valueString": f"{water_level} m",
            "description": "Drainage runoff & river bank elevation."
        },
        {
            "factor": "Terrain Low Elevation",
            "points": elevation_pts,
            "maxPoints": 20.0,
            "icon": "Mountain",
            "valueString": f"{elevation} m",
            "description": "Basin elevation flood vulnerability."
        },
        {
            "factor": "Population Density",
            "points": pop_pts,
            "maxPoints": 10.0,
            "icon": "Users",
            "valueString": f"{int(population_density)} /km²",
            "description": "Human exposure & congestion impact."
        }
    ]

    factors.sort(key=lambda x: x["points"], reverse=True)

    if level == "HIGH":
        rationale = f"CRITICAL: Zone risk score reaches {score}/100 due to heavy rainfall ({rainfall}mm) and high water level ({water_level}m) on low terrain ({elevation}m)."
    elif level == "MEDIUM":
        rationale = f"ELEVATED: Zone risk score is {score}/100. Moderate hydrological runoff requires monitoring."
    else:
        rationale = f"NORMAL: Zone risk score is {score}/100. Operational parameters within baseline bounds."

    return {
        "score": score,
        "level": level,
        "factors": factors,
        "rationale": rationale
    }
