'use client';
import type { RoutineMode } from '@/types';
import { playSound } from '@/lib/playSound';

interface ModeToggleProps {
  currentMode: RoutineMode;
  onToggle: (mode: RoutineMode) => void;
}

export default function ModeToggle({ currentMode, onToggle }: ModeToggleProps) {
  const pills: Array<{ mode: RoutineMode; label: string }> = [
    { mode: 'morning', label: '☀️ Morning' },
    { mode: 'evening', label: '🌙 Evening' },
  ];

  function handleClick(mode: RoutineMode) {
    if (mode === currentMode) return;
    playSound('/sounds/swap-effect.mp3', 0.6);
    onToggle(mode);
  }

  return (
    <div className="flex items-center gap-2">
      {pills.map(({ mode, label }) => {
        const isActive = mode === currentMode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => handleClick(mode)}
            className="h-11 px-6 rounded-full text-lg transition-colors"
            style={
              isActive
                ? {
                    backgroundColor: 'var(--color-brand)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-fredoka-one), system-ui',
                    border: '2px solid var(--color-brand)',
                    cursor: 'default',
                  }
                : {
                    backgroundColor: 'transparent',
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-fredoka-one), system-ui',
                    border: '2px solid var(--color-text)',
                    cursor: 'pointer',
                  }
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
