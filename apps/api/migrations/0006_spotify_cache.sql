create table spotify_cache (
    id text primary key,
    data jsonb not null,
    updated_at timestamptz not null default now()
);
