"""End-to-end scan + retest through garak (skipped if garak isn't installed).

Runs fully offline: the target narrates from templates (NARRATE off) and decides
by rule, so no network call is made and results are deterministic.
"""

from __future__ import annotations

import pytest

pytest.importorskip("garak")

from app import harness, store  # noqa: E402
from app.config import FRAMEWORKS  # noqa: E402

ALL_FRAMEWORKS = [f["id"] for f in FRAMEWORKS]


def _make_scan(suites):
    scan_id = store.new_scan_id()
    store.save_scan(
        {
            "id": scan_id,
            "status": "queued",
            "target": {"name": "t", "endpoint": "e"},
            "suites": suites,
            "frameworks": ALL_FRAMEWORKS,
            "progress": {"completed": 0, "total": 0},
            "summary": None,
            "created_at": harness.now_iso(),
            "completed_at": None,
            "error": None,
        }
    )
    return scan_id


def test_full_suite_scan_finds_all_three():
    scan_id = _make_scan(["latent_injection"])
    harness.run_scan(scan_id)
    scan = store.get_scan(scan_id)
    assert scan["status"] == "complete"
    findings = store.findings_for_scan(scan_id)
    assert len(findings) == 3
    assert all(f["status"] == "failed" for f in findings)
    assert scan["summary"]["attack_success_rate"] == 1.0
    assert 0 <= scan["summary"]["risk_score"] <= 100
    assert scan["summary"]["findings_count"] == 3


def test_retest_flips_to_blocked_with_allowed_control():
    scan_id = _make_scan(["latent_injection"])
    harness.run_scan(scan_id)
    findings = store.findings_for_scan(scan_id)
    disclosure = next(f for f in findings if f["harm_category"] == "disclosure_bypass")

    result = harness.retest_finding(disclosure["id"])
    assert result["previous_result"] == "failed"
    assert result["result"] == "blocked"
    assert result["control_case"]["result"] == "allowed"
    # One finding fixed => headline count drops from 3 to 2.
    assert result["summary"]["findings_count"] == 2
    assert store.get_finding(disclosure["id"])["status"] == "blocked"


def test_scan_is_reproducible():
    def signature(scan_id):
        return sorted(
            (f["harm_category"], f["severity"], f["status"])
            for f in store.findings_for_scan(scan_id)
        )

    s1 = _make_scan(["latent_injection"])
    harness.run_scan(s1)
    s2 = _make_scan(["latent_injection"])
    harness.run_scan(s2)
    assert signature(s1) == signature(s2)


def test_defended_scan_finds_nothing(monkeypatch):
    # With the fix enabled at scan time, the same probes come back clean —
    # the honest proof that retest's green is a real behavior change.
    monkeypatch.setenv("DEFENSE_ENABLED", "1")
    scan_id = _make_scan(["latent_injection"])
    harness.run_scan(scan_id)
    assert store.findings_for_scan(scan_id) == []
    assert store.get_scan(scan_id)["summary"]["risk_score"] == 0
