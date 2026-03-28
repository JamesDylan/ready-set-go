# unicorn-sparkles — Build Plan

---

## File Structure

```
src/
  app/
    layout.tsx                          # Root: fonts, viewport, StoreProvider, daily reset
    page.tsx                            # Dashboard (3 KidCards)
    routine/
      [childId]/
        layout.tsx                      # CountdownBar always visible
        page.tsx                        # Checklist for one child
    parent/
      page.tsx                          # PIN gate
      settings/
        layout.tsx                      # Auth guard
        page.tsx                        # Settings hub
        [childId]/
          page.tsx                      # Per-child routine editor
    api/
      voice/
        transcribe/
          route.ts                      # POST → Whisper
  components/
    dashboard/
      KidCard.tsx
      CountdownBar.tsx
      ModeToggle.tsx
    routine/
      ChecklistView.tsx
      ChecklistItem.tsx
      CelebrationOverlay.tsx
      ProgressRing.tsx
    voice/
      VoiceButton.tsx
      WaveformAnimation.tsx
    parent/
      PINGate.tsx
      RoutineEditor.tsx
      TimePicker.tsx
      StreakDisplay.tsx
    shared/
      CharacterAvatar.tsx
      PageTransition.tsx
  store/
    useAppStore.ts                      # Root Zustand store + persist
    slices/
      childrenSlice.ts
      routineSlice.ts
      streakSlice.ts
      parentSlice.ts
  types/
    child.ts
    routine.ts
    store.ts
  hooks/
    useCountdown.ts
    useRoutineMode.ts
    useStreak.ts
    useSoundEffects.ts
    useVoiceCapture.ts
  lib/
    seedData.ts
    timeUtils.ts
    taskMatcher.ts
    celebrationUtils.ts
  styles/
    globals.css
    themes.css
```

---

## Phase 1 — Core MVP (touch-first, no voice)

### Task 1: Data models + Zustand store
- Define all TS interfaces in `src/types/`
- Wire up Zustand store with `persist` middleware
- Daily reset logic on store hydration
- Seed data for Griff, Harriet, Evie

**AC:** Toggle a task → reload → state preserved. Date change → tasks reset.

### Task 2: Main dashboard page
- 3 kid columns, landscape viewport, no scroll
- `ModeToggle` wired to store
- Theme CSS custom properties loaded

**AC:** Renders correctly at 1024×768. No overflow.

### Task 3: KidCard component
- Avatar, name, `ProgressRing`, streak badge, CTA button
- Tap navigates to `/routine/[childId]`
- Per-kid accent colours applied

### Task 4: CountdownBar
- Time-to-deadline calculation, updates every 30s
- Green → amber → red colour states
- Evening mode: shows next upcoming bedtime

### Task 5: Checklist view page
- Task list matching active `routineMode`
- Triggers `CelebrationOverlay` on all-complete (once per session)
- Back nav preserves state

### Task 6: ChecklistItem component
- 180×180pt grid cells, 56pt icon, tap to toggle
- Pop animation on complete/undo (CSS or Framer Motion)
- Debounce 200ms to prevent double-fire
- `role="checkbox"` + `aria-checked`

### Task 7: CelebrationOverlay
- `canvas-confetti` burst in kid's colours
- Character placeholder (static image Phase 1, Lottie Phase 2)
- "All Done!" text + streak count
- Auto-dismiss at 8s, tap-anywhere dismiss

### Task 8: Sound effects
- `useSoundEffects` hook with preloaded clips
- Sounds: `taskComplete`, `allDone`, `modeSwitch`
- iOS AudioContext unlock on first tap via `SoundManager`

### Task 9: Mode toggle
- `useRoutineMode` auto-detects morning/evening by time of day
- Manual override persists for the session
- Toggle plays `modeSwitch` sound

### Task 10: Seed data
- Default tasks for all 3 kids, both modes
- Applied only when localStorage key is absent

---

## Phase 2 — Voice + Polish (animations, Lottie, Whisper)

1. **Whisper API route** — `POST /api/voice/transcribe`, server-side key, 5MB size limit
2. **VoiceButton** — MediaRecorder + blob POST + loading state; `audio/mp4` fallback for Safari
3. **Task matcher** — fuzzy Levenshtein match + synonyms table, returns `{ matchedTaskId, confidence }`
4. **Waveform animation** — amplitude-responsive SVG/canvas bars, `AnalyserNode` driven
5. **Framer Motion transitions** — hero expand/collapse, `AnimatePresence` on `layout.tsx`
6. **Lottie character animations** — idle loop on dashboard, celebrate animation in overlay (requires Lottie JSON assets — see Open Questions)

---

## Phase 3 — Parent Settings (streaks, config, PIN)

1. **PINGate** — 4-digit numpad, bcryptjs hash, 3-attempt lockout (30s)
2. **Parent settings hub** — `/parent/settings`; auth guard redirects if `!isParentUnlocked`
3. **Per-child routine editor** — add/remove/reorder tasks, edit target times
4. **TimePicker** — large-button wheel for bedtime/morning target time
5. **StreakDisplay** — current + longest streak, 7-day dots, reset with confirmation

---

## Phase 4 — App Store Preparation

1. **Distribution decision** — Capacitor (App Store) vs PWA (Add to Home Screen). Recommendation: PWA first for household use, Capacitor when App Store is a hard requirement.
2. **StorageAdapter abstraction** — interface layer so localStorage → API swap requires no component changes
3. **Offline support** — `next-pwa` / Workbox, app shell caching, offline banner
4. **Performance audit** — Lighthouse >90 performance, >95 accessibility; LCP <1.5s on WiFi
5. **PWA manifest** — `manifest.json`, 192/512px icons, `"display": "standalone"`, landscape orientation lock

---

## Prototype Sequence

### Prototype 1 — Static Layout Shell
**Goal:** Validate iPad landscape layout and colour feel before writing logic.
**What:** Hardcoded 3-column layout, static KidCards, static ChecklistItems, colour themes applied.
**What not:** No store, no state, no navigation, no sound.
**Validate:** Does it look right on the actual iPad? Are tap targets big enough? Do colours feel fun?
**Time:** 1–2 days

### Prototype 2 — Interactive Checklist
**Goal:** Full state round-trip. Kids can actually complete their morning routine.
**What (delta):** Zustand store, localStorage, working navigation, `toggleTask`, `ProgressRing`, `CelebrationOverlay`, sounds, Framer Motion transitions.
**What not:** Voice, parent settings.
**Validate:** Does the celebration feel exciting? Does the progress ring make sense to the kids? Morning vs evening confusion?
**Time:** 3–4 days

### Prototype 3 — Full MVP with Voice
**Goal:** Installable PWA on the family iPad, complete Phase 1 + 2 + basic Phase 3.
**What (delta):** PINGate, parent settings + routine editor, Whisper voice, Lottie animations (if assets ready), PWA install.
**Validate:** Does voice work for kids' voices and accents? Is the PIN flow intuitive for parents?
**Time:** 4–5 days

---

## Component Specifications

| Component | Key Props | Store Reads | Store Writes |
|-----------|-----------|-------------|--------------|
| `KidCard` | `childId, name, theme, completedCount, totalCount, streak` | `childrenSlice`, `streakSlice` | None |
| `CountdownBar` | `deadlineTime, routineMode, childName?` | `routineSlice` | None |
| `ChecklistItem` | `taskId, label, icon, isComplete, onToggle, theme` | None | None (parent passes callback) |
| `CelebrationOverlay` | `childName, theme, onDismiss` | None | None (parent calls `incrementStreak` before mount) |
| `VoiceButton` | `onTranscript, disabled?` | None | None |
| `PINGate` | `onUnlock, onCancel` | `parentSlice.pinHash` | `parentSlice.unlock()` |
| `RoutineEditor` | `childId, routineMode` | `childrenSlice` | `addTask`, `removeTask`, `reorderTasks` |
| `ProgressRing` | `progress (0–1), size?, color?` | None | None |

---

## Resolved Decisions (2026-03-27)

| # | Question | Decision |
|---|----------|----------|
| 1 | Sound vibe | **Cute & magical** — source royalty-free (Mixkit, Freesound CC0, Zapsplat). Research underway. |
| 2 | Lottie assets | **Research LottieFiles for free car/unicorn/dragon animations**. Phase 2 ships with static art placeholder until suitable Lotties confirmed. |
| 3 | Griff text labels | **Keep text labels** — useful for learning to read. Large, bold. |
| 4 | Streak definition | **Morning streak:** all tasks completed AND left for school before 8:45am (app tracks final task completed before deadline). **Weekdays only** — no streak penalty for weekends. |
| 5 | Weekend mode | **Morning routine not shown on weekends** — `useRoutineMode` checks `isWeekday()` before showing morning routine. Evening routine runs 7 days. |
| 6 | Evening auto-switch | **Auto-switch to evening at 3:00pm** (school finish time). Manual override still works. |
| 7 | Device setup | **Single shared iPad** — localStorage is sufficient. No cloud sync needed. |
| 8 | App Store | **Aspirational** — Phase 4 deferred indefinitely. Focus on phases 1–3. |

## Architectural Impact of Decisions

### Streak logic (weekday-only, on-time rule)
```typescript
// src/lib/streakUtils.ts
import { isWeekend, isBefore, parseISO, format } from 'date-fns'

export function isWeekday(date: Date = new Date()): boolean {
  return !isWeekend(date)
}

// Streak increments when:
// 1. All morning tasks marked complete
// 2. Current time is before or equal to targetTime (08:45)
// 3. It's a weekday
// streak.lastCompletedDate is stored as "YYYY-MM-DD"
// On weekends: streak is neither incremented nor broken
export function shouldIncrementStreak(
  allTasksComplete: boolean,
  targetTime: string,  // "HH:MM"
  now: Date = new Date()
): boolean {
  if (!allTasksComplete) return false
  if (!isWeekday(now)) return false
  const [h, m] = targetTime.split(':').map(Number)
  const deadline = new Date(now)
  deadline.setHours(h, m, 0, 0)
  return isBefore(now, deadline) || now <= deadline
}
```

### Weekend detection in `useRoutineMode`
```typescript
// Morning routine only shows on weekdays
// Evening routine shows 7 days
export function useRoutineMode() {
  const now = new Date()
  const hour = now.getHours()
  const weekday = isWeekday(now)

  if (!weekday) return 'evening'          // Force evening on weekends
  if (hour >= 15) return 'evening'        // Auto-switch at 3pm
  return 'morning'
}
```
