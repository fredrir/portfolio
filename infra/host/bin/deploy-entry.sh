#!/bin/bash
# Forced command for the CI deploy key: only these verbs, nothing else.
set -euo pipefail

case "${SSH_ORIGINAL_COMMAND:-}" in
  "deploy "*)
    exec /home/portfolio/bin/deploy.sh "${SSH_ORIGINAL_COMMAND#deploy }"
    ;;
  "rollback")
    exec /home/portfolio/bin/rollback.sh
    ;;
  "status")
    echo "active-slot: $(cat /home/portfolio/.config/portfolio/active-slot 2>/dev/null || echo none)"
    tail -n 5 /home/portfolio/.config/portfolio/deploys.log 2>/dev/null || true
    ;;
  *)
    echo "denied: unsupported command" >&2
    exit 126
    ;;
esac
