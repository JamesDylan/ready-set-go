# unicorn-sparkles — System Architecture

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4
**Platform:** iPad landscape (1024×768) · Touch-first · No auth (Phase 1)
**Persistence:** localStorage via Zustand persist middleware

---

## Architecture Decision Records

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Zustand for state management | Persist middleware, selector-based re-renders, minimal boilerplate |
| ADR-002 | Framer Motion for animations | AnimatePresence, spring physics, gesture API — ideal for iPad touch |
| ADR-003 | Lottie React for character animations | Pre-built JSON animations, infinite resolution, file-size efficient |
| ADR-004 | use-sound (Howler.js) for audio | React hook API, iOS AudioContext unlock handled automatically |
| ADR-005 | canvas-confetti for particle effects | 4kb, canvas-based, fire-and-forget |
| ADR-006 | SVG sprite for task icons + Fluent Emoji 3D | MIT licensed, 3D style, CSS recolourable, single HTTP request |
| ADR-007 | Server-side Whisper proxy via Next.js API route | API key never in browser bundle |
| ADR-008 | bcryptjs PIN hash in localStorage | No plaintext PIN; bcrypt runs in-browser without native modules |
| ADR-009 | date-fns for time/streak math | Tree-shakeable, functional imports, streak logic reads naturally |
| ADR-010 | StorageAdapter abstraction deferred to Phase 4 | Premature until auth requirements are known |

---

## TypeScript Data Models

```typescript
// src/types/child.ts

export type AvatarType = 'car' | 'unicorn' | 'dragon';
export type RoutineMode = 'morning' | 'evening';

export interface Task {
  id: string;
  label: string;
  iconIdentifier: string;   // Maps to SVG sprite symbol ID or Fluent Emoji key
  completedToday: boolean;
  completedAt?: number;     // Unix timestamp
  isCustom: boolean;
  order: number;
}

export interface StreakRecord {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;  // ISO "YYYY-MM-DD"
  totalCompletions: number;
}

export interface Routine {
  type: RoutineMode;
  tasks: Task[];
  targetTime: string;   // "HH:MM" 24h
  streak: StreakRecord;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  avatarType: AvatarType;
  colour: string;           // Primary accent hex
  routines: {
    morning: Routine;
    evening: Routine;
  };
}

export interface ParentSettings {
  pinHash: string;          // bcrypt hash — never plaintext
  soundEnabled: boolean;
  animationsEnabled: boolean;
  appVersion: string;
}

export interface AppState {
  children: Child[];
  activeMode: RoutineMode;
  activeChildId: string | null;
  settings: ParentSettings;
  lastResetDate: string;    // ISO date — triggers daily task reset
}
```

---

## Default Seed Data

```
Griff  (4, car 🚗)    — colour: #3B82F6 (blue)
Harriet (6, unicorn 🦄) — colour: #EC4899 (pink)
Evie   (8, dragon 🐉)  — colour: #10B981 (green) + #F97316 (flame accent)
```

**Morning tasks (all 3 kids):** Make Bed · Eat Breakfast · Brush Teeth · Get Dressed · Pack Bag · Sunblock · Shoes
**Evening tasks (all 3 kids):** Eat Dinner · Brush Teeth · Bath · Pyjamas · Read · Bedtime

**Target times:**
| | Morning | Evening |
|-|---------|---------|
| Griff | 08:45 | 19:00 |
| Harriet | 08:45 | 19:30 |
| Evie | 08:45 | 20:00 |

---

## Zustand Store Design

```typescript
// src/store/useAppStore.ts — single persisted store, logically sliced

interface ChildrenSlice {
  children: Child[];
  setActiveChild: (id: string | null) => void;
  toggleTask: (childId: string, mode: RoutineMode, taskId: string) => void;
  resetDailyTasks: () => void;
  addTask: (childId: string, mode: RoutineMode, task: Task) => void;
  removeTask: (childId: string, mode: RoutineMode, taskId: string) => void;
  reorderTasks: (childId: string, mode: RoutineMode, ordered: Task[]) => void;
}

interface RoutineSlice {
  activeMode: RoutineMode;
  setActiveMode: (mode: RoutineMode) => void;
  updateTargetTime: (childId: string, mode: RoutineMode, time: string) => void;
}

interface StreakSlice {
  incrementStreak: (childId: string, mode: RoutineMode) => void;
  resetStreak: (childId: string, mode: RoutineMode) => void;
  updateStreakOnLoad: () => void;
}

interface ParentSlice {
  settings: ParentSettings;
  isParentUnlocked: boolean;
  unlockParent: (pin: string) => boolean;
  lockParent: () => void;
  updateSettings: (updates: Partial<ParentSettings>) => void;
  setPin: (newPin: string) => void;
}

interface UISlice {
  celebrationChildId: string | null;
  triggerCelebration: (childId: string) => void;
  dismissCelebration: () => void;
}
```

**Persist config:**
```typescript
persist(store, {
  name: 'unicorn-sparkles-v1',
  partialize: (s) => ({
    children: s.children,
    activeMode: s.activeMode,
    settings: s.settings,
    lastResetDate: s.lastResetDate,
  }),
  version: 1,
  migrate: (state, version) => { /* schema upgrades */ },
})
```

`isParentUnlocked` is intentionally **not** persisted — page reload always requires re-entry of PIN.

---

## Route Structure

```
app/
├── layout.tsx                        # Root: fonts, viewport meta, StoreProvider, daily reset
├── page.tsx                          # / — Dashboard (3 KidCards, ModeToggle, CountdownBar)
├── routine/
│   └── [childId]/
│       ├── layout.tsx                # CountdownBar always visible
│       └── page.tsx                  # Checklist for one child
├── parent/
│   ├── page.tsx                      # PIN gate
│   └── settings/
│       ├── layout.tsx                # Auth guard — redirects if !isParentUnlocked
│       ├── page.tsx                  # Settings hub
│       └── [childId]/
│           └── page.tsx              # Per-child routine editor
└── api/
    └── voice/
        └── transcribe/
            └── route.ts              # POST → Whisper → { transcript, matchedTaskId, confidence }
```

---

## Voice Integration Flow

```
[Kid taps VoiceButton]
  → MediaRecorder captures audio (webm/opus on Chrome, mp4 on Safari)
  → POST /api/voice/transcribe (FormData: audio blob + routineType)
  → Server: Whisper API → transcript string
  → Server: fuzzy match transcript against task labels (Levenshtein + synonyms)
  → Response: { transcript, matchedTaskId, confidence }
  → Client:
      confidence >= 0.7  → auto-complete task, play animation + sound
      0.4–0.7            → show confirmation chip "Did you mean [task]?"
      < 0.4              → toast "Try saying a task name"
      network error      → toast "Not connected"
      mic denied         → VoiceButton hidden / lock icon shown
```

**API route key protection:** `OPENAI_API_KEY` lives in `process.env` server-side only. If absent, route returns 503 and VoiceButton renders as disabled.

---

## localStorage Schema

```json
// Key: "unicorn-sparkles-v1"
{
  "state": {
    "children": [ /* Child[] with routines, tasks, streaks */ ],
    "activeMode": "morning",
    "lastResetDate": "2026-03-27",
    "settings": {
      "pinHash": "$2b$10$...",
      "soundEnabled": true,
      "animationsEnabled": true,
      "appVersion": "1.0.0"
    }
  },
  "version": 1
}

// Key: "unicorn-sparkles-parent-session"
// { "unlockedUntil": 1743100800000 }  — 30-min TTL
```

---

## Package List

```bash
npm install framer-motion lottie-react use-sound zustand canvas-confetti date-fns openai bcryptjs
npm install -D @types/bcryptjs
```

| Package | Role |
|---------|------|
| `framer-motion` | UI animations, page transitions, spring physics |
| `lottie-react` | Character celebration animations (JSON) |
| `use-sound` | React hook over Howler.js — iOS-safe audio |
| `zustand` | State + localStorage persistence |
| `canvas-confetti` | Full-screen confetti on task completion |
| `date-fns` | Countdown math, streak calculations |
| `openai` | Whisper API (server-side only) |
| `bcryptjs` | PIN hashing in browser |

---

## Routine Mode Rules

| Time / Day | Mode |
|-----------|------|
| Weekday, before 15:00 | Morning |
| Weekday, 15:00+ | Evening (auto-switch at 3pm = school finish) |
| Weekend (any time) | Evening only — no morning routine |

Manual toggle overrides auto-detection for the session.

## Streak Rules

- **Morning streak only** (evening routines don't count toward streak)
- Streak increments when: all tasks complete **AND** current time is ≤ 08:45 **AND** it's a weekday
- Weekend days are ignored — no increment, no break
- Streak breaks if a weekday passes without all tasks completed on time
- `streak.lastCompletedDate` stores the last weekday the streak was earned ("YYYY-MM-DD")
- On load: if `lastCompletedDate` is more than 1 weekday ago → streak resets to 0

## Daily Reset Logic

On app mount, `layout.tsx` `useEffect` runs:
```typescript
const stored = useAppStore.getState().lastResetDate;
const today = format(new Date(), 'yyyy-MM-dd');
if (stored !== today) {
  store.resetDailyTasks();   // sets all completedToday = false
  store.updateStreakOnLoad(); // checks if yesterday was completed, updates/breaks streaks
  store.setLastResetDate(today);
}
```

---

## Phase 4: Auth-Ready Abstraction

```typescript
// src/lib/storage/StorageAdapter.ts (Phase 4)
export interface StorageAdapter {
  getState: () => Promise<AppState | null>;
  setState: (state: Partial<AppState>) => Promise<void>;
  clear: () => Promise<void>;
}
// LocalStorageAdapter satisfies this interface.
// SupabaseAdapter (Phase 4+) will too — no component changes required.
```
