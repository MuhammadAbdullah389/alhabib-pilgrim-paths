#!/usr/bin/env node
const { Client } = require('pg');

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set.');
    process.exitCode = 1;
    return;
  }

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    const res = await client.query("SELECT to_regclass('public.team_users') as tbl, exists (select 1 from pg_extension where extname='uuid-ossp') as has_uuid;");
    console.log('Check result:', res.rows[0]);
    if (!res.rows[0].tbl) {
      console.warn('team_users table: MISSING');
    } else {
      console.log('team_users table: PRESENT');
    }
    console.log('uuid-ossp extension present:', !!res.rows[0].has_uuid);
  } catch (err) {
    console.error('Failed to check tables:', err.message || err);
    process.exitCode = 2;
  } finally {
    try { await client.end(); } catch (e) {}
  }
}

main();
