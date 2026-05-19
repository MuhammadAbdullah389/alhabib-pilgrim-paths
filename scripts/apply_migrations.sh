#!/usr/bin/env bash
# Apply SQL migrations using DATABASE_URL
# Usage: export DATABASE_URL="postgres://..." && ./scripts/apply_migrations.sh

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set. Set it to your Postgres connection string." >&2
  exit 1
fi

set -euo pipefail

files=(
  "sql/create_team_users_table.sql"
  "sql/create_booking_notes_table.sql"
)

for f in "${files[@]}"; do
  echo "Applying migration: $f"
  psql "$DATABASE_URL" -f "$f"
done

echo "Migrations applied."
