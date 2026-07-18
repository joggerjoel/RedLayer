// Poll a scan until it reaches a terminal state (docs/frontend-plan.md
// "Interaction and state"): poll every ~1.5s; stop on complete/failed.

import type { ApiClient } from "./apiClient";
import type { Scan, ScanStatusState } from "./types";

const TERMINAL_STATES: ReadonlySet<ScanStatusState> = new Set([
  "complete",
  "failed",
]);

export interface PollOptions {
  intervalMs?: number;
  onUpdate: (scan: Scan) => void;
  onError?: (err: unknown) => void;
}

/** Poll until a terminal state. Returns a function that cancels polling. */
export function pollScan(
  api: ApiClient,
  scanId: string,
  { intervalMs = 1500, onUpdate, onError }: PollOptions,
): () => void {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function tick() {
    if (stopped) return;
    try {
      const scan = await api.getScan(scanId);
      if (stopped) return;
      onUpdate(scan);
      if (TERMINAL_STATES.has(scan.status)) return;
    } catch (err) {
      if (!stopped) onError?.(err);
    }
    timer = setTimeout(tick, intervalMs);
  }

  void tick();

  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}
