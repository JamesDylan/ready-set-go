# unicorn-sparkles — Design Specification

**Theme:** Unicorns & Dragons · **Platform:** iPad landscape 1024×768 · **Audience:** Ages 4–8

---

## Colour Palette

### Global Brand

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-brand` | Magic Purple | `#7B2FBE` | Header, primary buttons |
| `--color-brand-light` | Lavender Mist | `#C084FC` | Card backgrounds |
| `--color-gold` | Starlight Gold | `#F59E0B` | Streak badges, rewards |
| `--color-bg` | Cloud White | `#FAF5FF` | App background |
| `--color-surface` | Soft White | `#FFFFFF` | Cards, modals |
| `--color-text` | Deep Plum | `#3B0764` | Headings |
| `--color-success` | Mint Green | `#10B981` | Completed tasks |

### Per-Kid Accent Colours

| Kid | Primary | Light | Glow | Notes |
|-----|---------|-------|------|-------|
| Griff | `#1E40AF` | `#93C5FD` | `#DBEAFE` | Racing blue |
| Harriet | `#BE185D` | `#F9A8D4` | `#FCE7F3` | Rose pink / lilac |
| Evie | `#065F46` | `#6EE7B7` | `#D1FAE5` | Dragon green + `#F97316` flame |

### CountdownBar States

| State | Time Remaining | Colour |
|-------|---------------|--------|
| Plenty of time | >50% | `#22C55E` |
| Getting close | 25–50% | `#F59E0B` |
| Urgent | 10–25% | `#F97316` |
| Overdue | Past deadline | `#EF4444` (pulsing) |

---

## Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| Display / headings | Fredoka One | 28–36px | 400 |
| Time display | Fredoka One | 32px | 400 |
| Task labels | Nunito | 22px | 700 |
| Body / badges | Nunito | 16–18px | 600–700 |

**Rule:** Minimum text size in child view is **20px Nunito Bold**. Prefer icons over text wherever possible for ages 4–6.

Google Fonts: `Fredoka One` (display) + `Nunito` (body). Both free, self-hostable.

---

## Layout — Dashboard (1024×768 landscape)

```
┌────────────────────────────────────────────────────────────────┐
│ HEADER (72px)                                                  │
│  [☀️ Morning  🌙 Evening]          07:42          [🔒 Parent] │
├──────────────┬──────────────────┬──────────────────┬──────────┤
│              │                  │                  │          │
│   GRIFF      │    HARRIET       │      EVIE        │  322px   │
│   (322px)    │    (322px)       │     (322px)      │  each    │
│              │                  │                  │          │
│  [Avatar 80] │   [Avatar 80]    │   [Avatar 80]    │          │
│  [Ring 90]   │   [Ring 90]      │   [Ring 90]      │          │
│  [Name 28px] │   [Name 28px]    │   [Name 28px]    │          │
│  [🔥 Streak] │   [🔥 Streak]    │   [🔥 Streak]    │          │
│  [3 of 7 ✓]  │   [3 of 7 ✓]    │   [3 of 7 ✓]    │          │
│              │                  │                  │          │
│  [Let's Go!] │   [Keep Going!]  │   [All Done! ✓]  │          │
│              │                  │                  │          │
├──────────────┴──────────────────┴──────────────────┴──────────┤
│ COUNTDOWN BAR (48px) — full width                              │
│ 🚀 Ready by 8:45am ══════════════════════════════ 42 min left │
└────────────────────────────────────────────────────────────────┘
```

**Kid panel internals (322×648px):**
1. Top accent strip (8px, kid colour, rounded top corners)
2. Avatar + progress ring (160px zone): 80pt avatar centred inside 90pt stroke ring
3. Name: Fredoka One 28px, centred
4. Streak badge: flame icon + count in Starlight Gold
5. Progress summary: "3 of 7 done" — Nunito Bold 18px
6. Spacer (flex fills remaining)
7. CTA button: 72px height, full panel width minus 24px padding, kid accent colour

---

## Layout — Checklist View

**Grid layout** (preferred over list for ages 4–6 — spatial scanning, large tap targets):
- 3 columns × N rows, 16pt gaps
- Cell size: **180×180pt** with 56pt icon centred + 20pt gap + task name below
- Minimum 9 tasks visible without scroll (3×3)
- Incomplete: white card, 2pt accent border
- Complete: `#D1FAE5` background, greyscale icon at 50% opacity, green checkmark top-right, strikethrough label

**Tap interaction sequence:**
1. Touch down → scale 0.95x, accent tint 15% bg
2. Touch up (complete) → spring to 1.08x → 1.0x (0.35s), star particle burst, checkmark scales in, sound plays
3. Second tap (undo) → reverse animation, soft descending tone

---

## Celebration Overlay

Triggered when final task is tapped. Duration: 4.5s before auto-dismiss prompt. Tap anywhere to dismiss.

**Animation sequence:**
| Phase | Timing | Content |
|-------|--------|---------|
| Burst | 0–0.8s | 60–80 confetti particles in kid's palette + gold |
| Character | 0.3–2.5s | Lottie animation: Griff's car zooms, Harriet's unicorn flies rainbow arc, Evie's dragon breathes sparkle-fire |
| Text | 0.8–2.5s | "Amazing!" Fredoka One 48px springs in; "All 7 tasks done!" fades in; "🔥 5 day streak!" |
| Hold | 2.5–4.5s | Confetti drifts, character idles |
| Dismiss | 4.5s+ | "Tap anywhere to close" pulses; auto-dismiss at 8s |

**Sound sequence:** fanfare (0.6s) → character sound (0.5s) → sparkle shimmer → coin collect on streak badge

---

## CountdownBar Detail

Visual metaphor: **Road to destination** — character icon travels left→right along a track as deadline approaches.

| State | Character animation |
|-------|---------------------|
| Plenty of time | Walks/flies casually |
| Getting close | Speeds up, small hurry animation |
| Urgent | Running, panting |
| Overdue | At destination, `⚠` icon, elapsed time shown |

Evening mode shows the **next upcoming bedtime** (not all three).

---

## Voice Interface UX

**Mic button:** 56×56pt round, Magic Purple, in header right zone.

**During recording:**
- Button turns Coral Red, waveform icon appears
- 3 concentric pulse rings radiate outward
- Floating pill (480×80pt, top of screen): live amplitude waveform + "Listening..."

**After processing:**
- Confidence ≥ 0.7 → task auto-completes, "Got it!" briefly shows
- 0.4–0.7 → confirmation chip "Did you mean [task]?" above task grid
- < 0.4 → "Try saying a task name" (no action)

**Error colours:** Yellow (misheard/quiet) — never red for voice errors. Red is reserved for the overdue countdown only.

---

## Checklist Item — Completed vs Incomplete

| State | Background | Icon | Overlay | Label |
|-------|-----------|------|---------|-------|
| Incomplete | White, accent left-border | Full colour, full opacity | None | Normal |
| Complete | `#D1FAE5` green tint | Greyscale 50% opacity | Green checkmark circle (top-right) | Strikethrough |

---

## Parent PIN Gate

Full-screen dark overlay (80% black) — signals "not for kids."

Modal (480×560pt):
- 🔒 "Parent Area" — Fredoka One 24px
- 4 dot indicators (filled on entry)
- 3×4 numpad (100×72pt per button, large touch targets)
- Wrong PIN: dots shake + turn red, clear. 3 fails = 30s lockout.

---

## Parent Settings Layout

Split-pane (after PIN success):
- Left sidebar (320px): Kids list + Global Settings sections
- Right panel (688px): Detail for selected item

**Routine editor (right panel):**
- Drag handle + task icon + task name + enabled toggle per row
- Swipe-left to delete (iOS pattern)
- Long-press drag handle to reorder
- "Add Task" dashed button at bottom → emoji picker + text field

---

## Page Transitions

| Transition | Animation |
|-----------|-----------|
| Dashboard → Checklist | Card hero-expands to fill screen (kid accent colour floods out), 0.4s spring |
| Checklist → Dashboard | Reverse — checklist shrinks back into card position, 0.3s ease-out |
| Dashboard → Celebration | Overlay slides up from bottom, 0.5s spring |
| Any → Parent Settings | Sheet slides up from bottom, 0.4s |
| Morning ↔ Evening toggle | Header/bar crossfade 0.5s; tasks slide right-out/left-in |

All transitions use hardware-accelerated `transform` only (no `top`/`left`). Respects `prefers-reduced-motion`.

---

## Sizing Quick Reference

| Element | Size |
|---------|------|
| Viewport | 1024×768px landscape |
| Header height | 72px |
| CountdownBar height | 48px |
| Kid panel width | 322px |
| Min tap target (child) | 64×64pt |
| Recommended tap target | 80×80pt |
| Task icon in checklist | 56×56pt |
| Avatar on dashboard | 80pt (in 90pt ring) |
| Celebration character | 200×200pt |
| CTA button height | 72pt |
