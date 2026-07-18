"""Vertical registration.

Importing this package and calling :func:`load_verticals` registers every
built-in vertical with the core registry. Add a new domain by creating a
sibling package and appending it here.
"""

from __future__ import annotations

from redlayer.core import registry


def load_verticals() -> None:
    """Register all built-in verticals. Idempotent-safe via registry guards."""
    from redlayer.verticals.finance import build_vertical as build_finance

    registry.register(build_finance())
    # New verticals plug in here, e.g.:
    # from redlayer.verticals.healthcare import build_vertical as build_healthcare
    # registry.register(build_healthcare())
