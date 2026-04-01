'use client';
import React, { useState } from 'react';
import type { AvatarType } from '@/types';
import { AVATAR_EMOJIS } from '@/lib/avatarUtils';
import { StepDots, PrimaryButton } from './shared';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StepAllSetProps {
  firstName: string;
  firstAvatar: AvatarType;
  firstTaskLabel: string;
  firstTaskIcon: string;
  onFinish: () => void;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// StepAllSet
// ---------------------------------------------------------------------------

export function StepAllSet({
  firstName,
  firstAvatar,
  firstTaskLabel,
  firstTaskIcon,
  onFinish,
  onBack,
}: StepAllSetProps) {
  const [previewChecked, setPreviewChecked] = useState(false);

  const cta = firstName ? `Hand it to ${firstName} →` : "Let's go →";

  const avatarEmoji = AVATAR_EMOJIS[firstAvatar];

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
          <span style={{ fontSize: 36 }}>{avatarEmoji}</span>
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

        {/* Tappable task row */}
        <div
          onClick={() => setPreviewChecked((prev) => !prev)}
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
              border: previewChecked ? 'none' : '2px solid #DDD6FE',
              backgroundColor: previewChecked ? '#22c55e' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.15s ease',
            }}
          >
            {previewChecked ? (
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: 1 }}>✓</span>
            ) : null}
          </div>
          <span style={{ fontSize: 22 }}>{firstTaskIcon}</span>
          <span
            style={{
              fontFamily: 'var(--font-nunito), system-ui',
              fontWeight: 600,
              fontSize: 16,
              color: 'var(--color-text)',
            }}
          >
            {firstTaskLabel}
          </span>
        </div>
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
        This is exactly what {firstName || 'your child'} will see each morning. Give it a try.
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
            {firstName ? `${firstName} will get to pick their own avatar first.` : 'They\'ll get to pick their own avatar first.'}
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
