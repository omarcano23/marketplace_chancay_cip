from pathlib import Path

def load_knowledge():
    docs_path = Path("data/02.processed/legal_docs")
    documents = []
    for file in docs_path.glob("*.txt"):
        documents.append(file.read_text(encoding="utf-8"))
    return documents
