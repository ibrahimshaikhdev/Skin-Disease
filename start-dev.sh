#!/usr/bin/env bash
# DermacareVision AI - start all three tiers for local development.
# Each tier runs in the background; press Ctrl-C to stop them all.
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "Starting Python inference service (:5001)..."
( cd "$ROOT/backend" && python app.py ) &
PY=$!

echo "Starting Spring Boot gateway (:8080)..."
( cd "$ROOT/gateway" && { [ -f target/gateway-1.0.0.jar ] && java -jar target/gateway-1.0.0.jar || ./mvnw spring-boot:run; } ) &
GW=$!

echo "Starting React frontend (:5173)..."
( cd "$ROOT/frontend" && npm run dev ) &
FE=$!

trap 'echo "Stopping..."; kill $PY $GW $FE 2>/dev/null' INT TERM
echo "All services launching. Open http://localhost:5173 (demo / demo12345)."
wait
