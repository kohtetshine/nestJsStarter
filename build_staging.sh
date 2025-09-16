#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

ENV_FILE=".env.stg"
echo "Building with ${ENV_FILE}..."
docker compose --env-file "${ENV_FILE}" -f docker-compose.yml -f docker-compose.stg.yml build
echo "Build complete (staging)."

