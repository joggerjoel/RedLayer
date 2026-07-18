import type { ScanSummary } from "../core/types";
import { pct, riskClass } from "../api";

export function MetricCards({
  summary,
  regs,
}: {
  summary: ScanSummary;
  regs: string[];
}) {
  return (
    <div className="metrics">
      <div className="panel metric hero">
        <div className="k">Risk score</div>
        <div className={`v ${riskClass(summary.risk_score)}`}>
          {summary.risk_score}
        </div>
      </div>
      <div className="panel metric">
        <div className="k">Attack success</div>
        <div className="v">{pct(summary.attack_success_rate)}%</div>
      </div>
      <div className="panel metric">
        <div className="k">Findings</div>
        <div className="v">{summary.findings_count}</div>
      </div>
      <div className="panel metric">
        <div className="k">Regs implicated</div>
        <div className="v" style={{ fontSize: 30 }}>
          {summary.regs_implicated}
        </div>
        <div className="chips">
          {regs.length ? (
            regs.map((r) => (
              <span className="chip" key={r}>
                {r}
              </span>
            ))
          ) : (
            <span className="chip">none</span>
          )}
        </div>
      </div>
    </div>
  );
}
