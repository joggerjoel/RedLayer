# Shared UI components

Framework-specific, so intentionally empty until the UI framework is chosen
(Vite+React, Next.js, etc.).

These components are **vertical-agnostic** — they render normalized scan data
from the API and take copy from the active vertical config
(`src/verticals/`). Do not create per-attack or per-vertical component variants
(docs/frontend-plan.md).

Planned components:

- `StartScreen` — target, forbidden outcome, amount at risk, start button
- `AttemptList` — status via icon **and** text, not color alone
- `AttemptDetail` — one shared panel for every attempt type
- `RunSummary` — attempts executed / blocked / succeeded / amount at risk
- `VulnerabilityCard` — evidence and the exact tool call
- `AttackChain` — ordered nodes with simple arrows
- `PatchReplay` — before/after plus the **Patch Precision** panel
  (malicious blocked vs. legitimate allowed)
