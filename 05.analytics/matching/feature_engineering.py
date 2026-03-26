# analytics/matching/feature_engineering.py

def build_company_features(companies_df):
    """
    Normaliza y prepara variables clave de empresa.
    """
    df = companies_df.copy()

    df["space_required_m2"] = df["space_required_m2"].fillna(0)
    df["preferred_zone"] = df["preferred_zone"].str.lower()

    return df


def build_land_features(lands_df, context_df):
    """
    Enriquece terrenos con información contextual mínima.
    """
    df = lands_df.copy()

    df["area_m2"] = df["area_m2"].fillna(0)
    df["zone_type"] = df["zone_type"].str.lower()
    df["flood_risk"] = df["flood_risk"].str.lower()

    # merge simple con data abierta (si existe)
    if "zone_id" in df.columns and "zone_id" in context_df.columns:
        df = df.merge(context_df, on="zone_id", how="left")

    return df
