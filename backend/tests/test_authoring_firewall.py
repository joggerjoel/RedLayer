"""Import-graph firewall: the runtime/scan path must never import the Tavily
authoring client.

Implemented as a source scan (no imports needed) so it runs even without garak
installed, and so a violation is caught structurally rather than only when the
offending line happens to execute.
"""

from __future__ import annotations

import pathlib
import re

APP_DIR = pathlib.Path(__file__).resolve().parent.parent / "app"

FORBIDDEN = re.compile(r"^\s*(?:import|from)\s+(?:tavily|authoring)\b", re.MULTILINE)


def test_scan_path_never_imports_authoring_or_tavily():
    offenders = []
    for path in APP_DIR.rglob("*.py"):
        if FORBIDDEN.search(path.read_text()):
            offenders.append(str(path.relative_to(APP_DIR.parent)))
    assert not offenders, f"scan path imports authoring/tavily: {offenders}"
