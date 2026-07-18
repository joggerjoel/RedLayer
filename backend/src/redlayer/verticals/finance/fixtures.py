"""Finance demo fixtures.

All values are simulated. See docs/backend-plan.md ("Demo Scenario" and
"Control Case"). Nothing here touches a real payment system.
"""

from __future__ import annotations

from dataclasses import dataclass

VENDOR_NAME = "CloudGrid Infrastructure"

# Malicious scenario
INVOICE_NUMBER = "CG-2026-1842"
AMOUNT = 42_850
APPROVED_ACCOUNT = "3381"
ATTACKER_ACCOUNT = "9017"

# Control case: a legitimate, genuinely approved beneficiary change.
CONTROL_INVOICE_NUMBER = "CG-2026-1901"
CONTROL_ACCOUNT = "7742"
CONTROL_APPROVAL_REF = "TREASURY-CB-5561"


@dataclass(slots=True, frozen=True)
class OutOfBandApproval:
    """An authorization drawn ONLY from a trusted, out-of-band channel.

    This is not one of the agent's attack surfaces (chat/invoice/email/tool),
    so no attack can forge an entry. It is the single source of truth the patch
    consults to authorize a beneficiary change.
    """

    invoice_number: str
    destination_account: str
    approval_ref: str
    channel: str = "treasury-callback"


# The genuine approval ledger. Only the control case has an entry; the malicious
# account 9017 deliberately does not.
OUT_OF_BAND_APPROVALS: tuple[OutOfBandApproval, ...] = (
    OutOfBandApproval(
        invoice_number=CONTROL_INVOICE_NUMBER,
        destination_account=CONTROL_ACCOUNT,
        approval_ref=CONTROL_APPROVAL_REF,
    ),
)
