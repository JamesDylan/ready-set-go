'use client';
import React from 'react';
import type { AgeBand } from '@/lib/seedData';
import { makeMorningTasksForOnboarding, makeEveningTasksForOnboarding } from '@/lib/seedData';
import { StepDots, PrimaryButton } from './shared';
import { AddTaskRow } from './AddTaskRow';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StepRoutinesProps {
  firstChildAgeBand: AgeBand;
  selectedMorning: Set<string>;
  selectedEvening: Set<string>;
  onMorningToggle: (label: string) => void;
  onEveningToggle: (label: string) => void;
  morningTarget: string;
  onMorningTargetChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  slotCount: number;
  customMorningTasks: { label: string; icon: string }[];
  customEveningTasks: { label: string; icon: string }[];
  onAddMorningTask: (label: string, icon: string) => void;
  onAddEveningTask: (label: string, icon: string) => void;
}

// ---------------------------------------------------------------------------
// TaskToggleRow
// ---------------------------------------------------------------------------

interface TaskToggleRowProps {
  icon: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

function TaskToggleRow({ icon, label, checked, onToggle }: TaskToggleRowProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 4px',
        minHeight: 44,
        cursor: 'pointer',
        borderRadius: 8,
        transition: 'background-color 0.1s ease',
      }}
    >
      {/* Checkbox circle */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: checked ? 'none' : '2px solid #DDD6FE',
          backgroundColor: checked ? '#22c55e' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.15s ease',
        }}
      >
        {checked ? (
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, lineHeight: 1 }}>✓</span>
        ) : null}
      </div>
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 600,
          fontSize: 15,
          color: 'var(--color-text)',
          opacity: checked ? 1 : 0.55,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StepRoutines
// ---------------------------------------------------------------------------

export function StepRoutines({
  firstChildAgeBand,
  selectedMorning,
  selectedEvening,
  onMorningToggle,
  onEveningToggle,
  morningTarget,
  onMorningTargetChange,
  onNext,
  onBack,
  slotCount,
  customMorningTasks,
  customEveningTasks,
  onAddMorningTask,
  onAddEveningTask,
}: StepRoutinesProps) {
  const morningTasks = makeMorningTasksForOnboarding(firstChildAgeBand);
  const eveningTasks = makeEveningTasksForOnboarding(firstChildAgeBand);

  return (
    <div>
      <StepDots step={3} total={4} onBack={onBack} />
      <h1
        style={{
          fontFamily: 'var(--font-fredoka-one), system-ui',
          fontSize: 30,
          color: 'var(--color-brand)',
          margin: '0 0 8px',
        }}
      >
        Here&apos;s a starter routine
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 600,
          fontSize: 14,
          color: 'var(--color-text)',
          opacity: 0.65,
          margin: '0 0 12px',
          lineHeight: 1.5,
        }}
      >
        We&apos;ve picked age-appropriate tasks. Turn off any that don&apos;t fit &mdash; or add your own.
      </p>

      {slotCount > 1 && (
        <p style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 600,
          fontSize: 13,
          color: '#92400E',
          backgroundColor: '#FEF3C7',
          borderRadius: 8,
          padding: '8px 12px',
          margin: '0 0 16px',
          lineHeight: 1.5,
        }}>
          Using the same tasks for all children &mdash; customise each child from their profile later.
        </p>
      )}

      {/* Task lists — stacked on mobile, side by side on sm+ */}
      <div className="flex flex-col sm:flex-row" style={{ gap: 12, marginBottom: 24 }}>
        {/* Morning */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'var(--color-bg)',
            borderRadius: 16,
            padding: 16,
            border: '1.5px solid #DDD6FE',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-fredoka-one), system-ui',
              fontSize: 16,
              color: 'var(--color-brand)',
              marginBottom: 10,
            }}
          >
            ☀️ Morning
          </div>
          {morningTasks.map((t) => (
            <TaskToggleRow
              key={t.label}
              icon={t.icon}
              label={t.label}
              checked={selectedMorning.has(t.label)}
              onToggle={() => onMorningToggle(t.label)}
            />
          ))}
          {customMorningTasks.map((t) => (
            <TaskToggleRow
              key={t.label}
              icon={t.icon}
              label={t.label}
              checked={selectedMorning.has(t.label)}
              onToggle={() => onMorningToggle(t.label)}
            />
          ))}
          <AddTaskRow
            onAdd={onAddMorningTask}
            maxReached={customMorningTasks.length >= 3}
          />
        </div>

        {/* Evening */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'var(--color-bg)',
            borderRadius: 16,
            padding: 16,
            border: '1.5px solid #DDD6FE',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-fredoka-one), system-ui',
              fontSize: 16,
              color: 'var(--color-brand)',
              marginBottom: 10,
            }}
          >
            🌙 Evening
          </div>
          {eveningTasks.map((t) => (
            <TaskToggleRow
              key={t.label}
              icon={t.icon}
              label={t.label}
              checked={selectedEvening.has(t.label)}
              onToggle={() => onEveningToggle(t.label)}
            />
          ))}
          {customEveningTasks.map((t) => (
            <TaskToggleRow
              key={t.label}
              icon={t.icon}
              label={t.label}
              checked={selectedEvening.has(t.label)}
              onToggle={() => onEveningToggle(t.label)}
            />
          ))}
          <AddTaskRow
            onAdd={onAddEveningTask}
            maxReached={customEveningTasks.length >= 3}
          />
        </div>
      </div>

      {/* Global school-ready time */}
      <div style={{ marginBottom: 28 }}>
        <label
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--color-text)',
            opacity: 0.7,
            display: 'block',
            marginBottom: 6,
          }}
        >
          🏫 Need to leave by (optional)
        </label>
        <input
          type="time"
          value={morningTarget}
          onChange={(e) => onMorningTargetChange(e.target.value)}
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid #DDD6FE',
            borderRadius: 12,
            padding: '10px 14px',
            minHeight: 48,
            width: '100%',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
      </div>

      <p style={{
        fontFamily: 'var(--font-nunito), system-ui',
        fontWeight: 600,
        fontSize: 13,
        color: 'var(--color-brand)',
        backgroundColor: '#F3E8FF',
        borderRadius: 10,
        padding: '10px 14px',
        margin: '0 0 16px',
        lineHeight: 1.5,
      }}>
        Not sure? Leave the defaults &mdash; you can fine-tune tasks any time.
      </p>

      <PrimaryButton onClick={onNext}>Continue →</PrimaryButton>
    </div>
  );
}
