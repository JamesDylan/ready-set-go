'use client';
import React from 'react';
import type { AvatarType } from '@/types';
import type { AgeBand } from '@/lib/seedData';

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface ChildSlot {
  id: string;
  name: string;
  ageBand: AgeBand;
  avatar: AvatarType;
  eveningTarget: string;
}

export function emptySlot(): ChildSlot {
  return {
    id: `child-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
    name: '',
    ageBand: 'school',
    avatar: 'unicorn',
    eveningTarget: '19:00',
  };
}

// ---------------------------------------------------------------------------
// StepDots
// ---------------------------------------------------------------------------

export function StepDots({
  step,
  total,
  onBack,
}: {
  step: number;
  total: number;
  onBack?: () => void;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 14,
            color: 'var(--color-brand)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 8px',
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            opacity: 0.8,
          }}
        >
          ← Back
        </button>
      )}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: n <= step ? 'var(--color-brand)' : '#DDD6FE',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PrimaryButton
// ---------------------------------------------------------------------------

export function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: 'var(--font-fredoka-one), system-ui',
        fontSize: 20,
        backgroundColor: disabled ? '#C084FC' : 'var(--color-brand)',
        color: '#fff',
        border: 'none',
        borderRadius: 16,
        padding: '14px 28px',
        minHeight: 52,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: '100%',
        transition: 'background-color 0.2s ease',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}
