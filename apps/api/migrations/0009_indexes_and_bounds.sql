-- Analytics scans visitors by day; media listing filters/sorts by
-- state/category/created_at. Back both with indexes to avoid sequential scans
-- as the tables grow.
create index if not exists visitors_created_at_idx on visitors (created_at);
create index if not exists media_state_idx on media (state);
create index if not exists media_category_idx on media (category);
create index if not exists media_created_at_id_idx on media (created_at desc, id);

-- Cap the visitor free-text columns (contact_messages already has checks).
-- Existing over-long rows are truncated so the constraint can be added.
update visitors set page = left(page, 512) where char_length(page) > 512;
update visitors set referrer = left(referrer, 2048) where char_length(referrer) > 2048;
update visitors set user_agent = left(user_agent, 1024) where char_length(user_agent) > 1024;

alter table visitors
    add constraint visitors_page_len check (char_length(page) <= 512),
    add constraint visitors_referrer_len check (referrer is null or char_length(referrer) <= 2048),
    add constraint visitors_user_agent_len check (user_agent is null or char_length(user_agent) <= 1024);
