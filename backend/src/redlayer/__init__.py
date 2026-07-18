"""RedLayer: a deterministic prompt-injection red-team engine.

The package is split into a domain-agnostic ``core`` engine and pluggable
``verticals``. Each vertical (finance, and future domains) contributes one or
more scenarios that the engine can run without knowing anything about the
domain. See ``docs/architecture.md`` for the module pattern.
"""

__version__ = "0.1.0"
