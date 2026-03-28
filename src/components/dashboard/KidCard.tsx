'use client';
import { useEffect, useRef, useState } from 'react';
import type { Child, RoutineMode } from '@/types';
import CharacterAvatar from '@/components/shared/CharacterAvatar';
import ProgressRing from '@/components/routine/ProgressRing';
import CelebrationOverlay from '@/components/routine/CelebrationOverlay';
import { useAppStore } from '@/store/useAppStore';
import { playSound } from '@/lib/playSound';

interface KidCardProps {
  child: Child;
  mode: RoutineMode;
}

export default function KidCard({ child, mode }: KidCardProps) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedThisSession, setCompletedThisSession] = useState(false);
  const [undoHintTaskId, setUndoHintTaskId] = useState<string | null>(null);

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

  function handleTaskTap(taskId: string, wasComplete: boolean) {
    if (wasComplete) {
      // Allow un-checking but show a brief hint so it feels intentional
      setUndoHintTaskId(taskId);
      setTimeout(() => setUndoHintTaskId(null), 1000);
    } else {
      // Only play the sound when completing a task, not when un-checking
      playSound('/sounds/item-completed.mp3', 0.7);
    }
    toggleTask(child.id, taskId);
  }

  return (
    <>
    {showCelebration && (
      <CelebrationOverlay
        child={child}
        taskCount={total}
        onDismiss={() => setShowCelebration(false)}
      />
    )}
    <div
      className="flex flex-col rounded-3xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        boxShadow: allDone
          ? `0 4px 20px color-mix(in srgb, ${accentColor} 40%, transparent)`
          : '0 2px 12px rgba(0,0,0,0.08)',
        borderLeft: `4px solid ${accentColor}`,
        flex: 1,
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Top accent strip */}
      <div style={{ height: 6, backgroundColor: accentColor, flexShrink: 0 }} />

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
              fontSize: 22,
              color: 'var(--color-text)',
              lineHeight: 1.2,
            }}
          >
            {child.name}
          </span>
          {child.streak > 0 && (
            <span
              style={{
                fontFamily: 'var(--font-nunito), system-ui',
                fontWeight: 700,
                fontSize: 13,
                color: 'var(--color-gold)',
              }}
            >
              🔥 {child.streak} day streak
            </span>
          )}
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
            color: allDone ? '#10B981' : accentColor,
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
              onClick={() => handleTaskTap(task.id, task.isComplete)}
              className="flex items-center gap-3 px-4 w-full text-left"
              style={{
                height: 68,
                backgroundColor: task.isComplete ? 'color-mix(in srgb, var(--color-success, #10B981) 12%, var(--color-surface, #fff))' : 'transparent',
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
              {/* Emoji icon */}
              <span
                style={{
                  fontSize: 36,
                  lineHeight: 1,
                  flexShrink: 0,
                  opacity: task.isComplete ? 0.45 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {task.icon}
              </span>

              {/* Task label */}
              <span
                style={{
                  fontFamily: 'var(--font-nunito), system-ui',
                  fontWeight: 700,
                  fontSize: 17,
                  color: task.isComplete ? 'color-mix(in srgb, var(--color-text) 45%, transparent)' : 'var(--color-text)',
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
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: task.isComplete ? '#10B981' : 'transparent',
                  border: task.isComplete ? 'none' : `2px solid ${accentColor}`,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 700,
                  transition: 'background-color 0.2s ease, border 0.2s ease',
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
