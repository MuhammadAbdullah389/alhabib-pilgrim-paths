Applying DB migrations and serverless endpoint

1) Ensure Postgres extension for UUIDs

Some migration files use `uuid_generate_v4()` which requires the `uuid-ossp` extension. Run this once in your database (Supabase SQL Editor or psql):

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

2) Apply SQL migrations

You can apply migrations locally using `psql` and the `DATABASE_URL` env var.

PowerShell (Windows):

```powershell
setx DATABASE_URL "postgres://USER:PASS@HOST:PORT/DATABASE"
# restart shell to pick up setx, or set in current session:
$env:DATABASE_URL = 'postgres://USER:PASS@HOST:PORT/DATABASE'
./scripts/apply_migrations.ps1
```

Linux / macOS:

```bash
export DATABASE_URL="postgres://USER:PASS@HOST:PORT/DATABASE"
./scripts/apply_migrations.sh
```

3) Confirm table exists

In Supabase SQL Editor or psql:

```sql
SELECT to_regclass('public.team_users');
SELECT * FROM team_users LIMIT 1;
```

4) Why frontend inserts fail (RLS / permissions)

If your project uses Row-Level Security (RLS) policies (common with Supabase), the client `anon` key cannot insert into protected tables. Recommended patterns:

- Use a backend/service endpoint (serverless) that holds the `service_role` key to perform privileged INSERTs.
- Or create carefully crafted RLS policies that allow only admin-claim-authenticated inserts (requires adding custom claims to JWTs).

5) Serverless example (provided in `api/create-team-user.js`)

- Deploy `api/create-team-user.js` as a serverless function (Vercel, Netlify, Azure). Set env vars:
  - `SUPABASE_URL` — your Supabase URL
  - `SUPABASE_SERVICE_ROLE_KEY` — your service role key (keep secret)

 - When calling from the admin UI, set `VITE_CREATE_TEAM_ENDPOINT` to the deployed function URL (Vite uses `VITE_` prefix).

6) Quick test

- After applying migrations, test inserting a row directly from Supabase SQL Editor:

```sql
INSERT INTO team_users (full_name, email, role) VALUES ('Test Admin','admin@example.com','admin');
```

If that succeeds, your app should be able to read the table (if RLS allows selects) and your serverless endpoint can be used for creation.

Contact me if you want me to deploy the serverless function into this repo as an Express route or add a Netlify/Vercel-specific adapter.
