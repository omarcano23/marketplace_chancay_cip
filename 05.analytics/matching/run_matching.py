# analytics/matching/run_matching.py

import pandas as pd

from analytics.matching.data_loader import (
    load_companies,
    load_lands,
    load_context_zones
)
from analytics.matching.feature_engineering import (
    build_company_features,
    build_land_features
)
from analytics.matching.scoring import score_company_land
from analytics.matching.config import MATCHING_WEIGHTS
from analytics.utils.paths import PROCESSED_DATA_PATH


def run():
    # 1. Load data
    companies = build_company_features(load_companies())
    lands = build_land_features(load_lands(), load_context_zones())

    results = []

    # 2. Matching logic
    for _, company in companies.iterrows():
        for _, land in lands.iterrows():
            scores = score_company_land(company, land, MATCHING_WEIGHTS)

            results.append({
                "company_id": company["company_id"],
                "land_id": land["land_id"],
                **scores
            })

    # 3. Build final table
    results_df = pd.DataFrame(results)

    results_df["rank"] = (
        results_df
        .groupby("company_id")["final_score"]
        .rank(ascending=False, method="dense")
    )

    # 4. Save output
    output_path = PROCESSED_DATA_PATH / "matching_results.csv"
    results_df.sort_values(
        ["company_id", "rank"]
    ).to_csv(output_path, index=False)

    print(f"Matching generado correctamente en:\n{output_path}")


if __name__ == "__main__":
    run()
