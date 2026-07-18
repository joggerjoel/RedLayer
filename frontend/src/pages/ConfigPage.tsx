import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Config } from "../core/types";
import { api, setMockScenario, type MockScenario } from "../api";

const TARGET = "underwriting_agent";

export function ConfigPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<Config | null>(null);
  const [suites, setSuites] = useState<Set<string>>(new Set());
  const [frameworks, setFrameworks] = useState<Set<string>>(new Set());
  const [scenario, setScenario] = useState<MockScenario>("happy");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getConfig()
      .then((c) => {
        setConfig(c);
        setSuites(new Set(c.suites.map((s) => s.id)));
        setFrameworks(new Set(c.frameworks.map((f) => f.id)));
      })
      .catch(() => setError("Could not load scan options."));
  }, []);

  function toggle(
    set: Set<string>,
    id: string,
    apply: (s: Set<string>) => void,
  ) {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    apply(next);
  }

  async function run() {
    setStarting(true);
    setError(null);
    setMockScenario(scenario);
    try {
      const scan = await api.startScan({
        target: TARGET,
        suites: [...suites],
        frameworks: [...frameworks],
      });
      navigate(`/scans/${scan.id}`);
    } catch {
      setError("Could not start the scan.");
      setStarting(false);
    }
  }

  if (error && !config) return <div className="banner error">{error}</div>;
  if (!config) return <div className="muted">Loading…</div>;

  const canRun = suites.size > 0 && frameworks.size > 0 && !starting;

  return (
    <div>
      <h1 style={{ marginBottom: 6 }}>Configure scan</h1>
      <p className="muted" style={{ marginTop: 0, marginBottom: 24 }}>
        The attacker adapts across chat, documents, email, and tool output. Each
        finding maps to the lending regulation it implicates.
      </p>

      <div className="panel panel-pad" style={{ marginBottom: 20 }}>
        <div className="field-label">Target</div>
        <div className="target-field">
          POST /agents/underwriting/run · {TARGET}
        </div>
      </div>

      <div className="config-grid">
        <div className="panel panel-pad">
          <div className="field-label">Attack suites</div>
          <div className="checks">
            {config.suites.map((s) => (
              <label
                key={s.id}
                className={`check${suites.has(s.id) ? " on" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={suites.has(s.id)}
                  onChange={() => toggle(suites, s.id, setSuites)}
                />
                {s.label}
              </label>
            ))}
          </div>
        </div>

        <div className="panel panel-pad">
          <div className="field-label">Compliance frameworks</div>
          <div className="checks">
            {config.frameworks.map((f) => (
              <label
                key={f.id}
                className={`check${frameworks.has(f.id) ? " on" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={frameworks.has(f.id)}
                  onChange={() => toggle(frameworks, f.id, setFrameworks)}
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="banner error" style={{ marginTop: 16 }}>
          {error}
        </div>
      )}

      <div
        style={{
          marginTop: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <button className="btn primary" onClick={run} disabled={!canRun}>
          {starting ? "Creating scan…" : "Run autonomous scan"}
        </button>
        <div className="scenario">
          demo outcome:
          {(["happy", "failed", "empty"] as MockScenario[]).map((s) => (
            <button
              key={s}
              className={`btn ghost${scenario === s ? " on" : ""}`}
              onClick={() => setScenario(s)}
            >
              {s === "happy"
                ? "vulnerable"
                : s === "failed"
                  ? "scan fails"
                  : "hardened"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
