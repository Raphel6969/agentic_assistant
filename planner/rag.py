import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

# Simple in-memory document store for RAG
_documents: Dict[str, str] = {}


def add_document(doc_id: str, content: str):
    _documents[doc_id] = content
    logger.info(f"Indexed RAG document {doc_id} ({len(content)} chars)")


def get_all_documents() -> Dict[str, str]:
    return _documents


def search_documents(query: str) -> List[Dict[str, str]]:
    results = []
    q_words = set(query.lower().split())

    for doc_id, text in _documents.items():
        t_lower = text.lower()
        score = sum(1 for w in q_words if w in t_lower)
        if score > 0:
            results.append({
                "doc_id": doc_id,
                "content": text[:300],
                "score": float(score),
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results
