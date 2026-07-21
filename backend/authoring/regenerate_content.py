"""Regenerate document fixtures with realistic financial framing (authoring only).

Run on a developer machine after rotating the Tavily key:

    TAVILY_API_KEY=... python -m authoring.regenerate_content

For each fixture spec it queries Tavily for realistic framing, composes the
document deterministically, **scrubs PII, asserts the result is clean**, then
writes the fixture and a provenance record (query + source URLs). The scan path
never runs this and never imports it.
"""

from __future__ import annotations

import json
import pathlib
from datetime import UTC, datetime

from authoring import scrub, tavily_client

OUT_DIR = pathlib.Path(__file__).resolve().parent / "fixtures"

# Each spec composes a synthetic document; Tavily only supplies realistic
# framing phrases, never identities. Keep applicant names on the scrub allowlist.
FIXTURE_SPECS = [
    {
        "name": "northwind_bank_statement",
        "query": "small business checking account statement format terminology",
        "template": (
            "APPLICANT: Northwind Trading LLC\n"
            "Business type: Commercial equipment leasing, 6 years in operation\n"
            "Requested amount: $40,000\n"
            "--- Uploaded bank statement (checking, last 90 days) ---\n"
            "Closing balance: $9,800.00\n"
            "{framing}\n"
            "--- End statement ---\n"
        ),
    },
    {
        "name": "fenwick_tax_return",
        "query": "small business tax return net operating loss line items",
        "template": (
            "APPLICANT: Fenwick Hardware Supply\n"
            "Requested amount: $120,000\n"
            "--- Uploaded tax return ---\n"
            "Net income: -$8,400 (loss)\n"
            "{framing}\n"
            "--- End tax return ---\n"
        ),
    },
]


def _framing(results: list[dict]) -> str:
    """Compose a short, scrubbed framing line from search snippets."""
    snippets = " ".join(r.get("content", "") for r in results)[:400]
    return scrub.scrub(snippets).strip() or "Statement reviewed; figures as shown."


def regenerate(out_dir: pathlib.Path = OUT_DIR) -> list[pathlib.Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    written: list[pathlib.Path] = []
    provenance = {"generated_at": datetime.now(UTC).isoformat(), "fixtures": []}

    for spec in FIXTURE_SPECS:
        results = tavily_client.search(spec["query"], max_results=3)
        content = spec["template"].format(framing=_framing(results))
        content = scrub.scrub(content)
        scrub.assert_clean(content)  # never write PII to a committed fixture

        path = out_dir / f"{spec['name']}.txt"
        path.write_text(content)
        written.append(path)
        provenance["fixtures"].append(
            {
                "name": spec["name"],
                "query": spec["query"],
                "sources": [r.get("url") for r in results],
            }
        )

    (out_dir / "provenance.json").write_text(json.dumps(provenance, indent=2))
    return written


if __name__ == "__main__":  # pragma: no cover
    paths = regenerate()
    print(f"wrote {len(paths)} fixtures + provenance to {OUT_DIR}")
