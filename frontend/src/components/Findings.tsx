import { useState, type ReactNode } from "react";
import type {
  FindingDetail,
  FindingStatus,
  FindingSummary,
  RetestResult,
  ScanSummary,
} from "../core/types";
import { api } from "../api";
import { InjectedDoc, RegBadges, Sev, StatusPill } from "./bits";

export function FindingsList({
  findings,
  onRetestSummary,
}: {
  findings: FindingSummary[];
  onRetestSummary: (s: ScanSummary) => void;
}) {
  return (
    <div className="panel findings">
      {findings.map((f) => (
        <FindingItem key={f.id} summary={f} onRetestSummary={onRetestSummary} />
      ))}
    </div>
  );
}

function FindingItem({
  summary,
  onRetestSummary,
}: {
  summary: FindingSummary;
  onRetestSummary: (s: ScanSummary) => void;
}) {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<FindingDetail | null>(null);
  const [status, setStatus] = useState<FindingStatus>(summary.status);
  const [retest, setRetest] = useState<RetestResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !detail) {
      try {
        setDetail(await api.getFinding(summary.id));
      } catch {
        setErr("Could not load finding detail.");
      }
    }
  }

  async function runRetest() {
    setBusy(true);
    setErr(null);
    try {
      const r = await api.retest(summary.id);
      setRetest(r);
      setStatus(r.result);
      if (r.summary) onRetestSummary(r.summary);
    } catch {
      setErr("Re-test failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`finding-item${open ? " open-parent" : ""}`}>
      <div className={`finding-row${open ? " open" : ""}`} onClick={toggle}>
        <span className={`sev-dot sev-${summary.severity}`} />
        <span className="title">{summary.title}</span>
        <Sev severity={summary.severity} />
        <StatusPill status={status} flip={!!retest} />
        <span className="chevron" aria-hidden>
          ›
        </span>
      </div>

      {open && (
        <div className="detail">
          <div className="detail-pad">
            {err && <div className="banner error">{err}</div>}
            {!detail && !err && <div className="muted">Loading detail…</div>}
            {detail && (
              <>
                <Section title="The attack — injected document">
                  <div
                    className="muted"
                    style={{ marginBottom: 6, fontSize: 12 }}
                  >
                    {detail.injected_document.field}
                  </div>
                  <InjectedDoc
                    content={detail.injected_document.content}
                    span={detail.injected_document.injection_span}
                  />
                </Section>

                <Section title="What the agent did">
                  {retest ? (
                    <>
                      <div className="agent was">
                        {detail.agent_response.text}
                      </div>
                      <div className="agent" style={{ marginTop: 8 }}>
                        {retest.agent_response.text}
                      </div>
                    </>
                  ) : (
                    <div className="agent">{detail.agent_response.text}</div>
                  )}
                  <div style={{ marginTop: 8, fontSize: 12 }} className="muted">
                    canary:{" "}
                    {retest ? (
                      <>
                        <span className="canary">
                          {detail.agent_response.trigger_matched}
                        </span>{" "}
                        → <span className="muted">null</span>
                      </>
                    ) : detail.agent_response.trigger_matched ? (
                      <span className="canary">
                        {detail.agent_response.trigger_matched}
                      </span>
                    ) : (
                      "none"
                    )}
                  </div>
                </Section>

                <Section title="The harm">
                  <div className="harm" style={{ marginBottom: 10 }}>
                    {detail.detected_harm}
                  </div>
                  <RegBadges regs={detail.regulations} />
                </Section>

                <Section title="The fix — remediation">
                  <div className="remediation">{detail.remediation}</div>
                </Section>

                <Section title="Re-test">
                  <div className="retest-row">
                    <button
                      className="btn primary"
                      onClick={runRetest}
                      disabled={busy}
                    >
                      {busy ? "Re-testing…" : "Apply fix & re-test"}
                    </button>
                    {retest && (
                      <span className="muted" style={{ fontSize: 13 }}>
                        <StatusPill status={retest.previous_result} /> →{" "}
                        <StatusPill status={retest.result} flip />
                      </span>
                    )}
                  </div>
                  {retest && (
                    <div className="precision">
                      <div className="line">
                        <StatusPill status="blocked" />
                        <span className="what">
                          Malicious injection is now blocked.
                        </span>
                      </div>
                      {retest.control_case && (
                        <div className="line">
                          <StatusPill status="allowed" />
                          <span className="what">
                            {retest.control_case.label} —{" "}
                            {retest.control_case.note}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </Section>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="detail-section">
      <div className="h">{title}</div>
      {children}
    </div>
  );
}
