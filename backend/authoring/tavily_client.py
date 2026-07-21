"""Thin Tavily wrapper used only at authoring time.

- Lazy-imports the optional ``tavily`` dependency, so this module can be
  imported (e.g. by tests) even when the extra isn't installed.
- Reads the API key **by env-var name only** (never hardcoded). Rotate the key
  freely; nothing here caches it.
"""

from __future__ import annotations

import os

API_KEY_ENV = "TAVILY_API_KEY"


class TavilyNotInstalled(RuntimeError):
    """Raised when the optional ``authoring`` extra isn't installed."""


class TavilyKeyMissing(RuntimeError):
    """Raised when TAVILY_API_KEY isn't set in the environment."""


def _client():
    try:
        from tavily import TavilyClient
    except ImportError as exc:  # pragma: no cover - depends on optional extra
        raise TavilyNotInstalled(
            "Tavily is optional. Install it with:  pip install '.[authoring]'"
        ) from exc
    key = os.environ.get(API_KEY_ENV)
    if not key:
        raise TavilyKeyMissing(f"{API_KEY_ENV} is not set in the environment")
    return TavilyClient(api_key=key)


def search(query: str, max_results: int = 5) -> list[dict]:
    """Return raw Tavily search results for a query (authoring use only)."""
    response = _client().search(query=query, max_results=max_results)
    return response.get("results", [])
