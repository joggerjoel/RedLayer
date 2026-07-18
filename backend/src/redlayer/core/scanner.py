"""Scan orchestration (domain-agnostic).

Holds the in-memory scan store and drives a scenario's attempts to completion,
grading each from real tool-call logs. This is the skeleton; the execution loop
is implemented against the plans in docs/backend-plan.md ("Polling Architecture"
and "Success Grader").
"""

from __future__ import annotations

from dataclasses import dataclass, field

from redlayer.core.models import AttackAttempt, Evidence, ScanState, ScanSummary
from redlayer.verticals.base import Scenario


@dataclass(slots=True)
class Scan:
    id: str
    scenario: Scenario
    state: ScanState = ScanState.RUNNING
    current_attempt_index: int = 0
    attempts: list[AttackAttempt] = field(default_factory=list)
    summary: ScanSummary | None = None
    evidence: Evidence | None = None
    error: str | None = None


class ScanStore:
    """In-memory store of active scans. One run at a time (see Open Decisions)."""

    def __init__(self) -> None:
        self._scans: dict[str, Scan] = {}

    def create(self, scan_id: str, scenario: Scenario) -> Scan:
        scan = Scan(id=scan_id, scenario=scenario, attempts=scenario.build_attempts())
        self._scans[scan_id] = scan
        return scan

    def get(self, scan_id: str) -> Scan | None:
        return self._scans.get(scan_id)


def run_scan(scan: Scan) -> None:
    """Execute each attempt, grade it, and finalize state.

    TODO: implement per docs/backend-plan.md —
      - mark attempt running, invoke the target, capture tool calls
      - grade with ``scan.scenario.grade(tool_calls)``
      - set blocked/succeeded/error, build summary and evidence
      - keep total scan + replay under 90s
    """
    raise NotImplementedError


def run_replay(scan: Scan, attempt_id: str, mitigation_id: str) -> None:
    """Enable the mitigation, replay the malicious attempt and the control case.

    TODO: implement per docs/backend-plan.md ("Patch Mechanism", replay payload).
    """
    raise NotImplementedError
