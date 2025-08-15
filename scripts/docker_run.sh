#!/usr/bin/env bash
set -euo pipefail
IMAGE="${1:-gymtracker:1.1}"
docker run -d -p 3000:3000 \
  -e SESSION_SECRET="cambia_esto" \
  -e COOKIE_SECRET="cambia_esto_tambien" \
  -v gymtracker_data:/app/gymtracker.sqlite \
  -v gymtracker_sessions:/app/sessions.sqlite \
  --name gymtracker_container "${IMAGE}"
echo "GymTracker en http://localhost:3000"
