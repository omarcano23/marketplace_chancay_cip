# analytics/matching/config.py

MATCHING_WEIGHTS = {
    "zone_fit": 0.30,
    "area_fit": 0.25,
    "use_case_fit": 0.25,
    "infrastructure_fit": 0.20
}

# score máximo teórico
MAX_SCORE = sum(MATCHING_WEIGHTS.values())
