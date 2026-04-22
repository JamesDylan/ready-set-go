'use client';
import React, { useState } from 'react';
import type { AvatarType } from '@/types';
import { StepDots, PrimaryButton } from './shared';
import CharacterAvatar from '@/components/shared/CharacterAvatar';
import { TASK_ICON_MAP } from '@/lib/taskIcons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StepAllSetProps {
  firstName: string;
  firstAvatar: AvatarType;
  morningTasks: { label: string; icon: string }[];
  onFinish: () => void;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// StepAllSet
// ---------------------------------------------------------------------------

export function StepAllSet({
  firstName,
  firstAvatar,
  morningTasks,
  onFinish,
  onBack,
}: StepAllSetProps) {
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());

  const cta = firstName ? `Let's go, ${firstName}! →` : "Let's go →";
  const displayTasks = morningTasks.length > 0
    ? morningTasks.slice(0, 4)
    : [{ label: 'Make Bed', icon: '🛏️' }];

  function toggleCheck(i: number) {
    setCheckedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <StepDots step={4} total={4} onBack={onBack} />

      <div
        className="animate-pop-in"
        style={{ fontSize: 'clamp(48px, 10vw, 80px)', lineHeight: 1, marginBottom: 16 }}
      >
        🎉
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-fredoka-one), system-ui',
          fontSize: 32,
          color: 'var(--color-brand)',
          margin: '0 0 16px',
          lineHeight: 1.2,
        }}
      >
        {firstName ? `${firstName} is ready to go!` : 'All set!'}
      </h1>

      {/* Mini preview card */}
      <div
        style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 20,
          padding: '20px 24px',
          border: '1.5px solid #DDD6FE',
          marginBottom: 12,
          textAlign: 'left',
        }}
      >
        {/* Child avatar + name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <CharacterAvatar avatarType={firstAvatar} size={40} />
          <span
            style={{
              fontFamily: 'var(--font-fredoka-one), system-ui',
              fontSize: 22,
              color: 'var(--color-brand)',
            }}
          >
            {firstName || 'Your child'}
          </span>
        </div>

        {/* Tappable task rows */}
        {displayTasks.map((task, i) => {
          const PhosphorIcon = TASK_ICON_MAP[task.label];
          const isChecked = checkedIndices.has(i);
          return (
            <div
              key={task.label}
              onClick={() => toggleCheck(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                padding: '8px 4px',
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: isChecked ? 'none' : '2px solid #DDD6FE',
                  backgroundColor: isChecked ? '#22c55e' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background-color 0.15s ease',
                }}
              >
                {isChecked && (
                  <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: 1 }}>✓</span>
                )}
              </div>
              {PhosphorIcon ? (
                <PhosphorIcon
                  size={22}
                  weight="bold"
                  style={{ color: 'var(--color-brand)', flexShrink: 0 }}
                />
              ) : (
                <span style={{ fontSize: 22, flexShrink: 0 }}>{task.icon}</span>
              )}
              <span
                style={{
                  fontFamily: 'var(--font-nunito), system-ui',
                  fontWeight: 600,
                  fontSize: 16,
                  color: 'var(--color-text)',
                }}
              >
                {task.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Card label */}
      <p
        style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 600,
          fontSize: 13,
          color: 'var(--color-text)',
          opacity: 0.6,
          margin: '0 0 20px',
        }}
      >
        Here&apos;s a taste of {firstName ? `${firstName}'s` : "your child's"} morning routine. Give it a try!
      </p>

      {/* Handoff prompt */}
      <div style={{
        backgroundColor: 'var(--color-bg)',
        border: '1.5px solid #DDD6FE',
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>🤝</span>
        <div>
          <p style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--color-text)',
            margin: '0 0 4px',
          }}>
            {firstName ? `Ready to hand it to ${firstName}?` : 'Ready to hand it over?'}
          </p>
          <p style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 600,
            fontSize: 13,
            color: 'var(--color-text)',
            opacity: 0.65,
            margin: 0,
          }}>
            Tap each task to tick it off. Streaks build day by day!
          </p>
        </div>
      </div>

      {/* PIN tip */}
      <p style={{
        fontFamily: 'var(--font-nunito), system-ui',
        fontWeight: 600,
        fontSize: 13,
        color: 'var(--color-text)',
        opacity: 0.5,
        textAlign: 'center',
        margin: '0 0 20px',
        lineHeight: 1.5,
      }}>
        To change settings later, tap the 🔒 — you&apos;ll set a parent PIN there.
      </p>

      <PrimaryButton onClick={onFinish}>{cta}</PrimaryButton>
    </div>
  );
}
