/**
 * One-time script: runs 001_initial_schema.sql against your Supabase project.
 * Uses the service role key (bypasses RLS) so it can create tables + policies.
 * Run with: node scripts/run-migration.mjs
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Read .env.local manually (no dotenv needed)
const envRaw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const env = Object.fromEntries(
  envRaw.split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=').map((p, i) => i === 0 ? p.trim() : l.slice(l.indexOf('=') + 1).trim()))
);

const url = env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!url || !serviceKey) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const sql = readFileSync(new URL('../supabase/migrations/001_initial_schema.sql', import.meta.url), 'utf8');

// Split on statement boundaries and run each one
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`🚀  Running ${statements.length} SQL statements against ${url}...\n`);

let passed = 0;
let skipped = 0;

for (const stmt of statements) {
  const preview = stmt.slice(0, 60).replace(/\n/g, ' ');
  const { error } = await supabase.rpc('exec_sql', { sql: stmt + ';' }).catch(() => ({ error: { message: 'rpc not available' } }));

  if (error && error.message === 'rpc not available') {
    // Fallback: use the REST SQL endpoint directly
    const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: stmt + ';' }),
    });
    if (!res.ok) {
      // Try the management API endpoint
      const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
      if (!projectRef) { console.error('  ✗ Could not extract project ref from URL'); continue; }

      const mgmt = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: stmt + ';' }),
      });
      const body = await mgmt.json().catch(() => ({}));
      if (!mgmt.ok) {
        if (body?.message?.includes('already exists')) {
          console.log(`  ⚠️  SKIP (already exists): ${preview}...`);
          skipped++;
        } else {
          console.error(`  ✗ ERROR: ${body?.message ?? mgmt.statusText}`);
          console.error(`     Statement: ${preview}...`);
        }
        continue;
      }
    }
  } else if (error) {
    if (error.message?.includes('already exists')) {
      console.log(`  ⚠️  SKIP (already exists): ${preview}...`);
      skipped++;
    } else {
      console.error(`  ✗ ERROR: ${error.message}`);
      console.error(`     Statement: ${preview}...`);
    }
    continue;
  }

  console.log(`  ✓ OK: ${preview}...`);
  passed++;
}

console.log(`\n✅  Done. ${passed} succeeded, ${skipped} skipped (already existed).`);
