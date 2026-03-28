/**
 * Runs the initial schema migration against Supabase.
 * Uses the service role key from .env.local via the Supabase Management API.
 *
 * Usage: node scripts/setup-supabase.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Parse .env.local
function parseEnvFile(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
  return env;
}

const env = parseEnvFile(resolve(root, '.env.local'));
const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceKey  = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceKey) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env.local');
  process.exit(1);
}

// Extract project ref from URL: https://<ref>.supabase.co
const accessToken = env['SUPABASE_ACCESS_TOKEN'];
const databaseUrl = env['DATABASE_URL'];

const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('❌  Could not extract project ref from URL:', supabaseUrl);
  process.exit(1);
}

console.log(`🔗  Project ref: ${projectRef}`);

// Read SQL
const sql = readFileSync(resolve(root, 'supabase/migrations/001_initial_schema.sql'), 'utf8');

// ── Option A: Personal access token via Management API ──
if (accessToken) {
  console.log('🚀  Running migration via Supabase Management API (personal token)...\n');
  const mgmtUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  const res = await fetch(mgmtUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const body = await res.json().catch(() => res.text().then(t => ({ raw: t })));
  if (res.ok) {
    console.log('✅  Migration complete!');
    console.log('    Tables: families, children, tasks, task_completions');
    console.log('    RLS policies applied to all four tables.');
    process.exit(0);
  }
  console.error('❌  Management API error:', res.status, JSON.stringify(body, null, 2));
  process.exit(1);
}

// ── Option B: Direct Postgres via DATABASE_URL ──
if (databaseUrl) {
  console.log('🚀  Running migration via direct Postgres connection...\n');
  // Dynamically import pg (may need: npm install pg)
  let pg;
  try {
    pg = await import('pg');
  } catch {
    console.log('  Installing pg package...');
    const { execSync } = await import('child_process');
    execSync('npm install pg', { cwd: root, stdio: 'inherit' });
    pg = await import('pg');
  }
  const { default: { Client } } = pg;
  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('✅  Migration complete!');
  console.log('    Tables: families, children, tasks, task_completions');
  console.log('    RLS policies applied to all four tables.');
  process.exit(0);
}

console.error('❌  Add either SUPABASE_ACCESS_TOKEN or DATABASE_URL to .env.local and re-run.');
process.exit(1);
