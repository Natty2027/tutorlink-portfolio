#!/usr/bin/env bash
#
# TutorLink — one-command local startup.
# Starts MySQL (Homebrew service), the Express backend, and the Next.js frontend,
# then stops all of them together on Ctrl-C.
#
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT/application/backend"
FRONTEND="$ROOT/application/frontend"

# --- Pre-flight checks -------------------------------------------------------
if [ ! -f "$BACKEND/.env" ]; then
  echo "⚠  Missing $BACKEND/.env"
  echo "   Copy the example and set your DB credentials, then re-run:"
  echo "     cp application/backend/.env.example application/backend/.env"
  exit 1
fi

# --- Database ----------------------------------------------------------------
echo "▶ Starting MySQL (Homebrew service)…"
if command -v brew >/dev/null 2>&1; then
  brew services start mysql >/dev/null 2>&1 || \
    echo "  (could not start MySQL via brew — start your database manually)"
else
  echo "  (Homebrew not found — make sure MySQL is running on your own)"
fi

# --- Install deps on first run ----------------------------------------------
[ -d "$BACKEND/node_modules" ]  || ( echo "▶ Installing backend deps…";  cd "$BACKEND"  && npm install )
[ -d "$FRONTEND/node_modules" ] || ( echo "▶ Installing frontend deps…"; cd "$FRONTEND" && npm install )

# --- Servers -----------------------------------------------------------------
echo "▶ Starting backend  → http://localhost:3001"
( cd "$BACKEND" && npm run dev ) &
BACK_PID=$!

echo "▶ Starting frontend → http://localhost:3000"
( cd "$FRONTEND" && npm run dev ) &
FRONT_PID=$!

# Stop both servers cleanly on Ctrl-C.
trap 'echo; echo "Stopping…"; kill "$BACK_PID" "$FRONT_PID" 2>/dev/null; exit 0' INT TERM

echo
echo "✅ TutorLink is starting up:"
echo "   Frontend → http://localhost:3000"
echo "   Backend  → http://localhost:3001"
echo "   Press Ctrl-C to stop both."
echo

wait
