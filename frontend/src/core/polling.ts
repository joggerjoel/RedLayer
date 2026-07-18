// Polling helper (docs/frontend-plan.md "Polling Decision"): poll status every
// 750-1000ms; stop on a terminal state. Framework-neutral — wrap it in a
// hook/store once the UI framework is chosen.

import type { ApiClient } from "./apiClient";
import type { ScanState, ScanStatus } from "./types";

const TERMINAL_STATES: ReadonlySet<ScanState> = new Set([
  "vulnerable",
  "secured",
  "error",
]);

export interface PollOptions {
  intervalMs?: number;
  onUpdate: (status: ScanStatus) => void;
  onError?: (err: unknown) => void;
}

/** Poll until a terminal state. Returns a function that cancels polling. */
export function pollScan(
  api: ApiClient,
  scanId: string,
  { intervalMs = 850, onUpdate, onError }: PollOptions,
): () => void {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function tick() {
    if (stopped) return;
    try {
      const status = await api.getStatus(scanId);
      if (stopped) return;
      onUpdate(status);
      if (TERMINAL_STATES.has(status.state)) return;
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
