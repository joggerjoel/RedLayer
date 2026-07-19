#!/usr/bin/env bash
# Phase 1 live scan: point garak at the IVR's text sim endpoint and collect a
# report of what breaks. Run this ON the Mac Studio, where the IVR is reachable
# on localhost:8080.
#
# SAFETY:
#   - Uses /voice/sim/turn only — pure text in/out, no SMS/dialer/CRM side effects.
#   - Targets localhost, not the public host, so probe traffic never touches prod.
#   - Do NOT point this at /voice/sim/call until SMS + dialer are sandboxed.
#
# Prereqs: uv (https://docs.astral.sh/uv/). Edit ivr-sim-turn.json first and set
# a real test campaign_id.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
CONFIG="$HERE/ivr-sim-turn.json"

# Small, relevant starter set. Override with: PROBES="promptinject" ./run-scan.sh
PROBES="${PROBES:-promptinject,dan.Dan_11_0,latentinjection}"

if grep -q REPLACE_ME_TEST_CAMPAIGN "$CONFIG"; then
  echo "ERROR: set a real test campaign_id in $CONFIG first." >&2
  exit 1
fi

echo "Scanning IVR /voice/sim/turn with probes: $PROBES"
uvx garak \
  --model_type rest \
  --generator_option_file "$CONFIG" \
  --probes "$PROBES" \
  --report_prefix "$HERE/ivr-scan"

echo "Done. Report: $HERE/ivr-scan.report.jsonl"
