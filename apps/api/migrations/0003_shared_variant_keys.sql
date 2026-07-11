-- Variant keys are content-hashed, so identical source images legitimately
-- share the same variant object across different media rows. Uniqueness is
-- only per (media_id, format). Note for future deletion logic: a variant
-- object may be referenced by more than one media row.
alter table media_variants drop constraint if exists media_variants_key_key;
