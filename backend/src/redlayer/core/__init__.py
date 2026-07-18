"""Domain-agnostic red-team engine.

Nothing in ``core`` may import from ``redlayer.verticals``. The engine operates
purely against the contracts in :mod:`redlayer.verticals.base` and the shared
types in :mod:`redlayer.core.models`. This keeps verticals pluggable.
"""
