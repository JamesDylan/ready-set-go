'use client';
import React from 'react';
import { StepDots, PrimaryButton } from './shared';

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <StepDots step={1} total={4} />
      <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 24 }}>🦄</div>
      <h1
        style={{
          fontFamily: 'var(--font-fredoka-one), system-ui',
          fontSize: 36,
          color: 'var(--color-brand)',
          margin: '0 0 16px',
          lineHeight: 1.2,
        }}
      >
        Welcome to Unicorn Sparkles!
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 600,
          fontSize: 17,
          color: 'var(--color-text)',
          opacity: 0.75,
          margin: '0 0 40px',
          lineHeight: 1.5,
        }}
      >
        Quick setup for your family&apos;s morning and bedtime routines.
        <br />
        Takes about 2 minutes — and everything can be changed later.
      </p>
      <PrimaryButton onClick={onNext}>Get started →</PrimaryButton>
    </div>
  );
}
