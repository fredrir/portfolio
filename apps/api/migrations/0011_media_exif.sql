-- Camera metadata extracted by the worker from the original upload; the
-- generated variants are re-encoded from pixels and carry no EXIF, so this is
-- the only place the data survives. taken_at is EXIF wall-clock local time,
-- which has no timezone. Idempotent (if not exists) so the columns can be
-- applied out-of-band ahead of a release, e.g. to backfill before a deploy.
alter table media
    add column if not exists taken_at timestamp,
    add column if not exists camera text check (char_length(camera) between 1 and 256),
    add column if not exists lens text check (char_length(lens) between 1 and 256),
    add column if not exists focal_length_mm real check (focal_length_mm > 0),
    add column if not exists aperture real check (aperture > 0),
    add column if not exists shutter_seconds double precision check (shutter_seconds > 0),
    add column if not exists iso int check (iso > 0),
    add column if not exists latitude double precision check (latitude between -90 and 90),
    add column if not exists longitude double precision check (longitude between -180 and 180);
