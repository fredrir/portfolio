create table cv_versions (
    id uuid primary key default gen_random_uuid(),
    lang text not null check (lang in ('en', 'nb')),
    release_tag text not null,
    asset_id bigint not null,
    asset_updated_at timestamptz not null,
    s3_key text not null,
    size_bytes bigint not null,
    sha256 text not null,
    active boolean not null default false,
    created_at timestamptz not null default now(),
    unique (lang, asset_id)
);

create unique index cv_versions_one_active_per_lang on cv_versions (lang) where active;
