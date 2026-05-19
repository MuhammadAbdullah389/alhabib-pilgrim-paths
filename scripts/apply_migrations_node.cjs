#!/usr/bin/env node
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const MIGRATIONS = [
  'sql/create_team_users_table.sql',
  'sql/create_booking_notes_table.sql',
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set. Set it to your Postgres connection string.');
    process.exitCode = 1;
    return;
  }

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    for (const m of MIGRATIONS) {
      const filePath = path.resolve(process.cwd(), m);
      console.log('Applying migration:', m);
      const sql = fs.readFileSync(filePath, 'utf8');

      const statements = sql
        .split(/;\s*\n/)
        .map(s => s.trim())
        .filter(Boolean);

      for (const stmt of statements) {
        try {
          await client.query(stmt);
        } catch (sErr) {
          console.error(`Statement failed in ${m}:`, sErr.message || sErr);
          throw sErr;
        }
      }
    }
    console.log('Migrations applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    console.error('Note: ensure DATABASE_URL points to the primary database and has privileges to create extensions and tables.');
    process.exitCode = 2;
  } finally {
    try { await client.end(); } catch (e) {}
  }
}

main();
