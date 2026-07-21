"""Authoring-time tooling (document enrichment).

This package is **off the scan/runtime path** by construction: nothing under
``app/`` imports it, and a test (``tests/test_authoring_firewall.py``) enforces
that. It exists only to regenerate the committed document fixtures with
realistic financial framing, at authoring time, on a developer's machine.

The Tavily client here is an *optional* dependency (``pip install '.[authoring]'``)
and is never installed for the demo/CI runtime.
"""
