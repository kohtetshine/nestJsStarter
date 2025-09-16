#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <port> [more ports...]" >&2
  exit 1
fi

for PORT in "$@"; do
  echo "Scanning for containers publishing host port :${PORT}..."
  MATCHES=$(docker ps --format '{{.ID}} {{.Names}} {{.Ports}}' | grep -E ":${PORT}->" || true)
  if [ -z "$MATCHES" ]; then
    echo "No containers publishing :${PORT}."
    continue
  fi
  echo "$MATCHES" | while read -r LINE; do
    CID=$(echo "$LINE" | awk '{print $1}')
    NAME=$(echo "$LINE" | awk '{print $2}')
    echo "Stopping container $NAME ($CID) using :${PORT}..."
    docker rm -f "$CID" >/dev/null
    echo "Removed $NAME."
  done
done

echo "Done."

