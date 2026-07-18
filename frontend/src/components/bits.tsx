import type { FindingStatus, RegulationRef } from "../core/types";

type PillStatus = FindingStatus | "allowed";

export function StatusPill({
  status,
  flip,
}: {
  status: PillStatus;
  flip?: boolean;
}) {
  const label =
    status === "failed"
      ? "Failed"
      : status === "blocked"
        ? "Blocked"
        : "Allowed";
  const ico = status === "failed" ? "✕" : "✓"; // ✕ / ✓
  return (
    <span className={`status ${status}${flip ? " flip" : ""}`}>
      <span className="ico" aria-hidden>
        {ico}
      </span>
      {label}
    </span>
  );
}

export function Sev({ severity }: { severity: string }) {
  return <span className={`badge sev-${severity}`}>{severity}</span>;
}

export function ProgressBar({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const p = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="progress-wrap">
      <div
        className="bar"
        role="progressbar"
        aria-valuenow={p}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <i style={{ width: `${p}%` }} />
      </div>
      <span>
        {completed}/{total} probes
      </span>
    </div>
  );
}

export function RegBadges({ regs }: { regs: RegulationRef[] }) {
  return (
    <div className="reg-badges">
      {regs.map((r) => (
        <span className="reg" key={r.code} title={r.rationale}>
          {r.code}
        </span>
      ))}
    </div>
  );
}

/** Injected document with the malicious span highlighted + a boundary marker. */
export function InjectedDoc({
  content,
  span,
}: {
  content: string;
  span: [number, number];
}) {
  const [start, end] = span;
  const safe = start >= 0 && end <= content.length && start < end;
  if (!safe) return <div className="doc">{content}</div>;
  return (
    <div className="doc">
      {content.slice(0, start)}
      <span className="inj-tag" aria-hidden>
        {"⚠ "}
      </span>
      <mark className="inj">{content.slice(start, end)}</mark>
      {content.slice(end)}
    </div>
  );
}
