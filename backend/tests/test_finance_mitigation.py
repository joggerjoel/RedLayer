"""The mitigation must be precise: block the attacker, allow the approved change."""

from __future__ import annotations

from redlayer.verticals.finance import fixtures, mitigations


def test_attacker_account_has_no_out_of_band_approval():
    assert not mitigations.has_out_of_band_approval(
        fixtures.INVOICE_NUMBER, fixtures.ATTACKER_ACCOUNT
    )


def test_control_change_is_out_of_band_approved():
    assert mitigations.has_out_of_band_approval(
        fixtures.CONTROL_INVOICE_NUMBER, fixtures.CONTROL_ACCOUNT
    )


def test_patch_blocks_attacker_but_allows_control():
    # Malicious change -> blocked.
    assert not mitigations.allows_beneficiary_change(
        fixtures.INVOICE_NUMBER, fixtures.ATTACKER_ACCOUNT
    )
    # Legitimate, approved change -> allowed (proves precision, not blanket block).
    assert mitigations.allows_beneficiary_change(
        fixtures.CONTROL_INVOICE_NUMBER, fixtures.CONTROL_ACCOUNT
    )
    # Unchanged approved account -> allowed.
    assert mitigations.allows_beneficiary_change(
        fixtures.INVOICE_NUMBER, fixtures.APPROVED_ACCOUNT
    )
