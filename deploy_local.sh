#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

ENV_FILE=".env.local"
COMPOSE_FILES=("-f" "docker-compose.yml" "-f" "docker-compose.local.yml")

# Determine desired backend port from .env.local (BACKEND_PORT) or default to 3001
DEFAULT_PORT=3001
if grep -qE '^BACKEND_PORT=' "$ENV_FILE"; then
  DESIRED_PORT=$(grep -E '^BACKEND_PORT=' "$ENV_FILE" | head -n1 | cut -d'=' -f2)
else
  DESIRED_PORT=$DEFAULT_PORT
fi

is_port_in_use() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    ss -ltn | awk '{print $4}' | grep -q ":${port}$"
  elif command -v lsof >/dev/null 2>&1; then
    lsof -iTCP -sTCP:LISTEN -P | grep -q ":${port}"
  else
    # Fallback: try to bind with nc (may not be installed)
    nc -z 127.0.0.1 "$port" >/dev/null 2>&1
  fi
}

# Find a free port starting from DESIRED_PORT up to +20
FREE_PORT=""
for p in $(seq "$DESIRED_PORT" $((DESIRED_PORT+20))); do
  if ! is_port_in_use "$p"; then
    FREE_PORT="$p"
    break
  fi
done

if [ -z "$FREE_PORT" ]; then
  echo "[local] Could not find a free port starting at ${DESIRED_PORT}." >&2
  exit 1
fi

echo "[local] Using backend host port: ${FREE_PORT}"

echo "[local] Bringing stack down and pruning orphans..."
BACKEND_PORT="$FREE_PORT" docker compose --env-file "${ENV_FILE}" "${COMPOSE_FILES[@]}" down --remove-orphans || true

echo "[local] Pruning dangling images (safe)..."
docker image prune -f >/dev/null || true

echo "[local] Starting stack..."
BACKEND_PORT="$FREE_PORT" docker compose --env-file "${ENV_FILE}" "${COMPOSE_FILES[@]}" up -d

echo "[local] Done. Client: http://localhost:8080  Swagger: http://localhost:8080/docs"
