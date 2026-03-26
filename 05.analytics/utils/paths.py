from pathlib import Path

# Raíz del proyecto
PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_PATH = PROJECT_ROOT / "data"

RAW_DATA_PATH = DATA_PATH / "01.raw"
PROCESSED_DATA_PATH = DATA_PATH / "02.processed"
