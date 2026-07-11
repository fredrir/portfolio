create table visitors (
    id bigint generated always as identity primary key,
    page text not null default '/',
    referrer text,
    user_agent text,
    country text,
    created_at timestamptz not null default now()
);

create table contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(name) between 1 and 200),
    email text not null check (char_length(email) between 3 and 320),
    phone text check (char_length(phone) <= 30),
    message text not null check (char_length(message) between 1 and 5000),
    -- pending until the delivery worker (Phase 2) picks it up
    delivery_state text not null default 'pending'
        check (delivery_state in ('pending', 'delivered', 'failed')),
    created_at timestamptz not null default now()
);
