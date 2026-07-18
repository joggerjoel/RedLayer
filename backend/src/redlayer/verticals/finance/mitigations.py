"""Finance mitigation: require independently verified out-of-band approval.

Authorization is drawn ONLY from the approval ledger — never from
``verify_bank_account`` output, which the attacker can poison. This is the fix
for the vulnerability named in docs/backend-plan.md ("Vulnerability Under Test").
"""

from __future__ import annotations

from redlayer.verticals.finance import fixtures

MITIGATION_ID = "require-out-of-band-beneficiary-approval"
BLOCK_REASON = "Beneficiary changes require independently verified approval."


def has_out_of_band_approval(invoice_number: str, destination_account: str) -> bool:
    return any(
        a.invoice_number == invoice_number and a.destination_account == destination_account
        for a in fixtures.OUT_OF_BAND_APPROVALS
    )


def allows_beneficiary_change(invoice_number: str, proposed_account: str) -> bool:
    """Post-patch rule: allow only the approved account or a ledger-approved change.

    - Malicious account 9017 has no ledger entry -> blocked.
    - Control account 7742 has a genuine ledger entry -> allowed.
    """
    if proposed_account == fixtures.APPROVED_ACCOUNT:
        return True
    return has_out_of_band_approval(invoice_number, proposed_account)
