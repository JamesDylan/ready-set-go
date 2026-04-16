# Ready Set Go — Design Research Reference

> Research findings from the rebrand sprint. Use this as a living reference for future UI decisions.

---

## 1. Design Direction

**Core brief**: Kids routine app that feels like a character-driven experience, not a plain checklist. The goal is to create excitement around mundane morning/evening tasks — think racing game energy (morning) vs cosy wind-down (evening).

**Tone**: Playful, bold, achievement-oriented. Kids should feel like they're completing missions, not chores.

---

## 2. Brand Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-ready` | `#F59E0B` | Morning accent, wordmark, "ready" energy |
| `--color-go` | `#16A34A` | Completion state, all-done banner |
| `--color-brand` | `#7B2FBE` | Primary brand purple |
| `--color-brand-light` | `#C084FC` | Evening wordmark, highlights |
| `--color-gold` | `#F59E0B` | Streak badges |
| `--color-bg` (morning) | `#FFFBEB` | Warm cream — signals "ready" energy |
| `--color-bg` (evening) | `#0F0A1E` | Deep space purple — calm, wind-down |
| `--color-surface` (evening) | `#1C1333` | Card backgrounds in dark mode |

### Per-kid colours
| Kid | Accent | Light | Glow |
|-----|--------|-------|------|
| Griff | `#1E40AF` | `#93C5FD` | `#DBEAFE` |
| Harriet | `#BE185D` | `#F9A8D4` | `#FCE7F3` |
| Evie | `#065F46` | `#6EE7B7` | `#D1FAE5` |

**Extra avatar colours available** (for future kids/onboarding):
- Rocket: `#EA580C` / `#FDBA74` / `#FFF7ED`
- Dragon: `#B91C1C` / `#FCA5A5` / `#FEE2E2`
- Cat: `#0D9488` / `#99F6E4` / `#CCFBF1`

---

## 3. Typography

| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| Kid name | Fredoka One | 26px | 700 | Headline — must be visually dominant |
| Clock / countdown | Fredoka One | 28px | 400 | |
| Wordmark | Fredoka One | 14px | 700 | `letterSpacing: 0.2em` |
| Task labels | Nunito | 17px | 600 | Must be lighter than kid names |
| Streak / bedtime meta | Nunito | 12–13px | 700 | |
| Time remaining | Nunito | 15px | 900 | Coloured by urgency |

**Hierarchy rule**: Kid names must always appear visually heavier than task labels, even though Fredoka vs Nunito at similar sizes can invert this perception. Always size kid names larger than task labels.

---

## 4. Iconography

Using `@phosphor-icons/react` v2 (Bold weight, size 30). Falls back to emoji for unmapped tasks.

### Verified icon map (names confirmed against package types)
```
Make Bed      → Bed
Eat Breakfast → ForkKnife
Brush Teeth   → Tooth
Get Dressed   → TShirt
Pack Bag      → Backpack
Check Bag     → Backpack
Make Lunch    → ForkKnife
Sunblock      → Sun
Shoes         → Sneaker
Eat Dinner    → ForkKnife
Bath          → Bathtub
Shower        → Shower        ← NOT ShowerHead (doesn't exist)
Pyjamas       → Moon
Read          → Books
Bedtime       → Moon
Set Alarm     → Alarm         ← NOT AlarmClock (doesn't exist)
```

**Verification method**: Grep `node_modules/@phosphor-icons/react/dist/index.d.ts` — never trust LLM guesses for icon names.

---

## 5. Component Patterns

### Kid cards
- `border: 3px solid ${accentColor}` on the outer card — semantic, correct for rounded corners
- **Never use an inner child div for the accent strip** — it creates triangle-gap artifacts at corners due to inner/outer radius mismatch (outer `border-radius: 24px`, inner content radius = 24 - 3 = 21px)
- Instead use `backgroundImage: linear-gradient(180deg, color-mix(in srgb, ${accentColor} 18%, transparent) 0%, transparent 56px)` directly on the card element
- `allDone` state: background tinted at 6% accent + coloured glow box-shadow
- `boxShadow: '0 4px 0px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)'` for physical depth

### Task rows
- Height: 68px — this is the maximum that fits 7 tasks within the card without scrolling at 768px viewport height
- Completion checkbox: 44px squircle (`borderRadius: 14px`) with glow shadow when complete
- 500ms debounce on tap to prevent double-toggle accidents
- Un-tick shows "Already done! ✓" hint for 1 second before toggling

### Checkboxes (squircle style)
Inspired by iOS-style rounded squares:
```tsx
borderRadius: '14px'  // squircle, not circle
width: 44, height: 44
boxShadow: `0 2px 10px color-mix(in srgb, ${accentColor} 55%, transparent)` // when complete
```

### Progress ring
- Spring animation on fill: `transition: 'stroke-dashoffset 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'`
- Sits behind the character avatar in the card header (avatar overlaid with `absolute inset-0`)

### Countdown bar (fuel gauge)
- 10 block segments with divider lines
- Marker emoji slides to fill boundary
- `flexShrink: 0` required — must not compress in the flex column layout
- Colour thresholds: green > 30min, amber ≥ 10min, red < 10min
- Morning marker: 🏎️, Evening marker: ⭐

---

## 6. Animation Inventory

| Animation | Trigger | Details |
|-----------|---------|---------|
| `animate-check-bounce` | Task completed | Scale + rotate spring, 0.45s — re-triggered via React key change |
| `animate-pop-in` | All-done banner appears | Pop in from below |
| `animate-pulse-soft` | Countdown late / < 2 blocks left | Gentle pulse |
| Mini confetti burst | Task tap (not un-tick) | `canvas-confetti`, localized to tapped button position, per-kid colours |
| Full confetti burst | All tasks done | Double burst: immediate + 500ms delay from top |
| Celebration overlay | All tasks done | Full-screen overlay with kid name + "READY SET GO! 🏁" |

---

## 7. Mode System

Two modes controlled by `[data-mode]` on the root `<div>`:

- **Morning** (`data-mode="morning"`): Warm cream bg `#FFFBEB`, race car 🏎️ theme, countdown to school time
- **Evening** (`data-mode="evening"`): Dark bg `#0F0A1E`, moon/star theme, countdown to earliest upcoming bedtime

Auto-detection on first load: `hour < 14 → morning`, else `evening`. User can override with ModeToggle.

---

## 8. Design References (for future inspiration)

- **Dribbble search terms**: "kids app UI", "checklist gamification", "habit tracker children", "iOS squircle"
- **UIverse patterns used**: Squircle checkboxes, glowing card borders, fuel gauge progress bars
- **Game UI references**: Racing game HUD (morning countdown), cosy game inventory (evening task list)
- **Key principle**: Progress should feel physical — use glows, depth shadows, and spring animations rather than flat transitions

---

## 9. Known Issues / Tech Debt

| Issue | Priority | Notes |
|-------|----------|-------|
| PIN hardcoded to `'1234'` in store | Medium | Should validate against `pin_hash` in Supabase |
| Onboarding page (`src/app/onboarding/page.tsx`) is 696 lines | Low | Exceeds 500-line limit — split when next touched |
| `CharacterAvatar` key 'axolotl' maps to `evie.lottie` | Low | Naming inconsistency, harmless |
| Evening mode not fully verified post-redesign | Low | Test at 1024×768 dark mode |

---

## 10. Supabase Setup (for reference)

1. Go to app.supabase.com → restore paused project
2. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   BYPASS_AUTH=true   # dev only, bypasses session gate
   ```
3. Run `supabase/migrations/002_improvements.sql` in the SQL editor
4. localStorage migration: old key `unicorn-sparkles-v1` → new key `ready-set-go-v1` (handled automatically by `src/lib/migrateLocalStorage.ts`)
