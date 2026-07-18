// Thin, framework-neutral client for the RedLayer API (docs/*-plan.md "API
// Contract"). Uses fetch so it works under any Node.js UI framework.

import type { ScanStatus } from "./types";

export interface StartScanRequest {
  target_id: string;
  objective_id: string;
  mode?: string;
}

export interface StartScanResponse {
  scan_id: string;
  state: string;
  poll_url: string;
}

export interface ReplayRequest {
  attempt_id: string;
  mitigation_id: string;
}

export function createApiClient(baseUrl = "") {
  async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
  }

  return {
    startScan(req: StartScanRequest) {
      return post<StartScanResponse>("/scan/start", {
        mode: "deterministic-demo",
        ...req,
      });
    },
    async getStatus(scanId: string): Promise<ScanStatus> {
      const res = await fetch(`${baseUrl}/scan/${scanId}/status`);
      if (!res.ok) throw new Error(`GET status failed: ${res.status}`);
      return res.json() as Promise<ScanStatus>;
    },
    replay(scanId: string, req: ReplayRequest) {
      return post<{ scan_id: string; state: string }>(
        `/scan/${scanId}/replay`,
        req,
      );
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
