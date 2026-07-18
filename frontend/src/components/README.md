# Shared UI components

Framework-specific, so intentionally empty until the UI framework is chosen
(Vite+React, Next.js, etc.).

Components render normalized data from the API (see `src/core/types.ts`).
**Status is never conveyed by color alone** — pair every red/green with an icon
and text (docs/frontend-plan.md).

Planned components:

- `ScanConfig` — target field, suite + framework multi-selects, run button
- `MetricCards` — risk score (red/amber/green thresholds), attack success rate,
  findings count, regs implicated
- `FindingsList` — one row per finding: severity indicator, title, badge, chevron
- `FindingDetail` — injected document with highlighted `injection_span`, agent
  response + `trigger_matched`, detected harm, regulation badges (rationale in
  tooltip), remediation
- `RetestControl` — spinner → update status → animate red→green, before/after
- `ProgressBar` — from `progress.completed / progress.total` while scanning
