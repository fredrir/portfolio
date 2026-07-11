create table media (
    id uuid primary key default gen_random_uuid(),
    original_key text not null unique,
    filename text not null check (char_length(filename) between 1 and 255),
    content_type text not null,
    size_bytes bigint check (size_bytes > 0),
    width int,
    height int,
    content_hash text,
    state text not null default 'pending'
        check (state in ('pending', 'processing', 'ready', 'failed')),
    error text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table media_variants (
    id uuid primary key default gen_random_uuid(),
    media_id uuid not null references media (id) on delete cascade,
    format text not null check (format in ('avif', 'webp')),
    key text not null unique,
    width int not null,
    height int not null,
    size_bytes bigint not null,
    created_at timestamptz not null default now(),
    unique (media_id, format)
);

-- Worker idempotency: one row per handled S3 event.
create table processed_events (
    id text primary key,
    processed_at timestamptz not null default now()
);
