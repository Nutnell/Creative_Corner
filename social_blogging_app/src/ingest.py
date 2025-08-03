# src/ingest.py
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.social_blogging_app.utils.embedding_store import ingest_documents

if __name__ == "__main__":
    print(ingest_documents(folder_path="knowledge"))
