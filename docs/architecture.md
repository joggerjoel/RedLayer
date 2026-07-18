# Architecture: Pluggable Verticals

RedLayer separates a **domain-agnostic engine** from **pluggable verticals**.
The engine runs scans, grades from real tool calls, and serves the API without
knowing what domain it is attacking. Each vertical is a self-contained package
that teaches the engine one domain. **Finance** is the first; new domains
(healthcare, legal, HR, support, …) drop in without engine changes.

## Concepts

- **Vertical** — a domain being red-teamed (e.g. `finance`). Contributes one or
  more scenarios.
- **Scenario** — a target agent + a forbidden objective, plus everything needed
  to run the demo: the attack sequence, a deterministic grader, evidence, and a
  mitigation. Identified by `target_id` + `objective_id`, which is exactly what
  the API's `POST /scan/start` selects.
- **Engine (`core`)** — scan orchestration, the in-memory store, the shared
  data model, evidence, and the registry. Depends only on the abstract contract,
  never on a concrete vertical.

```
core  ──uses──▶  verticals/base (ABCs)  ◀──implements──  verticals/finance
  ▲                                                            │
  └──────────────── registry resolves target+objective ───────┘
```

The one hard rule: **`core` must never import from a concrete vertical.** That
inversion is what keeps verticals pluggable.

## Backend layout (`backend/src/redlayer/`)

```
core/
  models.py      # AttackAttempt, ToolCall, Evidence, ScanSummary, enums
  registry.py    # register / resolve verticals and scenarios
  scanner.py     # in-memory ScanStore + run_scan / run_replay (loop = TODO)
  evidence.py    # (future) shared evidence helpers
verticals/
  base.py        # RedTeamVertical + Scenario abstract contract
  __init__.py    # load_verticals(): registers every built-in vertical
  finance/
    fixtures.py     # simulated vendor, invoices, accounts, approval ledger
    target.py       # mock Accounts Payable Agent tools (rule-based decision)
    attempts.py     # the 5 attacks + the legitimate control case
    grading.py      # deterministic grader (prepare_payment → 9017)
    mitigations.py  # out-of-band approval patch (precise, not blanket)
    vertical.py     # AccountsPayableScenario + FinanceVertical wiring
api/
  app.py         # create_app() — framework TBD (FastAPI vs Flask)
```

## Frontend layout (`frontend/src/`)

```
core/
  types.ts       # mirror of the backend normalized model
  apiClient.ts   # fetch client for the 3 endpoints
  polling.ts     # poll status until a terminal state
verticals/
  types.ts       # VerticalConfig / ScenarioConfig (display metadata only)
  registry.ts    # VERTICALS list + findScenario()
  finance/
    config.ts    # finance display copy, amounts, attack-chain captions
components/       # shared, vertical-agnostic UI (framework TBD)
```

The UI renders normalized scan data generically; a vertical config only supplies
**copy and framing**, never per-attempt rendering.

## How to add a vertical

**Backend**

1. Create `backend/src/redlayer/verticals/<name>/`.
2. Implement `Scenario` (subclass `verticals.base.Scenario`): set `target_id`,
   `objective_id`, `forbidden_outcome`; implement `build_attempts`, `grade`
   (deterministic, from tool calls), `build_evidence`, and `apply_mitigation`.
3. Implement `RedTeamVertical` returning your scenario(s), plus a
   `build_vertical()` factory.
4. Register it in `verticals/__init__.py` `load_verticals()`.
5. Add tests mirroring `tests/test_vertical_registry.py`.

**Frontend**

1. Create `frontend/src/verticals/<name>/config.ts` exporting a `VerticalConfig`
   whose `targetId`/`objectiveId` match the backend.
2. Add it to `VERTICALS` in `verticals/registry.ts`.

No `core` files change in either half. That is the point.

## Invariants every vertical must uphold

- **Deterministic outcomes.** The target's decision is rule-based; an LLM may
  narrate but must never gate an attempt's status.
- **Grade from real tool calls,** never from an LLM judgment.
- **Precise mitigations.** Prove the patch blocks the exploit _and_ still allows
  a legitimate, properly authorized action (the control case).
