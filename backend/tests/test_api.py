"""API contract smoke tests (skipped if garak/httpx aren't installed)."""

from __future__ import annotations

import pytest

pytest.importorskip("garak")
pytest.importorskip("httpx")

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

client = TestClient(app)


def test_config_shape_matches_contract():
    body = client.get("/api/config").json()
    assert {o["id"] for o in body["suites"]} == {
        "latent_injection",
        "unauthorized_action",
        "pii_exfiltration",
        "disclosure_bypass",
    }
    assert {o["id"] for o in body["frameworks"]} == {"ECOA", "FCRA", "GLBA", "SR_11-7"}


def test_unknown_ids_404():
    assert client.get("/api/scans/nope").status_code == 404
    assert client.get("/api/scans/nope/findings").status_code == 404
    assert client.get("/api/findings/nope").status_code == 404
    assert client.post("/api/findings/nope/retest").status_code == 404
