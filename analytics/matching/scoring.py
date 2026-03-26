# analytics/matching/scoring.py

# analytics/matching/scoring.py

def score_company_land(company, land, weights):
    """
    Retorna scores parciales + score final explicable (0–100)
    """

    # --- 1. Zone fit ---
    zone_fit = 1.0 if company["preferred_zone"] == land["zone_type"] else 0.0

    # --- 2. Area fit ---
    if land["area_m2"] >= company["space_required_m2"]:
        area_fit = 1.0
    else:
        area_fit = land["area_m2"] / max(company["space_required_m2"], 1)

    area_fit = min(area_fit, 1.0)

    # --- 3. Use case fit (MVP explicable) ---
    # Regla simple por sector vs tipo de zona
    sector = company["sector"]
    zone = land["zone_type"]

    if sector in ["Logística", "Comercio"] and zone == "Logístico":
        use_case_fit = 1.0
    elif sector in ["Manufactura", "Metalmecánica", "Tecnología"] and zone == "Industrial":
        use_case_fit = 1.0
    elif zone == "Mixto":
        use_case_fit = 0.7
    else:
        use_case_fit = 0.4

    # --- 4. Technical fit --- 
    if land["flood_risk"] == "bajo":
        flood_risk = 1.0 
    elif land["flood_risk"] == "medio":
        flood_risk = 0.6
    else: 0.1  
    road_fit = 1.0 if land["road_access"] == "Directo" else 0.7
    power_fit = 1.0 if land["power_available_kw"] >= company["power_demand_kw"] else 0.6


    technical_fit = round((power_fit + road_fit + flood_risk) / 3, 2) #cambiar en función a cantidad de parámetros

    # --- Score final ponderado ---
    final_score = (
        zone_fit * weights["zone_fit"] +
        area_fit * weights["area_fit"] +
        use_case_fit * weights["use_case_fit"] +
        technical_fit * weights["technical_fit"]
    )

    return {
        "zone_fit": round(zone_fit, 2),
        "area_fit": round(area_fit, 2),
        "use_case_fit": round(use_case_fit, 2),
        "technical_fit": round(technical_fit, 2),
        "final_score": round(final_score * 100, 1)
    }
