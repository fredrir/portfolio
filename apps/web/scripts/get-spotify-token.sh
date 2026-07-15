#!/usr/bin/env bash
set -euo pipefail

CLIENT_ID="${SPOTIFY_CLIENT_ID:-}"
CLIENT_SECRET="${SPOTIFY_CLIENT_SECRET:-}"

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
  echo "Missing Spotify credentials; run with: doppler run -- bash apps/web/scripts/get-spotify-token.sh" >&2
  exit 1
fi

echo "Choose callback URI:"
echo "1) http://127.0.0.1:3000/callback"
echo "2) https://hansteen.dev/callback"
read -p "Enter 1 or 2: " CALLBACK_CHOICE

case "$CALLBACK_CHOICE" in
  1)
    REDIRECT_URI="http://127.0.0.1:3000/callback"
    ;;
  2)
    REDIRECT_URI="https://hansteen.dev/callback"
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "Using redirect URI: $REDIRECT_URI"
echo ""
echo "Open this URL in your browser:"
echo ""
echo "https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-currently-playing%20user-read-recently-played%20user-top-read"
echo ""
read -p "Paste the 'code' from the redirect URL: " AUTH_CODE

echo ""
# Feed credentials through curl's stdin config so the client secret and auth
# code do not appear in the process list.
curl -sS --config - <<EOF
url = "https://accounts.spotify.com/api/token"
request = "POST"
data-urlencode = "client_id=${CLIENT_ID}"
data-urlencode = "client_secret=${CLIENT_SECRET}"
data-urlencode = "grant_type=authorization_code"
data-urlencode = "code=${AUTH_CODE}"
data-urlencode = "redirect_uri=${REDIRECT_URI}"
EOF
echo
