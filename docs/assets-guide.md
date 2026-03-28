# unicorn-sparkles — Asset Sourcing Guide

Assets needed: Lottie character animations (car, unicorn, dragon) + royalty-free sounds (cute/magical).

---

## Lottie Animations

### How to search LottieFiles

Go to `https://lottiefiles.com/search`, apply:
- **License filter:** Free
- **Sort:** Popular first, then Newest second pass
- Check file size on the detail page — reject >150KB JSON

### Search terms by character

| Character             | Idle search                                           | Celebrate search                               | What to look for                                                                |
| --------------------- | ----------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| **Griff** (car)       | `toy car animation`, `cute car bounce`                | `car zoom celebration`, `car honk confetti`    | Rounded body, large windscreen eyes, pastel colours. Avoid realistic chrome.    |
| **Harriet** (unicorn) | `unicorn idle sparkle`, `cute unicorn magic`          | `unicorn rainbow fly`, `unicorn victory dance` | Pinks, purples, gold. No dark backgrounds.                                      |
| **Evie** (dragon)     | `cute dragon wing flutter`, `friendly dragon idle`    | `dragon fire sparkle`, `dragon fly happy`      | Chibi/round body, non-scary fire (orange sparkle not red flames), greens/teals. |
| **Micro-animations**  | `confetti burst`, `star sparkle`, `checkmark success` | —                                              | Transparent background (no solid fill). Under 50KB.                             |

### Creators worth checking
- Car: `@motionisland`, `@lord`
- Unicorn: `@dan_powell`, `@sarthak_mehta`
- Dragon: `@bram_vanhaeren`, `@amitdebnath`

### JSON vs dotLottie — use JSON

dotLottie saves 30–60% file size but requires `@lottiefiles/dotlottie-react` (~50KB extra bundle). Not worth it for this project. Use classic JSON + `lottie-react`.

### File size budget

| Asset | Target | Hard limit |
|-------|--------|-----------|
| Character idle (JSON) | 40–80 KB | 150 KB |
| Character celebrate (JSON) | 30–60 KB | 100 KB |
| Micro-animation | 10–30 KB | 50 KB |

### Implementation notes
- Pause idle animations when off-screen (IntersectionObserver) — saves CPU/battery
- Pre-fetch celebrate JSON during idle phase so there's zero delay when task completes
- Lazy-load per child — Griff's assets shouldn't load until Griff's panel mounts

---

## Sound Effects

### Sources (no attribution required)

| Source        | URL                           | Best for                                            |
| ------------- | ----------------------------- | --------------------------------------------------- |
| **Mixkit**    | mixkit.co/free-sound-effects/ | Main source — dedicated Magic & Kids categories     |
| **Pixabay**   | pixabay.com/sound-effects/    | Gap-filler, CC0                                     |
| **Freesound** | freesound.org (filter CC0)    | Ambient loops                                       |
| Zapsplat      | zapsplat.com                  | Good quality but requires in-app attribution credit |

### Required sounds + where to find them

| Sound            | Source               | Search term                            | Duration      | Notes                                     |
| ---------------- | -------------------- | -------------------------------------- | ------------- | ----------------------------------------- |
| Task complete    | Mixkit → Magic       | `fairy chime`, `soft ding`             | 0.5–0.8s      | Single ascending note, not a jingle       |
| All tasks done   | Mixkit → Magic       | `magical fanfare`, `fairy celebration` | 1.5–2s        | Light triumphant — avoid brass stabs      |
| Mode switch      | Pixabay              | `swoosh chime`, `transition bell`      | 0.3–0.5s      | Short whoosh + bell tail                  |
| Streak milestone | Mixkit → Game Sounds | `coin collect`, `star chime`           | 0.4–0.6s      | Ascending arpeggio = universally "reward" |
| Error/undo       | Pixabay              | `soft descending tone`, `gentle error` | 0.3s          | Never a buzzer — gentle descend only      |
| Celebration loop | Freesound CC0        | `fairy sparkle loop`, `sparkle loop`   | 2–3s loopable | Check loop seam for clicks                |

### Direct Mixkit categories to browse
- `mixkit.co/free-sound-effects/magic/` — covers task complete, all-done, ambient sparkle
- `mixkit.co/free-sound-effects/game/` — streak milestone
- `mixkit.co/free-sound-effects/notification/` — mode switch

### File size budget

| Asset | Target | Hard limit |
|-------|--------|-----------|
| UI sound (task complete, switch) | 20–40 KB MP3 | 80 KB |
| Celebration fanfare | 60–100 KB MP3 | 150 KB |
| Ambient loop | 80–120 KB MP3 | 200 KB |

### iOS Safari gotchas
1. **Sound must be triggered by a user gesture** — wire completion sound to the exact tap event, never via setTimeout or animation callback
2. **Unlock AudioContext on first tap** (e.g. the opening "Let's go!" button) to avoid 200–400ms delay on first play
3. **Use MP3, not OGG** — iOS Safari doesn't support OGG
4. Use Web Audio API (`AudioContext` + `BufferSourceNode`) not `<audio>` tags — lower latency on mobile

---

## Asset download checklist

- [ ] Griff idle animation (car) — JSON, <150KB, transparent bg, loops cleanly
- [ ] Griff celebrate animation (car zooms/honks) — JSON, <100KB, single play
- [ ] Harriet idle animation (unicorn sparkles) — JSON, <150KB
- [ ] Harriet celebrate animation (unicorn flies rainbow arc) — JSON, <100KB
- [ ] Evie idle animation (dragon wing flutter) — JSON, <150KB
- [ ] Evie celebrate animation (dragon sparkle fire) — JSON, <100KB
- [ ] Task complete micro-animation (star burst / confetti) — JSON, <50KB
- [ ] Sound: task-complete.mp3 (<80KB)
- [ ] Sound: all-done.mp3 (<150KB)
- [ ] Sound: mode-switch.mp3 (<80KB)
- [ ] Sound: streak-milestone.mp3 (<80KB)
- [ ] Sound: error-undo.mp3 (<80KB)
- [ ] Sound: celebration-loop.mp3 (<200KB, check loop seam)

Place sounds in `public/sounds/`, Lottie JSON in `public/animations/`.
