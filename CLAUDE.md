@AGENTS.md

# Project: unicorn-sparkles

## Swarm Configuration (overrides parent CLAUDE.md)

- **Topology**: hierarchical
- **Max Agents**: 6
- **Strategy**: specialized
- **Consensus**: raft

Six-agent ceiling: coordinator · coder · reviewer · tester · backend/infra · researcher.
No lateral mesh needed — hub-and-spoke is sufficient for single-app iterative dev.

## Agent Wave Sequencing (mandatory)

Always follow the foundation → feature → quality wave order:

**Wave 1 — Foundation** (must complete before Wave 2 starts)
- `src/types/index.ts` — shared type contracts
- `src/store/useAppStore.ts` — shared state interface
- `src/proxy.ts` — auth session contract
- `src/lib/supabase/client.ts` + `server.ts` — DB client shape

After Wave 1: store exported interfaces in `contracts` memory namespace.

**Wave 2 — Features** (safe to parallelize, depends on Wave 1)
- UI leaf components · route pages · route handlers · infra scripts

**Wave 3 — Quality** (depends on Wave 2)
- Tests (`tester` agent) · review pass (`reviewer` agent)

**File conflict rule**: never assign the same file to two parallel agents.

## Agent Type Mapping

| Task | Agent |
|------|-------|
| UI components | `coder` |
| Zustand store design | `sparc-coder` or `architecture` |
| Auth/middleware | `security-architect` (design) → `coder` (impl) |
| Supabase schema + RLS | `sparc-coder` |
| UX research | `researcher` |
| Code review (pre-merge) | `reviewer` |
| Static analysis (hook) | `code-analyzer` via post-edit hook |
| Tests | `tester` |
| Infra scripts | `coder` with `scripts/` path constraint |

## Model Tier Routing

- **Tier 1 (Agent Booster)**: single-line edits, rename/move, add to list, fix import path
- **Tier 2 (Haiku)**: simple utility files (<30 lines), type additions, config tweaks
- **Tier 3 (Sonnet)**: architecture, auth, state design, multi-file features, security

Always check for `[AGENT_BOOSTER_AVAILABLE]` before spawning. Emoji/icon list additions = Tier 1.

## Memory Namespaces

- `contracts` — exported interfaces from Wave 1 files
- `patterns` — Supabase/Next.js conventions and gotchas
- `alerts` — active tech-debt items to fix

## Quality Gate (mandatory after every code change)

Run these three commands in parallel after any edit. All must pass before marking a task done:

```bash
npm run typecheck   # tsc --noEmit — catches type errors
npm test            # vitest run  — unit tests in src/tests/
npm run lint        # eslint
```

**When to run each:**
- `typecheck` — after any change to types, store, or component props
- `test` — after any change to store logic, utilities, or anything with a test file
- `lint` — after any file edit

**Tests live in `src/tests/`** — one `.test.ts` per logical area:
- `store.test.ts` — Zustand store actions (toggleTask, resetDay, etc.)
- Add test files for new utilities and business logic as they are written

**tester agent responsibilities (Wave 3):**
1. Run `npm test` — fix any failures before proceeding
2. Run `npm run typecheck` — fix type errors
3. Add regression tests for any bug that was fixed
4. Add smoke tests for any new store action or utility

## Dev Preview

The dev server bypasses Supabase auth when `BYPASS_AUTH=true` is in `.env.local`.
This lets agents use the preview tools to verify UI changes without needing a session.
`.env.local` is gitignored — this flag never reaches production.

## Key Conventions

- Files must stay under 500 lines — split into sub-components if needed
- `src/app/onboarding/page.tsx` is at 696 lines — refactor target
- Never use "assume file X will exist" — store and retrieve contracts from memory
- `proxy.ts` is the Next.js 16 name for middleware — never use `middleware.ts`
- Async APIs in Next.js 16: always `await cookies()`, `await headers()`, `await params`
