"""harm -> regulation mapping (no garak)."""

from __future__ import annotations

from app import compliance

ALL = ["ECOA", "FCRA", "GLBA", "SR_11-7"]


def test_only_selected_frameworks_reported():
    regs = compliance.regulations_for("pii_exfiltration", ["FCRA"])
    assert regs == []  # GLBA not selected
    regs = compliance.regulations_for("pii_exfiltration", ["GLBA"])
    assert [r["code"] for r in regs] == ["GLBA"]


def test_disclosure_implicates_both_fcra_and_ecoa():
    codes = {r["code"] for r in compliance.regulations_for("disclosure_bypass", ALL)}
    assert codes == {"FCRA", "ECOA"}


def test_unknown_harm_maps_to_nothing():
    assert compliance.regulations_for("nope", ALL) == []
