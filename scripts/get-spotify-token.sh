#!/bin/bash

set -a
source .env
set +a

CLIENT_ID="$SPOTIFY_CLIENT_ID"
CLIENT_SECRET="$SPOTIFY_CLIENT_SECRET"
REDIRECT_URI="http://127.0.0.1:3000/callback"

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
  echo "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env"
  exit 1
fi

echo "Open this URL in your browser:"
echo ""
echo "https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-currently-playing%20user-read-recently-played"
echo ""
read -p "Paste the 'code' from the redirect URL: " AUTH_CODE

echo ""
curl -s -X POST https://accounts.spotify.com/api/token -d "client_id=${CLIENT_ID}" -d "client_secret=${CLIENT_SECRET}" -d "grant_type=authorization_code" -d "code=${AUTH_CODE}" -d "redirect_uri=${REDIRECT_URI}"
echo ""
