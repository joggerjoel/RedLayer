// Framework-neutral client for the SMB-lending red-teaming API
// (docs/backend-plan.md). Build against mocks first, then flip USE_MOCKS.

import type {
  Config,
  FindingDetail,
  FindingSummary,
  RetestResult,
  Scan,
} from "./types";

export const USE_MOCKS = true; // flip to false when the backend is live

const BASE = USE_MOCKS ? "/mocks" : "http://localhost:8000/api";

// In mock mode there are no dynamic routes, so map each call to a static file.
const MOCK_FILES = {
  config: "config.json",
  scan: "scan_complete.json",
  findings: "findings.json",
  finding: "finding_001.json",
  retest: "retest_blocked.json",
} as const;

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export interface StartScanRequest {
  target: string;
  suites: string[];
  frameworks: string[];
}

export function createApiClient() {
  return {
    getConfig(): Promise<Config> {
      return getJson<Config>(
        USE_MOCKS ? `${BASE}/${MOCK_FILES.config}` : `${BASE}/config`,
      );
    },

    async startScan(req: StartScanRequest): Promise<Scan> {
      if (USE_MOCKS) return getJson<Scan>(`${BASE}/${MOCK_FILES.scan}`);
      const res = await fetch(`${BASE}/scans`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req),
      });
      if (!res.ok) throw new Error(`POST /scans failed: ${res.status}`);
      return res.json() as Promise<Scan>;
    },

    getScan(scanId: string): Promise<Scan> {
      return getJson<Scan>(
        USE_MOCKS ? `${BASE}/${MOCK_FILES.scan}` : `${BASE}/scans/${scanId}`,
      );
    },

    getFindings(scanId: string): Promise<{ findings: FindingSummary[] }> {
      return getJson(
        USE_MOCKS
          ? `${BASE}/${MOCK_FILES.findings}`
          : `${BASE}/scans/${scanId}/findings`,
      );
    },

    getFinding(findingId: string): Promise<FindingDetail> {
      return getJson<FindingDetail>(
        USE_MOCKS
          ? `${BASE}/${MOCK_FILES.finding}`
          : `${BASE}/findings/${findingId}`,
      );
    },

    async retest(findingId: string): Promise<RetestResult> {
      if (USE_MOCKS)
        return getJson<RetestResult>(`${BASE}/${MOCK_FILES.retest}`);
      const res = await fetch(`${BASE}/findings/${findingId}/retest`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`POST retest failed: ${res.status}`);
      return res.json() as Promise<RetestResult>;
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
