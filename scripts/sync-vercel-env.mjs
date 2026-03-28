/**
 * Syncs env vars from .env.local to the Vercel project.
 * Usage: node scripts/sync-vercel-env.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

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
const VERCEL_TOKEN = env['VERCEL_TOKEN'];

if (!VERCEL_TOKEN) {
  console.error('❌  VERCEL_TOKEN missing from .env.local');
  process.exit(1);
}

// Find project ID from .vercel/project.json if it exists
let projectId, orgId;
try {
  const proj = JSON.parse(readFileSync(resolve(root, '.vercel/project.json'), 'utf8'));
  projectId = proj.projectId;
  orgId = proj.orgId;
} catch {
  // Try to find project by name
  console.log('📡  Looking up Vercel project "unicorn-sparkles"...');
  const listRes = await fetch('https://api.vercel.com/v9/projects?limit=20', {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  const listData = await listRes.json();
  const project = listData.projects?.find(p =>
    p.name === 'unicorn-sparkles' || p.name.includes('unicorn')
  );
  if (!project) {
    console.error('❌  Could not find project. Projects found:', listData.projects?.map(p => p.name));
    process.exit(1);
  }
  projectId = project.id;
  orgId = project.accountId;
  console.log(`✓  Found project: ${project.name} (${projectId})`);
}

// Vars to sync — key: { value, targets, sensitive }
const varsToSync = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    value: env['NEXT_PUBLIC_SUPABASE_URL'],
    targets: ['production', 'preview', 'development'],
    type: 'plain',
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    targets: ['production', 'preview', 'development'],
    type: 'plain',
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    value: env['SUPABASE_SERVICE_ROLE_KEY'],
    targets: ['production', 'preview'], // NOT development — server-only
    type: 'sensitive',
  },
];

console.log(`\n🔧  Syncing ${varsToSync.length} env vars to Vercel project...\n`);

for (const v of varsToSync) {
  if (!v.value) {
    console.warn(`  ⚠️  SKIP ${v.key} — value not found in .env.local`);
    continue;
  }

  // Check if it already exists
  const checkRes = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/env?decrypt=false`,
    { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
  );
  const checkData = await checkRes.json();
  const existing = checkData.envs?.filter(e => e.key === v.key) ?? [];

  // Delete existing entries for this key before re-adding
  for (const ex of existing) {
    await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${ex.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
  }

  // Create new entry
  const createRes = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: v.key,
      value: v.value,
      type: v.type,
      target: v.targets,
    }),
  });

  const createData = await createRes.json();
  if (createRes.ok) {
    console.log(`  ✓  ${v.key} → [${v.targets.join(', ')}]`);
  } else {
    console.error(`  ✗  ${v.key}: ${createData.error?.message ?? JSON.stringify(createData)}`);
  }
}

console.log('\n✅  Vercel env vars synced. A redeploy is needed to pick up the changes.');
console.log('    Triggering redeploy...\n');

// Trigger a redeploy of the latest production deployment
const deploysRes = await fetch(
  `https://api.vercel.com/v6/deployments?projectId=${projectId}&target=production&limit=1`,
  { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
);
const deploysData = await deploysRes.json();
const latest = deploysData.deployments?.[0];

if (latest) {
  const redeployRes = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'unicorn-sparkles',
      deploymentId: latest.uid,
      target: 'production',
    }),
  });
  const redeployData = await redeployRes.json();
  if (redeployRes.ok) {
    console.log(`  ✓  Redeploy triggered: ${redeployData.url ?? redeployData.id}`);
  } else {
    console.log(`  ℹ️  Could not auto-redeploy: ${redeployData.error?.message ?? 'push to git to redeploy'}`);
  }
}

console.log('\n🎉  Done!');
