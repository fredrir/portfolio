#!/usr/bin/env bash
set -Eeuo pipefail
case "$1/$2" in
  apps/api/sanitize|apps/api/contact_validate|apps/worker/s3_event_parse) ;;
  *) exit 2 ;;
esac
mkdir -p /reports/artifacts
cd "$1"
result=0
timeout --signal=TERM --kill-after=30s 1800 cargo +nightly-2026-09-01 fuzz run "$2" -- -max_total_time=180 -rss_limit_mb=3072 -artifact_prefix=/reports/artifacts/ > /reports/fuzz.log 2>&1 || result=$?
printf '%s\n' "$result" > /reports/exit-code
cat /reports/fuzz.log
