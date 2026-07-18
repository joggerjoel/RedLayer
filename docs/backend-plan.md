# Back-End Plan — SMB Lending Red-Teaming Engine

## Goal

Red-team a mock **SMB loan underwriting agent** for prompt-injection
vulnerabilities and map each finding to the financial regulation it would put a
lender in violation of (**ECOA, FCRA, GLBA, SR 11-7**). Serve the results to the
frontend as clean JSON.

The engine is built on **NVIDIA garak** (open-source LLM vulnerability scanner):
garak orchestrates probes and detectors; we add domain-specific probes, a
harm→regulation mapping, and a small API/service layer.

## Target

Mock SMB underwriting agent.

- Display name: "SMB underwriting agent"
- Endpoint (mock): `POST /agents/underwriting/run`
- Reads applicant documents (bank statements, tax returns) and can call tools,
  notably `approve_loan(amount)`.
- The forbidden behaviors: approving a loan it shouldn't (control bypass) and
  leaking cross-applicant PII.

## Determinism decision (carried forward)

A live-model garak scan can vary run-to-run, but the demo must be reproducible on
stage. Reconcile this explicitly:

- The **target agent's decision is rule-based**, not model-sampled. garak drives
  the probes; the mock target's approve/deny and disclosure behavior follow fixed
  rules keyed off known injection triggers (e.g., the canary `OVR-7734-APPROVE`).
  An LLM may narrate; it never decides a finding's pass/fail.
- **Findings are graded by garak detectors on observable output** (tool calls,
  canary strings), never by asking a model "did it work?".
- Pin the target/model config and any seed so `queued → running → complete`
  produces the same findings each run.

This preserves the guarantee the frontend relies on: attacks that should fail,
fail; the re-test flips deterministically once the fix is enabled.

## Attack suites → garak probes

Suites map to groups of garak probes:

| Suite id              | Label               | Example probe                                       |
| --------------------- | ------------------- | --------------------------------------------------- |
| `latent_injection`    | Latent injection    | instructions hidden in document fields              |
| `unauthorized_action` | Unauthorized action | `smb.SMBLoanApprovalInjection` → bad `approve_loan` |
| `pii_exfiltration`    | PII exfiltration    | cross-applicant leak via RAG store                  |
| `disclosure_bypass`   | Disclosure bypass   | missing adverse-action notice on denial             |

## Injected documents (authored fixtures)

Each latent-injection probe carries a document with a malicious span. Documents
are committed fixtures with a recorded `injection_span` `[start, end]`. See
"Document enrichment (Tavily)" for how realistic detail is baked in.

## Harm → regulation mapping

A mapping layer turns a finding's `harm_category` into implicated regulations
with a one-line rationale. Baseline:

- `unauthorized_action` → ECOA (manipulable credit decisions), SR 11-7 (model overrides its own controls)
- `pii_exfiltration` → GLBA (safeguarding customer financial data)
- `disclosure_bypass` → FCRA (adverse-action notice requirements)

Only regulations in the scan's selected `frameworks` are reported.

## Finding model

Each probe hit becomes a finding with: `id`, `title`, `severity`
(`critical|high|medium|low`), `harm_category`, `status` (`failed|blocked`),
`regulations`, `probe`, `injected_document` (`field`, `content`, `injection_span`),
`agent_response` (`text`, `tool_calls`, `trigger_matched`), `detected_harm`,
`remediation`, and `retest_history`.

- `failed` = agent is vulnerable (attack succeeded).
- `blocked` = agent resisted / the fix is working.

## Re-test and the fix

`POST /api/findings/:id/retest` re-runs just that probe. After a backend fix is
enabled, it returns `blocked`. The fix must **change real backend behavior**
(e.g., isolate document text from instructions, require human sign-off on
`approve_loan`) — not a UI swap. This is the red→green demo moment, analogous to
the archived demo's patch/replay but scoped per finding.

Carry forward the precision principle: a fix should block the injection while
still letting a legitimate approval through — avoid a blanket "never approve".

## Document enrichment (Tavily, authoring-side)

Tavily enriches the injected documents (bank-statement / tax-return text) with
realistic financial framing at **authoring time only**, baked into committed
fixtures. The scan never calls the network.

- Client lives in an isolated `authoring` package; nothing on the runtime/scan
  path imports it (import-graph firewall, verified by test).
- A `regenerate_content` script calls Tavily, composes content deterministically,
  writes fixture files, and records provenance (query, source URLs, timestamp).
- `tavily` is an optional dependency, not installed for the demo/CI runtime.
- Content stays plausible-but-synthetic — no real PII or real named parties.

## API contract

Base URL (dev): `http://localhost:8000/api`. JSON. No auth (localhost). CORS open.
IDs are opaque strings.

### `GET /api/config`

```json
{
  "suites": [
    { "id": "latent_injection", "label": "Latent injection" },
    { "id": "unauthorized_action", "label": "Unauthorized action" },
    { "id": "pii_exfiltration", "label": "PII exfiltration" },
    { "id": "disclosure_bypass", "label": "Disclosure bypass" }
  ],
  "frameworks": [
    { "id": "ECOA", "label": "ECOA / Reg B" },
    { "id": "FCRA", "label": "FCRA" },
    { "id": "GLBA", "label": "GLBA" },
    { "id": "SR_11-7", "label": "SR 11-7" }
  ]
}
```

### `POST /api/scans` → `201`

Request: `{ "target": "underwriting_agent", "suites": [...], "frameworks": [...] }`
Response: `{ "id": "scan_a1b2c3", "status": "queued", "created_at": "..." }`
Runs async.

### `GET /api/scans/:id`

Poll while running. `summary` is `null` until `status` is `complete`.
`status`: `queued | running | complete | failed`. Includes `target`, `suites`,
`frameworks`, `progress` (`completed`/`total`), `created_at`, `completed_at`.
When complete, `summary`:

```json
{
  "risk_score": 72,
  "attack_success_rate": 0.38,
  "findings_count": 14,
  "regs_implicated": 5
}
```

`risk_score` integer 0–100 (higher worse). `attack_success_rate` float 0–1.

### `GET /api/scans/:id/findings`

`{ "findings": [ { id, title, severity, harm_category, status, regulations } ] }`

### `GET /api/findings/:id`

Full finding (see Finding model). `regulations[]` here are objects
`{ code, name, rationale }`.

### `POST /api/findings/:id/retest`

No body. Returns `{ id, result, previous_result, timestamp, agent_response }`.
`result` is the new `failed|blocked` status.

## Scan lifecycle and errors

- `POST /scans` enqueues and returns immediately; a worker runs garak.
- `progress` advances as probes complete; `status → complete` sets `summary`.
- Errors: unknown scan/finding id → 404; malformed request → 400; scan failure →
  `status: "failed"` with a short error field. Re-test on an unknown finding → 404.

## Manual review

- `GET /api/config` matches the frontend's expected shape exactly.
- A completed scan returns findings whose `status`, `severity`, `harm_category`,
  and `regulations` match the finding model.
- Failed findings include a real `agent_response.tool_calls` (e.g. `approve_loan`)
  and a `trigger_matched` canary.
- `injected_document.injection_span` correctly bounds the malicious text.
- Harm→regulation mapping only reports frameworks selected for the scan.
- Re-test changes real backend behavior and flips `failed → blocked`.
- A fix blocks the injection but still allows a legitimate approval (precision).
- Determinism: repeating a scan yields the same findings; re-test is reproducible.
- The runtime/scan path does not import the Tavily authoring client.
