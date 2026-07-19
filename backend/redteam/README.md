# Live scan — Phase 1 (IVR)

Point [garak](https://github.com/NVIDIA/garak) at your **own** IVR agent and collect
a report of which prompt-injection / jailbreak attacks actually break it. Defensive
self-red-teaming: find them before anyone else does.

## Target

`POST /voice/sim/turn` on the IVR (`realtime-ivr`) — a text in / text out endpoint
that runs the **same system prompt + LLM as a live call**, with **no auth and no
side effects** (plain chat). The username/password gate is only on the dashboard UI,
not on this endpoint, so no login is involved.

- Inject into: `message`
- Read result from: `reply`

## Run it (on the Mac Studio)

1. Confirm the IVR is running locally: `curl -s localhost:8080/... ` (any known route).
2. Edit `ivr-sim-turn.json` → set `campaign_id` to a **real test campaign**.
3. `./run-scan.sh` → writes `ivr-scan.report.jsonl`.

Override probes: `PROBES="promptinject" ./run-scan.sh`. List all: `uvx garak --list_probes`.

## Safety

- `/voice/sim/turn` is side-effect-free — safe to hammer.
- Stay on **localhost**, not `ivr.sohyper.com`, so probe traffic never hits prod.
- Do **not** target `/voice/sim/call` until SMS + the outbound dialer are in a
  sandbox/dry-run — that path can exercise real action sinks (rx-text SMS,
  caller-profile writes).

## What you get

`ivr-scan.report.jsonl` — one line per probe attempt: the payload, the agent's
`reply`, and the detector verdict (broke a rule or not). That's your attack library.

## Next phases

- **Phase 2** — custom probes/detectors matched to _your_ prompt rules (impersonation,
  fabricated order#/price, "I've sent/booked" claims, spoken URLs), plus a harm map.
- **Phase 3** — the Flask backend converts `report.jsonl` into the findings the
  RedLayer UI already renders, with the red→green retest per finding.
