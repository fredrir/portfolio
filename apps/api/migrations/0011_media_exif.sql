-- Camera metadata extracted by the worker from the original upload; the
-- generated variants are re-encoded from pixels and carry no EXIF, so this is
-- the only place the data survives. taken_at is EXIF wall-clock local time,
-- which has no timezone.
alter table media
    add column taken_at timestamp,
    add column camera text check (char_length(camera) between 1 and 256),
    add column lens text check (char_length(lens) between 1 and 256),
    add column focal_length_mm real check (focal_length_mm > 0),
    add column aperture real check (aperture > 0),
    add column shutter_seconds double precision check (shutter_seconds > 0),
    add column iso int check (iso > 0),
    add column latitude double precision check (latitude between -90 and 90),
    add column longitude double precision check (longitude between -180 and 180);
