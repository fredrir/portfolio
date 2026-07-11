-- Tamper-evident administration log: each entry hashes its predecessor.
create table admin_audit (
    id bigint generated always as identity primary key,
    at timestamptz not null default now(),
    action text not null,
    detail jsonb not null,
    prev_hash text not null,
    entry_hash text not null
);
