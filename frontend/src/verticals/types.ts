// The frontend vertical contract. A vertical module supplies the display
// metadata and copy for its scenario(s). The UI reads scan data generically
// from the API; a vertical only customizes labels and framing — never the
// per-attempt rendering, which stays shared (docs/frontend-plan.md).

export interface ScenarioConfig {
  /** Must match the backend scenario ids used in the API request. */
  targetId: string;
  objectiveId: string;
  /** Display copy. */
  targetLabel: string;
  forbiddenOutcome: string;
  amountAtRisk: number;
  /** One-line framing shown on the start screen. */
  startBlurb: string;
  /** Ordered attack-chain node captions for the finding view. */
  attackChain: string[];
}

export interface VerticalConfig {
  id: string;
  name: string;
  scenarios: ScenarioConfig[];
}
