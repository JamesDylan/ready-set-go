'use client';
import { memo, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { TASK_ICON_MAP } from '@/lib/taskIcons';
import type { Child, RoutineMode } from '@/types';
import CharacterAvatar from '@/components/shared/CharacterAvatar';
import ProgressRing from '@/components/routine/ProgressRing';
import CelebrationOverlay from '@/components/routine/CelebrationOverlay';
import { useAppStore } from '@/store/useAppStore';
import { playSound } from '@/lib/playSound';

const kidConfettiColors: Record<string, string[]> = {
  griff:   ['#1E40AF', '#3B82F6', '#93C5FD', '#F59E0B'],
  harriet: ['#BE185D', '#EC4899', '#F9A8D4', '#F59E0B'],
  evie:    ['#065F46', '#10B981', '#6EE7B7', '#F97316'],
};

interface KidCardProps {
  child: Child;
  mode: RoutineMode;
}

function KidCard({ child, mode }: KidCardProps) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedThisSession, setCompletedThisSession] = useState(false);
  const [undoHintTaskId, setUndoHintTaskId] = useState<string | null>(null);
  const lastToggleRef = useRef<number>(0);

  const tasks = mode === 'morning' ? child.morningTasks : child.eveningTasks;
  const completed = tasks.filter((t) => t.isComplete).length;
  const total = tasks.length;
  const progress = total > 0 ? completed / total : 0;
  const allDone = completed === total && total > 0;

  // Reset tracking when mode switches — must be defined BEFORE the allDone effect
  // so React runs it first within the same render, preventing false celebrations
  const prevAllDone = useRef(allDone);
  useEffect(() => {
    prevAllDone.current = allDone;
    setCompletedThisSession(false);
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fire the completion sound exactly once when all tasks are done
  useEffect(() => {
    if (allDone && !prevAllDone.current) {
      playSound('/sounds/checklist-completed.mp3', 0.8);
      setShowCelebration(true);
      setCompletedThisSession(true);
    }
    prevAllDone.current = allDone;
  }, [allDone]);

  const accentColor = `var(--color-${child.colour})`;
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  function handleTaskTap(event: React.MouseEvent<HTMLButtonElement>, taskId: string, wasComplete: boolean) {
    // Debounce: ignore taps within 500ms of last toggle to prevent double-tap accidents
    // eslint-disable-next-line react-hooks/purity -- event handler, not render
    const now = Date.now();
    if (now - lastToggleRef.current < 500) return;
    lastToggleRef.current = now;

    if (wasComplete) {
      // Show a brief hint so un-checking feels intentional
      setUndoHintTaskId(taskId);
      setTimeout(() => setUndoHintTaskId(null), 1000);
    } else {
      // Play sound and fire a mini confetti burst from the tapped card
      playSound('/sounds/item-completed.mp3', 0.7);
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 18,
        spread: 55,
        startVelocity: 22,
        colors: kidConfettiColors[child.colour] ?? ['#7B2FBE', '#C084FC', '#F59E0B'],
        origin: { x, y },
        scalar: 0.85,
        gravity: 1.3,
      });
    }
    toggleTask(child.id, taskId);
  }

  return (
    <>
      {showCelebration && (
      <CelebrationOverlay
        child={child}
        taskCount={total}
        mode={mode}
        onDismiss={() => setShowCelebration(false)}
      />
    )}
    <div
      className="flex flex-col rounded-3xl overflow-hidden"
      style={{
        backgroundColor: allDone
          ? `color-mix(in srgb, ${accentColor} 6%, var(--color-surface))`
          : 'var(--color-surface)',
        border: `3px solid ${accentColor}`,
        backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${accentColor} 18%, transparent) 0%, transparent 56px)`,
        boxShadow: allDone
          ? `0 4px 0px rgba(0,0,0,0.12), 0 8px 28px color-mix(in srgb, ${accentColor} 30%, transparent)`
          : '0 4px 0px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)',
        flex: 1,
        transition: 'box-shadow 0.4s ease, background-color 0.4s ease',
      }}
    >

      {/* Kid header */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ height: 72, flexShrink: 0, borderBottom: '1px solid color-mix(in srgb, var(--color-text) 10%, transparent)' }}
      >
        {/* Avatar inside progress ring */}
        <div className="relative flex-shrink-0" style={{ width: 60, height: 60 }}>
          <ProgressRing progress={progress} size={60} color={accentColor} strokeWidth={4} />
          <div className="absolute inset-0 flex items-center justify-center">
            <CharacterAvatar avatarType={child.avatarType} size={48} />
          </div>
        </div>

        {/* Name + streak */}
        <div className="flex flex-col flex-1 min-w-0">
          <span
            style={{
              fontFamily: 'var(--font-fredoka-one), system-ui',
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--color-text)',
              lineHeight: 1.1,
            }}
          >
            {child.name}
          </span>
          {(() => {
            const streak = mode === 'morning'
              ? (child.morningStreak ?? child.streak ?? 0)
              : (child.eveningStreak ?? child.streak ?? 0);
            return streak > 0 ? (
              <span
                style={{
                  fontFamily: 'var(--font-nunito), system-ui',
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'var(--color-gold)',
                }}
              >
                🔥 {streak} day streak
              </span>
            ) : null;
          })()}
          {mode === 'evening' && (
            <span style={{
              fontFamily: 'var(--font-nunito), system-ui',
              fontWeight: 700,
              fontSize: 12,
              color: 'var(--color-brand)',
              opacity: 0.8,
            }}>
              🌙 Bedtime {child.eveningTarget}
            </span>
          )}
        </div>

        {/* Progress count */}
        <span
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 16,
            color: allDone ? 'var(--color-go)' : accentColor,
            flexShrink: 0,
          }}
        >
          {completed}/{total}{allDone ? ' 🎉' : ''}
        </span>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto">
        {sortedTasks.map((task, index) => {
          const isLast = index === sortedTasks.length - 1;
          return (
            <button
              key={task.id}
              type="button"
              onClick={(e) => handleTaskTap(e, task.id, task.isComplete)}
              className="flex items-center gap-3 px-4 w-full text-left"
              style={{
                height: 68,
                backgroundColor: task.isComplete ? `color-mix(in srgb, var(--color-${child.colour}) 10%, var(--color-surface, #fff))` : 'transparent',
                border: 'none',
                borderBottom: isLast ? 'none' : '1px solid color-mix(in srgb, var(--color-text) 10%, transparent)',
                cursor: 'pointer',
                flexShrink: 0,
                WebkitTapHighlightColor: 'transparent',
                transition: 'background-color 0.15s ease',
              }}
              aria-label={`${task.label} — ${task.isComplete ? 'done' : 'tap to complete'}`}
              aria-pressed={task.isComplete}
            >
              {/* Task icon — Phosphor if mapped, emoji fallback */}
              {(() => {
                const PhosphorIcon = TASK_ICON_MAP[task.label];
                if (PhosphorIcon) {
                  return (
                    <PhosphorIcon
                      size={30}
                      weight="bold"
                      color={task.isComplete ? `var(--color-${child.colour})` : 'var(--color-text)'}
                      style={{ flexShrink: 0, opacity: task.isComplete ? 0.45 : 1, transition: 'opacity 0.2s ease' }}
                    />
                  );
                }
                return (
                  <span
                    style={{
                      fontSize: 30,
                      lineHeight: 1,
                      flexShrink: 0,
                      opacity: task.isComplete ? 0.45 : 1,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {task.icon}
                  </span>
                );
              })()}

              {/* Task label */}
              <span
                style={{
                  fontFamily: 'var(--font-nunito), system-ui',
                  fontWeight: 600,
                  fontSize: 17,
                  color: task.isComplete ? 'color-mix(in srgb, var(--color-text) 38%, transparent)' : 'var(--color-text)',
                  textDecoration: task.isComplete ? 'line-through' : 'none',
                  flex: 1,
                  transition: 'color 0.2s ease',
                }}
              >
                {task.label}
                {undoHintTaskId === task.id && (
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-nunito), system-ui',
                      fontWeight: 700,
                      fontSize: 12,
                      color: '#10B981',
                      textDecoration: 'none',
                      marginTop: 2,
                    }}
                  >
                    Already done! ✓
                  </span>
                )}
              </span>

              {/* Completion circle */}
              <div
                key={task.isComplete ? `${task.id}-done` : `${task.id}-todo`}
                className={task.isComplete ? 'animate-check-bounce' : ''}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '14px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: task.isComplete ? accentColor : 'transparent',
                  border: task.isComplete ? 'none' : `2.5px solid color-mix(in srgb, ${accentColor} 60%, transparent)`,
                  color: '#fff',
                  fontSize: 22,
                  fontWeight: 900,
                  boxShadow: task.isComplete ? `0 2px 10px color-mix(in srgb, ${accentColor} 55%, transparent)` : 'none',
                }}
              >
                {task.isComplete ? '✓' : ''}
              </div>
            </button>
          );
        })}

        {/* All done banner */}
        {allDone && completedThisSession && (
          <div
            className="animate-pop-in"
            style={{
              margin: '8px 16px 12px',
              padding: '12px',
              background: `linear-gradient(135deg, #D1FAE5, #A7F3D0)`,
              borderRadius: 14,
              textAlign: 'center',
              fontFamily: 'var(--font-fredoka-one), system-ui',
              fontSize: 18,
              color: '#065F46',
            }}
          >
            🎉 Amazing, {child.name}!
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default memo(KidCard);
