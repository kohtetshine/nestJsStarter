#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

ENV_FILE=".env.local"
COMPOSE_FILES=("-f" "docker-compose.yml" "-f" "docker-compose.local.yml")

echo "[local] Stopping containers and removing orphans..."
docker compose --env-file "${ENV_FILE}" "${COMPOSE_FILES[@]}" down --remove-orphans

echo "[local] Done."

