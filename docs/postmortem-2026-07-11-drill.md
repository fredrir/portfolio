# Postmortem: deliberately broken release (drill), 2026-07-11

Status: closed. Simulated incident run against production to satisfy the
Phase 4 exit criterion: *a deliberately broken release fails safely without
replacing the healthy production slot.*

## Summary

A release whose web container starts a nonexistent entrypoint
(`22eef2188e06`, PR #13) was pushed through the full production pipeline.
The deploy failed at the health gate and aborted before the traffic switch.
The active blue slot served the previous release (`e811392ed877`) without
interruption; public probes returned 200 throughout. Recovery was a revert
PR (#14) deployed through the same pipeline.

## Timeline (UTC)

| Time | Event |
|---|---|
| 18:0x | Drill PR #13 merged to main; pipeline builds, attests and signs all three images |
| 18:09:26 | Deploy starts: active=blue, target=green |
| 18:09:27–36 | Cosign signature verification passes for web/api/worker |
| 18:09:51 | Green slot started; health gate begins probing |
| 18:09–18:14 | web-green crash-loops (`node .output/server/deliberately-missing.mjs`); systemd restarts it; probes never succeed |
| 18:14:03 | `HEALTH GATE FAILED — blue slot untouched, aborting`; recorded `result=failed-health` in deploys.log; deploy job exits 1 |
| 18:14+ | Public checks confirm `/en` 200, `x-origin-slot: blue`, version still `e811392` |
| 18:2x | Revert PR #14 merged; recovery release deploys onto green |

## Impact

None. No user-visible errors; the traffic switch is gated behind health, so
the broken slot never received a request.

## What worked

- Build-once, sign, verify: the host refused nothing here, but the chain ran
  end to end under failure conditions.
- The health gate did its one job: no healthy probes, no switch.
- Failure is observable: deploy job red, `deploys.log` records the attempt,
  the engineering page's deployment history shows the failed run publicly.
- The previous release kept running in its slot, making recovery a plain
  redeploy rather than a restore.

## What to improve

1. **Time to verdict (~4 min).** 30 probes × 3 s plus image pulls before
   declaring failure; a crash-looping container could be detected faster by
   inspecting restart counts alongside probes.
2. **Failed deploys are not recorded as GitHub deployment statuses** (only
   successes create deployment records); the runs list covers it, but a
   `failure` status would be more explicit.
3. **Edge cache status for signed media reads** reports BYPASS; variants are
   client-cached (immutable) but each edge miss costs an S3 read. Investigate
   caching signed subrequests.

## Follow-ups

- [ ] Probe restart counters in deploy.sh to fail fast on crash-loops
- [ ] Record `failure` deployment statuses from the deploy workflow
- [ ] Investigate Cloudflare cache behavior for SigV4 subrequests
