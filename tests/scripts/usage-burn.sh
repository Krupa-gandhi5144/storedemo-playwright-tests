#!/usr/bin/env bash
# Burn N billable executions without overflowing Kafka's max message size.
#
# Instant cases finish so fast that one Playwright process with thousands of
# tests floods the reporter buffer; a failed flush re-queues + grows until
# produce returns MESSAGE_TOO_LARGE. HTTP fallback then hits Docker DNS
# (`ingestion-service`) from the host and fails with ENOTFOUND.
#
# Fix: run many small Playwright processes (default 200 cases each).
#
#   QUOTA_BURN_COUNT=20 npm run test:quota-burn
#   QUOTA_BURN_COUNT=5000 npm run test:quota-burn
#   QUOTA_BURN_COUNT=5000 QUOTA_BURN_CHUNK=150 npm run test:quota-burn
#
# Prefer lowering the project's executions limit over burning free-tier 5k.
set -euo pipefail

cd "$(dirname "$0")/../.."

if [ -z "${QUOTA_BURN_COUNT:-}" ]; then
  echo "Set QUOTA_BURN_COUNT (total billable executions to burn)." >&2
  echo "Example: QUOTA_BURN_COUNT=20 npm run test:quota-burn" >&2
  exit 1
fi

TOTAL="$QUOTA_BURN_COUNT"
if ! [[ "$TOTAL" =~ ^[1-9][0-9]*$ ]]; then
  echo "QUOTA_BURN_COUNT must be a positive integer (got: $TOTAL)" >&2
  exit 1
fi

# Hard ceiling matches free-tier executions seed; raise only if you know why.
MAX_TOTAL=5000
if [ "$TOTAL" -gt "$MAX_TOTAL" ]; then
  echo "QUOTA_BURN_COUNT capped at $MAX_TOTAL (requested $TOTAL)" >&2
  TOTAL=$MAX_TOTAL
fi

# Per-run cap must stay under reporter buffer pressure (~500 events / ~1MB).
# 200 leaves headroom for run:begin/end + annotations.
CHUNK="${QUOTA_BURN_CHUNK:-200}"
if ! [[ "$CHUNK" =~ ^[1-9][0-9]*$ ]] || [ "$CHUNK" -gt 250 ]; then
  echo "QUOTA_BURN_CHUNK must be 1–250 (got: $CHUNK)" >&2
  exit 1
fi

RUN_ID="${TESTDINO_CI_RUN_ID:-quota-burn-$(date +%s)}"
remaining=$TOTAL
batch=1
batches=$(( (TOTAL + CHUNK - 1) / CHUNK ))

echo "quota-burn: total=$TOTAL chunk=$CHUNK batches=$batches run-prefix=$RUN_ID"

while [ "$remaining" -gt 0 ]; do
  n=$CHUNK
  if [ "$remaining" -lt "$CHUNK" ]; then
    n=$remaining
  fi
  done_after=$((TOTAL - remaining + n))
  echo "=== batch $batch/$batches: $n cases ($done_after/$TOTAL) ==="

  # Fresh ciRunId per batch so each chunk is its own dashboard run (and its own
  # Kafka produce stream). Reusing one id across processes is not required for
  # metering — each finalized run still bills passed+failed+flaky.
  QUOTA_BURN_COUNT=$n \
    TESTDINO_CI_RUN_ID="$RUN_ID-b$batch" \
    npx playwright test --project=quota-burn --retries=0 --workers=2

  remaining=$((remaining - n))
  batch=$((batch + 1))
done

echo "Done. Burned $TOTAL billable executions across $batches run(s)."