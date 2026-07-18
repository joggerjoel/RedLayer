# RedLayer — Frontend (Node.js)

The SMB-lending red-teaming dashboard: **configure a scan → watch it run → browse
findings → re-test a finding and watch it flip red→green.** Understandable by
judges in under 90 seconds.

See [`docs/frontend-plan.md`](../docs/frontend-plan.md) and
[`docs/frontend-todo.md`](../docs/frontend-todo.md) for screens, states, and the
build list; the API contract is in [`docs/backend-plan.md`](../docs/backend-plan.md).

## Screens

1. **Config (`/`)** — pick attack suites and compliance frameworks, run a scan.
2. **Dashboard (`/scans/:id`)** — metric cards + findings list, live progress while running.
3. **Finding detail** — injected document (highlighted span), agent response,
   detected harm, regulation badges, remediation, and the **re-test** button.

## Build against mocks first

`src/core/apiClient.ts` has `USE_MOCKS = true`, which reads the static fixtures in
[`mocks/`](mocks/). Build all three screens and the red→green re-test flow before
the backend is live; flip `USE_MOCKS` to `false` to point at
`http://localhost:8000/api`.

## Structure

```
src/core/       types, API client, polling (framework-neutral)
src/components/  shared UI (framework TBD — Vite+React or Next.js)
mocks/          config, scan_running, scan_complete, findings, finding_001, retest_blocked
```

## Not yet scaffolded

The UI framework is unchosen. CI (`.github/workflows/ci.yml`) auto-activates the
frontend job when `frontend/package.json` appears.
