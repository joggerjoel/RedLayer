import { createApiClient } from "./core/apiClient";
import type { FindingSummary } from "./core/types";

export const api = createApiClient();
export { setMockScenario, type MockScenario } from "./core/apiClient";

export function riskClass(score: number): string {
  return score >= 67 ? "risk-red" : score >= 34 ? "risk-amber" : "risk-green";
}

export function pct(x: number): number {
  return Math.round(x * 100);
}

/** Distinct regulation codes across a findings list, in first-seen order. */
export function distinctRegs(findings: FindingSummary[]): string[] {
  const seen: string[] = [];
  for (const f of findings) {
    for (const r of f.regulations) if (!seen.includes(r)) seen.push(r);
  }
  return seen;
}
