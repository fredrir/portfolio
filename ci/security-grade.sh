#!/usr/bin/env bash
set -Eeuo pipefail
result=$(curl --fail --silent --show-error --max-time 60 -X POST 'https://observatory-api.mdn.mozilla.net/api/v2/scan?host=hansteen.dev')
jq -e '{grade, score}, (.grade as $grade | ["B", "B+", "A-", "A", "A+"] | index($grade) != null)' <<< "$result"
headers=$(curl --fail --silent --show-error --max-time 30 -I -A synthetic https://hansteen.dev/en)
grep -qi 'strict-transport-security' <<< "$headers"
grep -qi 'content-security-policy' <<< "$headers"
grep -qi 'x-content-type-options: nosniff' <<< "$headers"
grep -qi 'alt-svc: h3' <<< "$headers"
if curl --silent --show-error --max-time 15 --tls-max 1.1 -o /dev/null https://hansteen.dev/ 2>/dev/null; then
  echo 'legacy TLS accepted' >&2
  exit 1
fi
