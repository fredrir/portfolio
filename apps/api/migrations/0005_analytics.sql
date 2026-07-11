-- Country code from the edge (x-visitor-country); the raw client IP is no
-- longer stored (legacy rows keep it in the country column).
alter table visitors add column country_code text
    check (country_code is null or char_length(country_code) <= 8);
