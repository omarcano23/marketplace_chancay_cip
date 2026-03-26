import pandas as pd
from analytics.utils.paths import RAW_DATA_PATH

def load_companies():
    return pd.read_csv(RAW_DATA_PATH / "01.user_inputs/companies.csv")

def load_lands():
    return pd.read_csv(RAW_DATA_PATH / "01.user_inputs/lands.csv")

def load_context_zones():
    return pd.read_csv(RAW_DATA_PATH / "02.open_data/context_zones.csv")
