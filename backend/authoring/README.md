# authoring/ — document enrichment (off the scan path)

This package regenerates the injected-document fixtures with realistic financial
framing. It runs **only at authoring time**, on a developer machine — never
during a scan, and never in CI.

## Isolation guarantees

- Nothing under `app/` imports `authoring` or `tavily`.
  `tests/test_authoring_firewall.py` enforces this (source-level import scan).
- `tavily` is an **optional** dependency, installed only via the `authoring`
  extra. The demo/CI runtime never installs it.
- The API key is read **by env-var name** (`TAVILY_API_KEY`) only. Nothing here
  hardcodes or caches it.

## Usage

```bash
# 1. Rotate the Tavily key first (the old one was exposed in chat/.env).
# 2. Install the optional extra.
pip install '.[authoring]'
# 3. Regenerate fixtures (queries Tavily, scrubs PII, writes authoring/fixtures/).
TAVILY_API_KEY=tvly-... python -m authoring.regenerate_content
```

## PII scrub

`scrub.py` strips SSNs, account numbers, emails, phones, and street addresses
before any fixture is written, and `assert_clean()` raises if disallowed PII
remains. The one allowed exception is the synthetic cross-applicant canary
`5521-9910-7723`. `tests/test_scrub.py` gates this behavior.

> **Note:** wiring `app/plugins/probes.py` to load these generated fixtures from
> disk (instead of the inline strings it uses today) is the follow-up step — the
> probes work as-is, so it was left out of this round to keep the authoring path
> fully isolated.
