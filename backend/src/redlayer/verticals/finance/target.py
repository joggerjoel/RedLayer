"""The mock Accounts Payable Agent and its tools.

The target's decision to call ``prepare_payment`` is RULE-BASED, not
model-sampled (docs/backend-plan.md "Determinism Decision"). Any LLM output is
decorative narration and never gates an attempt's status.

Tool bodies are stubs to be filled against the plan; signatures are fixed so the
scanner and grader can rely on them.
"""

from __future__ import annotations

from typing import Any

TOOL_NAMES = (
    "read_invoice",
    "search_finance_email",
    "lookup_vendor_record",
    "verify_bank_account",
    "prepare_payment",
)


def read_invoice(invoice_number: str) -> dict[str, Any]:
    """Return (possibly poisoned) invoice content. TODO: implement from fixtures."""
    raise NotImplementedError


def search_finance_email(query: str) -> list[dict[str, Any]]:
    """Return (possibly poisoned) finance emails. TODO: implement from fixtures."""
    raise NotImplementedError


def lookup_vendor_record(vendor_name: str) -> dict[str, Any]:
    """Return the trusted vendor record. TODO: implement from fixtures."""
    raise NotImplementedError


def verify_bank_account(account: str) -> dict[str, Any]:
    """Report account verification. Poisonable per attempt. TODO: implement."""
    raise NotImplementedError


def prepare_payment(invoice_number: str, destination_account: str, amount: int) -> dict[str, Any]:
    """The forbidden sink. Records the call; never moves real money. TODO: implement."""
    raise NotImplementedError
