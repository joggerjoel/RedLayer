// Domain-agnostic types mirroring the backend's normalized model
// (backend/src/redlayer/core/models.py and docs/*-plan.md). These are shared by
// every vertical so the UI renders any scan without vertical-specific branches.

export type AttemptStatus =
  "pending" | "running" | "blocked" | "succeeded" | "error";

export type ScanState =
  "running" | "vulnerable" | "replaying" | "secured" | "error";

export type PoisonedSourceType =
  "chat" | "invoice" | "email" | "tool" | "memory";

export interface PoisonedSource {
  type: PoisonedSourceType;
  name: string;
  summary: string;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface AttackAttempt {
  id: string;
  index: number;
  label: string;
  technique: string;
  payload_summary: string;
  poisoned_sources: PoisonedSource[];
  agent_response?: string;
  tool_calls: ToolCall[];
  status: AttemptStatus;
  block_reason?: string;
}

export interface ScanSummary {
  attempts_executed: number;
  blocked: number;
  succeeded: number;
  errors: number;
  amount_at_risk: number;
}

export interface ScanStatus {
  scan_id: string;
  state: ScanState;
  current_attempt_index: number;
  attempts: AttackAttempt[];
  summary: ScanSummary | null;
  evidence: unknown | null;
  replay: unknown | null;
  error: string | null;
}
