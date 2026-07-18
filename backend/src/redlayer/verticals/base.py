"""The vertical plug-in contract.

A **vertical** is a domain being red-teamed (finance now; healthcare, legal,
HR, support, etc. later). A vertical exposes one or more **scenarios**. A
scenario pairs a target agent with an objective and supplies everything the
engine needs to run the demo: the attack sequence, the deterministic grader,
and the mitigation used on replay.

The engine depends only on these abstract base classes — never on a concrete
vertical — so new domains plug in without touching ``core``.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Sequence

from redlayer.core.models import AttackAttempt, Evidence, ToolCall


class Scenario(ABC):
    """One target + objective within a vertical.

    Implementations own the domain logic. The engine calls these methods
    generically. Grading MUST be deterministic and MUST inspect real tool-call
    logs — never ask an LLM whether the exploit worked.
    """

    #: Stable id of the mock target, e.g. ``"accounts-payable-agent"``.
    target_id: str
    #: Stable id of the forbidden objective, e.g. ``"unauthorized-beneficiary-change"``.
    objective_id: str
    #: One-line human description of the forbidden outcome.
    forbidden_outcome: str

    @abstractmethod
    def build_attempts(self) -> list[AttackAttempt]:
        """Return the ordered attack attempts (including any control case)."""

    @abstractmethod
    def grade(self, tool_calls: Sequence[ToolCall]) -> bool:
        """Return ``True`` iff the observed tool calls meet the forbidden outcome."""

    @abstractmethod
    def build_evidence(self, attempt: AttackAttempt) -> Evidence:
        """Build the proof payload for a successful attempt."""

    @abstractmethod
    def apply_mitigation(self, mitigation_id: str) -> None:
        """Enable a mitigation for the replay phase (mutates scenario state)."""


class RedTeamVertical(ABC):
    """A domain package that contributes scenarios to the engine."""

    #: Stable id, e.g. ``"finance"``.
    id: str
    #: Human-readable name, e.g. ``"Finance"``.
    name: str

    @abstractmethod
    def scenarios(self) -> Sequence[Scenario]:
        """Return every scenario this vertical provides."""
