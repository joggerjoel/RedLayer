import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { FindingSummary, Scan, ScanSummary } from "../core/types";
import { api, distinctRegs } from "../api";
import { pollScan } from "../core/polling";
import { ProgressBar } from "../components/bits";
import { MetricCards } from "../components/MetricCards";
import { FindingsList } from "../components/Findings";

export function DashboardPage() {
  const { id = "" } = useParams();
  const [scan, setScan] = useState<Scan | null>(null);
  const [findings, setFindings] = useState<FindingSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setScan(null);
    setFindings(null);
    setError(null);
    const cancel = pollScan(api, id, {
      onUpdate: setScan,
      onError: () => setError("Lost connection to the scan."),
    });
    return cancel;
  }, [id]);

  useEffect(() => {
    if (scan?.status === "complete" && findings === null) {
      api
        .getFindings(id)
        .then((r) => setFindings(r.findings))
        .catch(() => setFindings([]));
    }
  }, [scan?.status, findings, id]);

  function onRetestSummary(s: ScanSummary) {
    setScan((prev) => (prev ? { ...prev, summary: s } : prev));
  }

  if (error) {
    return (
      <div>
        <div className="banner error">{error}</div>
        <RetryLink />
      </div>
    );
  }

  if (!scan) return <div className="muted">Starting scan…</div>;

  const running = scan.status === "queued" || scan.status === "running";

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <h1>{scan.target.name}</h1>
        <span className="muted" style={{ fontSize: 13 }}>
          {scan.suites.length} suites · {scan.frameworks.length} frameworks
        </span>
      </div>

      {running && (
        <div className="panel panel-pad" style={{ marginBottom: 20 }}>
          <div className="field-label">Scanning…</div>
          <ProgressBar
            completed={scan.progress.completed}
            total={scan.progress.total}
          />
        </div>
      )}

      {scan.status === "failed" && (
        <>
          <div className="banner error">
            ✕ {scan.error ?? "The scan failed."}
          </div>
          <RetryLink />
        </>
      )}

      {scan.status === "complete" && (
        <>
          {scan.summary && (
            <MetricCards
              summary={scan.summary}
              regs={distinctRegs(findings ?? [])}
            />
          )}

          <div className="section-title">Findings</div>
          {findings === null && <div className="muted">Loading findings…</div>}
          {findings !== null && findings.length === 0 && (
            <div className="panel empty-state">
              <div className="big" aria-hidden>
                ✓
              </div>
              <div style={{ color: "var(--green)", fontWeight: 650 }}>
                Target hardened
              </div>
              <div>
                No findings — every attack in the selected suites was blocked.
              </div>
            </div>
          )}
          {findings && findings.length > 0 && (
            <FindingsList
              findings={findings}
              onRetestSummary={onRetestSummary}
            />
          )}
        </>
      )}
    </div>
  );
}

function RetryLink() {
  return (
    <div style={{ marginTop: 16 }}>
      <Link className="btn" to="/">
        ← New scan
      </Link>
    </div>
  );
}
