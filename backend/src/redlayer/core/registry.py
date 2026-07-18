"""Runtime registry mapping ids to verticals and scenarios.

Verticals register themselves at import time (see
``redlayer.verticals.load_verticals``). The engine and API resolve a
``target_id`` + ``objective_id`` to a concrete scenario through here, staying
ignorant of which vertical owns it.
"""

from __future__ import annotations

from redlayer.verticals.base import RedTeamVertical, Scenario

_VERTICALS: dict[str, RedTeamVertical] = {}


def register(vertical: RedTeamVertical) -> None:
    """Register a vertical. Raises on duplicate id to catch wiring mistakes."""
    if vertical.id in _VERTICALS:
        raise ValueError(f"Vertical id already registered: {vertical.id!r}")
    _VERTICALS[vertical.id] = vertical


def all_verticals() -> list[RedTeamVertical]:
    return list(_VERTICALS.values())


def get_vertical(vertical_id: str) -> RedTeamVertical | None:
    return _VERTICALS.get(vertical_id)


def find_scenario(target_id: str, objective_id: str) -> Scenario | None:
    """Resolve a scenario across all verticals by target + objective."""
    for vertical in _VERTICALS.values():
        for scenario in vertical.scenarios():
            if scenario.target_id == target_id and scenario.objective_id == objective_id:
                return scenario
    return None


def clear() -> None:
    """Reset the registry (test helper)."""
    _VERTICALS.clear()
