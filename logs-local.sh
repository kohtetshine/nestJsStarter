#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

ENV_FILE=".env.local"
COMPOSE_FILES=("-f" "docker-compose.yml" "-f" "docker-compose.local.yml")

# Use existing BACKEND_PORT if set in .env.local; otherwise default to 3001
DEFAULT_PORT=3001
if [ -f "$ENV_FILE" ] && grep -qE '^BACKEND_PORT=' "$ENV_FILE"; then
  BACKEND_PORT=$(grep -E '^BACKEND_PORT=' "$ENV_FILE" | head -n1 | cut -d'=' -f2)
else
  BACKEND_PORT=$DEFAULT_PORT
fi

echo "[local] Tailing compose logs (Ctrl+C to stop)"
BACKEND_PORT="$BACKEND_PORT" docker compose --env-file "${ENV_FILE}" "${COMPOSE_FILES[@]}" logs -f --tail=200 "$@"

