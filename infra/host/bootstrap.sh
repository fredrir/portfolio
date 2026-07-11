#!/bin/bash
# One-time host bootstrap for the portfolio stack (run as root on the VPS).
# Additive only: must not touch the existing leploy/pyparser stack.
set -euo pipefail

USERNAME=portfolio

if ! id "$USERNAME" &>/dev/null; then
  adduser --disabled-password --gecos "portfolio deploy user" "$USERNAME"
  echo "created user $USERNAME"
fi

# Rootless podman needs subordinate id ranges.
grep -q "^${USERNAME}:" /etc/subuid || usermod --add-subuids 200000-265535 "$USERNAME"
grep -q "^${USERNAME}:" /etc/subgid || usermod --add-subgids 200000-265535 "$USERNAME"

# User services survive logout and start at boot.
loginctl enable-linger "$USERNAME"

if ! command -v podman &>/dev/null; then
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq podman passt uidmap
fi

install -d -o "$USERNAME" -g "$USERNAME" -m 700 \
  "/home/$USERNAME/.config" \
  "/home/$USERNAME/.config/containers" \
  "/home/$USERNAME/.config/containers/systemd" \
  "/home/$USERNAME/.config/portfolio" \
  "/home/$USERNAME/caddy"

echo "bootstrap complete: user=$USERNAME podman=$(podman --version | awk '{print $3}')"
