# RedLayer — Backend (Python)

The garak-based red-teaming engine for the mock **SMB loan underwriting agent**:
attack suites (garak probes), harm→regulation mapping (ECOA/FCRA/GLBA/SR 11-7),
findings, per-finding re-test, and the JSON API the frontend consumes.

**Stack:** Python, managed with [uv](https://docs.astral.sh/uv/).

> **Migration note.** The current `src/redlayer/` code is the pattern scaffold from
> the first direction (Accounts Payable deterministic demo, now archived under
> `docs/archive/`). It is a working reference for the pluggable-vertical pattern
> and is being migrated to the garak/SMB engine described in
> [`docs/backend-plan.md`](../docs/backend-plan.md).

See [`docs/backend-plan.md`](../docs/backend-plan.md) and
[`docs/backend-todo.md`](../docs/backend-todo.md) for the full contract and build list.

## Responsibilities

- Expose the mock agent's tools: `read_invoice`, `search_finance_email`,
  `lookup_vendor_record`, `verify_bank_account`, `prepare_payment` — logging every call.
- Run the five-attempt scan deterministically and grade success from real tool-call logs.
- Serve the polling API: `POST /scan/start`, `GET /scan/:id/status`, `POST /scan/:id/replay`.
- Apply the mitigation and replay both the malicious and the legitimate control change.

## Not yet scaffolded

Application code lives here once initialized. CI (`.github/workflows/ci.yml`)
auto-activates the backend job (uv sync, ruff, pytest) when `backend/pyproject.toml` appears.
