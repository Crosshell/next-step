#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

FILE="docker-compose.k6.yml"
PROJECT="k6-next-step"

cleanup() {
  docker compose -p "$PROJECT" -f "$FILE" down -v --remove-orphans
}

trap cleanup EXIT INT TERM

docker compose -p "$PROJECT" -f "$FILE" up --build --abort-on-container-exit --exit-code-from k6
