"""Shared, domain-agnostic data types.

These mirror the normalized ``AttackAttempt`` model in the plans (docs/) so the
front end and back end agree on one shape across every vertical.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum
from typing import Any


class AttemptStatus(StrEnum):
    PENDING = "pending"
    RUNNING = "running"
    BLOCKED = "blocked"
    SUCCEEDED = "succeeded"
    ERROR = "error"


class ScanState(StrEnum):
    RUNNING = "running"
    VULNERABLE = "vulnerable"
    REPLAYING = "replaying"
    SECURED = "secured"
    ERROR = "error"


PoisonedSourceType = str  # one of: "chat" | "invoice" | "email" | "tool" | "memory"


@dataclass(slots=True)
class PoisonedSource:
    type: PoisonedSourceType
    name: str
    summary: str


@dataclass(slots=True)
class ToolCall:
    name: str
    arguments: dict[str, Any]
    result: Any | None = None


@dataclass(slots=True)
class AttackAttempt:
    id: str
    index: int
    label: str
    technique: str
    payload_summary: str
    poisoned_sources: list[PoisonedSource] = field(default_factory=list)
    tool_calls: list[ToolCall] = field(default_factory=list)
    status: AttemptStatus = AttemptStatus.PENDING
    agent_response: str | None = None
    block_reason: str | None = None


@dataclass(slots=True)
class Evidence:
    """Proof payload emitted when an exploit succeeds."""

    severity: str
    successful_attempt_id: str
    forbidden_outcome: str
    amount_at_risk: int
    exact_tool_call: ToolCall
    attack_chain: list[str]
    remediation: str
    details: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class ScanSummary:
    attempts_executed: int
    blocked: int
    succeeded: int
    errors: int
    amount_at_risk: int
