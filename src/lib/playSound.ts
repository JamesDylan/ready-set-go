/** Fire-and-forget sound playback. Safe to call on any tap event. */
export function playSound(src: string, volume = 0.7): void {
  if (typeof window === 'undefined') return;
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {
    // Browser may block autoplay before first user gesture — silently ignore
  });
}
