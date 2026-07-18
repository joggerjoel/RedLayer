// Frontend vertical registry. Add a new domain by importing its config and
// listing it here — the UI iterates the registry, never hard-coding a vertical.

import type { ScenarioConfig, VerticalConfig } from "./types";
import { financeVertical } from "./finance/config";

export const VERTICALS: VerticalConfig[] = [
  financeVertical,
  // healthcareVertical,
  // legalVertical,
];

export function findScenario(
  targetId: string,
  objectiveId: string,
): ScenarioConfig | undefined {
  for (const vertical of VERTICALS) {
    const match = vertical.scenarios.find(
      (s) => s.targetId === targetId && s.objectiveId === objectiveId,
    );
    if (match) return match;
  }
  return undefined;
}
