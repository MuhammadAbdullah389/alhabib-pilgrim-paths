# Apply SQL migrations using DATABASE_URL env var
# Usage: setx DATABASE_URL "postgres://..."  then run in PowerShell: ./scripts/apply_migrations.ps1

if (-not $env:DATABASE_URL) {
  Write-Error "DATABASE_URL environment variable not set. Set it to your Postgres connection string.";
  exit 1
}

$files = @(
  "sql/create_team_users_table.sql",
  "sql/create_booking_notes_table.sql"
)

foreach ($f in $files) {
  Write-Host "Applying migration: $f"
  & psql $env:DATABASE_URL -f $f
  if ($LASTEXITCODE -ne 0) {
    Write-Error "psql failed for $f with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
  }
}

Write-Host "Migrations applied.";
