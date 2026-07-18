# RedLayer — Frontend (Vite + React + TypeScript)

The SMB-lending red-teaming dashboard: **configure a scan → watch it run → browse
findings → re-test a finding and watch it flip red→green.**

See [`docs/frontend-plan.md`](../docs/frontend-plan.md) for screens/behavior and
[`docs/backend-plan.md`](../docs/backend-plan.md) for the API contract.

## Run it

```bash
bun install
bun run dev      # http://localhost:5173
```

Runs fully against the static fixtures in [`mocks/`](mocks/) (`USE_MOCKS = true`
in `src/core/apiClient.ts`). A Vite dev plugin serves `mocks/` at `/mocks/*` — no
copy step. Flip `USE_MOCKS` to `false` to point at a live backend on
`http://localhost:8000/api`.

Other scripts: `bun run build` (typecheck + production build), `bun run preview`,
`bun run typecheck`.

## Structure

```
src/
  main.tsx, App.tsx        entry + client-side routing
  api.ts                   API singleton + helpers (riskClass, distinctRegs)
  core/                    framework-neutral: types, apiClient (+ setMockScenario), polling
  pages/
    ConfigPage.tsx         scan config + demo-scenario switcher (vulnerable/fails/hardened)
    DashboardPage.tsx      poll, metric cards, findings, failed/empty states
  components/
    MetricCards.tsx        risk hero card + reg chips
    Findings.tsx           list + expand-in-place detail + retest red→green
    bits.tsx               StatusPill (icon+text), Sev, ProgressBar, RegBadges, InjectedDoc
  styles.css               design tokens + components
mocks/                     11 fixtures (served at /mocks in dev)
```

## Demo scenarios

The config screen has a "demo outcome" switcher (backed by `setMockScenario`):
**vulnerable** (findings + retest flow), **scan fails** (error state), **hardened**
(zero-findings "target hardened" state).
