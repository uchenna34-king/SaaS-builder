#!/bin/bash
# ---------------------------------------------------------------------------
# SessionStart bootstrap for Claude Code on the web.
#
# The web session runs in an ephemeral container that wipes node_modules,
# .env.local, and the local Postgres role/database between sessions. Any one
# of those alone stops `next dev` from starting, which the browser surfaces as
# ERR_CONNECTION_REFUSED (-102). This script idempotently rebuilds all of them
# so every session (and its preview) comes up healthy.
#
# Safe to run repeatedly: every step is a no-op when already satisfied.
# ---------------------------------------------------------------------------
set -euo pipefail

# Only run in the remote/web container. Locally you manage your own services.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/home/user/SaaS-builder}"
cd "$PROJECT_DIR"

DB_USER="expenseuser"
DB_PASS="expensepass"
DB_NAME="expense_tracker"
DB_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"

log() { echo "[session-start] $*"; }

# 1. Ensure PostgreSQL is running -------------------------------------------
if ! pg_lsclusters 2>/dev/null | grep -q 'online'; then
  log "starting PostgreSQL cluster"
  pg_ctlcluster 16 main start 2>&1 | sed 's/^/[session-start] /' || true
  sleep 2
fi

# 2. Ensure the app role + database exist -----------------------------------
# ALTER ROLE runs unconditionally so the password is deterministic even if a
# stale role with a different password survived.
log "ensuring role '${DB_USER}' and database '${DB_NAME}'"
sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" \
  | grep -q 1 || sudo -u postgres psql -c "CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';"
sudo -u postgres psql -c "ALTER ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}';" >/dev/null
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" \
  | grep -q 1 || sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"

# 3. Ensure .env.local exists (generate a secret only when creating it) ------
if [ ! -f .env.local ]; then
  log "writing .env.local (fresh AUTH_SECRET)"
  AUTH_SECRET="$(openssl rand -base64 32)"
  cat > .env.local <<ENV
DATABASE_URL="${DB_URL}"
DIRECT_URL="${DB_URL}"
AUTH_SECRET="${AUTH_SECRET}"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="ExpenseTrack"
ENV
fi

# 4. Ensure dependencies are installed --------------------------------------
if [ ! -d node_modules/next ]; then
  log "installing npm dependencies"
  npm install 2>&1 | tail -3 | sed 's/^/[session-start] /'
fi

# 5. Sync schema + seed system data -----------------------------------------
# Prisma's CLI reads .env (not .env.local), so export the vars into the shell.
set -a; . ./.env.local; set +a
log "syncing schema (db push)"
npm run db:push 2>&1 | tail -3 | sed 's/^/[session-start] /'
log "seeding system categories"
npm run db:seed 2>&1 | tail -3 | sed 's/^/[session-start] /'

# 6. Start the dev server if nothing is listening on :3000 -------------------
if ! curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
  log "starting dev server (logs -> /tmp/next-dev.log)"
  nohup npm run dev > /tmp/next-dev.log 2>&1 &
fi

log "bootstrap complete"
