#!/usr/bin/env bash
set -Eeuo pipefail
install -d -o postgres -g postgres /tmp/ci-postgres
mkdir -p /reports
runuser -u postgres -- initdb -D /tmp/ci-postgres -U portfolio --auth=trust > /dev/null
cleanup() {
  result=$?
  trap - EXIT
  runuser -u postgres -- pg_ctl -D /tmp/ci-postgres -m fast -w stop || result=1
  exit "$result"
}
trap cleanup EXIT
runuser -u postgres -- pg_ctl -D /tmp/ci-postgres -o '-h 127.0.0.1 -p 5432' -l /tmp/ci-postgres/server.log -w start
createdb -h 127.0.0.1 -U portfolio portfolio
export DATABASE_URL=postgres://portfolio:portfolio@127.0.0.1:5432/portfolio
result=0
timeout --signal=TERM --kill-after=30s 2400 cargo mutants --workspace --timeout 300 -j 2 > /reports/mutants.log 2>&1 || result=$?
printf '%s\n' "$result" > /reports/exit-code
if test -d mutants.out; then cp -a mutants.out /reports/; fi
cat /reports/mutants.log
