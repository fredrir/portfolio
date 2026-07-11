#!/bin/bash
# Render per-service systemd environment files from the Doppler prd config.
# Runs on the host as the portfolio user (called by install/deploy).
set -euo pipefail
umask 077

CONF=$HOME/.config/portfolio
DOPPLER_TOKEN=$(cat "$CONF/doppler.token")
export DOPPLER_TOKEN

SECRETS_JSON=$(doppler secrets download --no-file --format json)
export SECRETS_JSON

python3 - "$CONF" <<'EOF'
import json, os, sys

conf = sys.argv[1]
s = json.loads(os.environ["SECRETS_JSON"])

def write(name, mapping):
    path = f"{conf}/{name}"
    with open(path, "w") as f:
        for key, value in mapping.items():
            if value is None:
                continue
            f.write(f"{key}={value}\n")
    print(f"rendered {path}")

write("postgres.env", {
    "POSTGRES_USER": "portfolio",
    "POSTGRES_DB": "portfolio",
    "POSTGRES_PASSWORD": s["POSTGRES_PASSWORD"],
})

write("api.env", {
    "DATABASE_URL": s["DATABASE_URL"],
    "API_ADDR": s.get("API_ADDR", "0.0.0.0:8080"),
    "AWS_REGION": s["AWS_REGION"],
    "AWS_ACCESS_KEY_ID": s["API_AWS_ACCESS_KEY_ID"],
    "AWS_SECRET_ACCESS_KEY": s["API_AWS_SECRET_ACCESS_KEY"],
    "MEDIA_BUCKET": s["MEDIA_BUCKET"],
    "MEDIA_PUBLIC_BASE_URL": s.get("MEDIA_PUBLIC_BASE_URL"),
    "ADMIN_TOKEN": s["ADMIN_TOKEN"],
    "RUST_LOG": s.get("RUST_LOG", "info"),
})

write("worker.env", {
    "DATABASE_URL": s["DATABASE_URL"],
    "AWS_REGION": s["AWS_REGION"],
    "AWS_ACCESS_KEY_ID": s["WORKER_AWS_ACCESS_KEY_ID"],
    "AWS_SECRET_ACCESS_KEY": s["WORKER_AWS_SECRET_ACCESS_KEY"],
    "MEDIA_BUCKET": s["MEDIA_BUCKET"],
    "MEDIA_QUEUE_URL": s["MEDIA_QUEUE_URL"],
    "RUST_LOG": s.get("RUST_LOG", "info"),
})

write("backup.env", {
    "AWS_REGION": s["AWS_REGION"],
    "AWS_ACCESS_KEY_ID": s["BACKUP_AWS_ACCESS_KEY_ID"],
    "AWS_SECRET_ACCESS_KEY": s["BACKUP_AWS_SECRET_ACCESS_KEY"],
    "BACKUP_BUCKET": s["BACKUP_BUCKET"],
})

for slot in ("blue", "green"):
    write(f"web-{slot}.env", {
        "API_URL": f"http://api-{slot}:8080",
        "HOST": "0.0.0.0",
        "PORT": "3000",
        "NODE_ENV": "production",
        "SUPABASE_URL": s.get("SUPABASE_URL"),
        "SUPABASE_ANON_KEY": s.get("SUPABASE_ANON_KEY"),
        "SPOTIFY_CLIENT_ID": s.get("SPOTIFY_CLIENT_ID"),
        "SPOTIFY_CLIENT_SECRET": s.get("SPOTIFY_CLIENT_SECRET"),
        "SPOTIFY_REFRESH_TOKEN": s.get("SPOTIFY_REFRESH_TOKEN"),
        "RECAPTCHA_SECRET_KEY": s.get("RECAPTCHA_SECRET_KEY"),
    })
EOF
