'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import CharacterAvatar from '@/components/shared/CharacterAvatar';
import type { Child } from '@/types';

interface CelebrationOverlayProps {
  child: Child;
  taskCount: number;
  onDismiss: () => void;
}

const confettiColors: Record<string, string[]> = {
  griff:   ['#1E40AF', '#3B82F6', '#93C5FD', '#F59E0B'],
  harriet: ['#BE185D', '#EC4899', '#F9A8D4', '#F59E0B'],
  evie:    ['#065F46', '#10B981', '#6EE7B7', '#F97316'],
};

export default function CelebrationOverlay({
  child,
  taskCount,
  onDismiss,
}: CelebrationOverlayProps) {
  const colors = confettiColors[child.colour] ?? ['#7B2FBE', '#C084FC', '#F59E0B'];

  useEffect(() => {
    const opts = {
      particleCount: 80,
      spread: 70,
      startVelocity: 45,
      colors,
    };

    // First burst from both sides
    confetti({ ...opts, origin: { x: 0.2, y: 0.8 } });
    confetti({ ...opts, origin: { x: 0.8, y: 0.8 } });

    // Second burst from top after a beat
    const t = setTimeout(() => {
      confetti({ ...opts, particleCount: 60, startVelocity: 55, origin: { x: 0.5, y: 0.3 } });
    }, 500);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label={`Celebration: ${child.name} completed all tasks`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div className="animate-pop-in">
        <CharacterAvatar avatarType={child.avatarType} size={200} />
      </div>

      <p
        style={{
          fontFamily: 'var(--font-fredoka-one), system-ui',
          fontSize: 32,
          color: 'var(--color-ready)',
          margin: 0,
          lineHeight: 1.1,
          textAlign: 'center',
          letterSpacing: '0.08em',
        }}
      >
        READY SET GO! 🏁
      </p>

      <p
        style={{
          fontFamily: 'var(--font-fredoka-one), system-ui',
          fontSize: 56,
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.1,
          textAlign: 'center',
        }}
      >
        Amazing, {child.name}!
      </p>

      <p
        style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 700,
          fontSize: 28,
          color: '#ffffff',
          margin: 0,
          textAlign: 'center',
        }}
      >
        All {taskCount} tasks done!
      </p>

      {child.streak > 0 && (
        <p
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 24,
            color: 'var(--color-gold)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          {child.streak} day streak!
        </p>
      )}

      <p
        className="animate-pulse-soft"
        style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 700,
          fontSize: 18,
          color: 'rgba(255,255,255,0.7)',
          margin: '24px 0 0',
          textAlign: 'center',
        }}
      >
        Tap anywhere to continue
      </p>

    </div>
  );
}
