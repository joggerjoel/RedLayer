# Backend review — plan-vs-build gaps, now closed

Council review of `backend/app` (garak-based SMB-loan red-team engine) against
`backend-plan.md` / `backend-todo.md`. The teammate's build had a solid API +
probe/detector layer but missed the items below. This branch (`fix/backend-review`)
closes them.

## Fixed on this branch

### Credibility core (the demo's two load-bearing claims)

- **Deterministic target** (plan §Determinism; todo L3, L66). `target/agent.py`
  was an unseeded live LLM that _decided_ approve/deny — so "deterministic,
  reproducible" was false. Rewrote it as a **rule-based decision** keyed off the
  genuine financial fields + known injection triggers. The live Together LLM now
  only writes the (non-graded) rationale prose, at `temperature=0`, and only when
  `NARRATE=1`. Findings reproduce byte-for-byte (`tests/test_harness.py::
test_scan_is_reproducible`).
- **A real fix to retest** (plan §Re-test; todo L41–43). The target now has a
  `defense_enabled` flag implementing **document/instruction isolation**: when on,
  injected claims/instructions no longer steer the decision. `retest_finding`
  runs the **patched** target, so a finding flips `failed → blocked` on a real
  behavior change — not a pre-set boolean. Honest proof: run a full scan with
  `DEFENSE_ENABLED=1` and the _same_ probes come back clean
  (`test_harness.py::test_defended_scan_finds_nothing`).
- **Precision control case** (plan §Re-test; todo L44, L97). `control_case` is
  implemented: retest also runs a legitimate, authorized application through the
  patched target and returns `allowed`, proving the fix isn't a blanket block.

### Correctness / fidelity

- **Genuine cross-applicant PII leak** (plan §Target; todo L96). The leaked
  account number now lives in a **separate applicant record** (`agent.APPLICANT_DB`),
  not in the attacker's injected text; the injection only references the guarantor
  by name. `PIILeakDetector` grades on that **specific canary** (`5521-9910-7723`),
  not a generic account regex — so an unrelated number can't false-positive.
- **harm→regulation mapping** (plan §Mapping; todo L99). `disclosure_bypass` now
  implicates **both FCRA and ECOA/Reg B** (adverse-action notices are required
  under both), per the plan.
- **Metric formula unified** (plan §Metrics; todo L98). `risk_score` is now the
  plan's severity-weighted share of the suite, normalized 0–100
  (`critical=4…low=1`), and **one formula** feeds both the scan summary and the
  retest recompute (they previously disagreed).

### Scaffolding

- **Tests** (todo L102). Added `backend/tests/` — the dir `pyproject.toml`
  already pointed at but which didn't exist (CI was false-green). Rule-engine,
  detector, compliance, scan/retest lifecycle, determinism, and import-firewall
  tests. Pure-logic tests run without garak; garak-dependent ones skip cleanly if
  it isn't installed.
- **Tavily authoring package** (plan §Document enrichment; todo L72–77). Isolated
  `backend/authoring/` (tavily client, PII scrub, `regenerate_content` script,
  README), `tavily` as an **optional extra**, and an import-graph firewall test
  asserting the scan path never imports it. Fully off the runtime path.
- **Earlier fixes retained**: `requirements.txt` corrected (torch pinned, garak
  pinned, anthropic dropped); `run_scan` init moved inside `try` (no more hang in
  `queued`); `retest_finding` wrapped in `try/except`.

## Still open — your call

1. **`POST /api/scans` is open + billed.** No auth, open CORS, each scan can fire
   real (Together) LLM calls if `NARRATE=1`. Fine on localhost; rate-limit/auth it
   before it's exposed. (Out of scope for the plan-vs-build gaps — pre-existing.)
2. **Wire probes → generated fixtures.** `probes.py` still uses inline document
   strings; `authoring/regenerate_content.py` writes fixtures to disk but nothing
   consumes them yet. Left out to keep the authoring path isolated this round.
3. **Rotate the Tavily key.** The dev key was exposed in chat and sits in
   `backend/.env`. Rotate it; the authoring client reads it by env-var name only.

## To verify locally

```bash
cd backend
# garak-free tests run anywhere:
python -m pytest tests/ -q
# full suite (needs the .venv with garak+torch):
DEFENSE_ENABLED=0 python -m pytest tests/ -q
```
