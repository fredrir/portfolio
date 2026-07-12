-- Generic persisted cache for upstream API responses, keyed by consumer.
-- Replaces in-memory caches that were wiped on every restart/deploy.
create table upstream_cache (
    id text primary key,
    data jsonb not null,
    updated_at timestamptz not null default now()
);
