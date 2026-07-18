# Archived: Accounts Payable deterministic demo

**Superseded on 2026-07-18.** These four docs describe RedLayer's first direction:
a deterministic, scripted red-team demo against a mock Accounts Payable Agent
(vendor-payment fraud, 5 ordered attempts, global patch/replay).

The project pivoted to an **SMB loan-underwriting** red-teaming dashboard built on
NVIDIA **garak**, with a findings-based API, compliance mapping, and per-finding
red→green retest. See the active docs in `docs/`.

Kept for reference: the vulnerability-naming, determinism, and patch-precision
reasoning here still informs how we keep the new demo honest and reproducible.
