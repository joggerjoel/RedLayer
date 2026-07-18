"""Application entry point.

TODO: choose a framework and build the app here. Wiring should be:

    from redlayer.verticals import load_verticals
    load_verticals()                     # register verticals at startup
    # then mount routes that resolve scenarios via redlayer.core.registry
    # and drive them with redlayer.core.scanner.

Kept import-light so the package builds and tests run before the web framework
is added.
"""

from __future__ import annotations


def create_app() -> object:
    raise NotImplementedError("Pick a web framework, then implement create_app().")
