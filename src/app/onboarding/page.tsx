'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { makeMorningTasksForOnboarding, makeEveningTasksForOnboarding } from '@/lib/seedData';
import type { AvatarType, Child } from '@/types';

// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return `child-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

const AVATAR_COLOUR_MAP: Record<AvatarType, string> = {
  car: 'griff',
  unicorn: 'harriet',
  axolotl: 'evie',
};

const AVATAR_OPTIONS: { type: AvatarType; emoji: string; label: string }[] = [
  { type: 'car', emoji: '🚗', label: 'Car' },
  { type: 'unicorn', emoji: '🦄', label: 'Unicorn' },
  { type: 'axolotl', emoji: '🦎', label: 'Axolotl' },
];

interface ChildSlot {
  id: string;
  name: string;
  age: number;
  avatar: AvatarType;
}

function emptySlot(): ChildSlot {
  return { id: generateId(), name: '', age: 5, avatar: 'unicorn' };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StepDots({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
      {[1, 2, 3, 4].map((n) => (
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
  );
}

function PrimaryButton({
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

// ---------------------------------------------------------------------------
// Step 1: Welcome
// ---------------------------------------------------------------------------

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <StepDots step={1} />
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
        Let&apos;s set up your family&apos;s morning and bedtime routines.
        <br />
        It only takes a minute.
      </p>
      <PrimaryButton onClick={onNext}>Let&apos;s go →</PrimaryButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Add children
// ---------------------------------------------------------------------------

function ChildSlotRow({
  slot,
  onChange,
}: {
  slot: ChildSlot;
  onChange: (updated: ChildSlot) => void;
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        borderRadius: 16,
        padding: '16px',
        marginBottom: 12,
        border: '1.5px solid #DDD6FE',
      }}
    >
      {/* Name input */}
      <input
        type="text"
        placeholder="Child's name"
        value={slot.name}
        onChange={(e) => onChange({ ...slot, name: e.target.value })}
        style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 700,
          fontSize: 18,
          color: 'var(--color-text)',
          backgroundColor: 'var(--color-surface)',
          border: '1.5px solid #DDD6FE',
          borderRadius: 12,
          padding: '10px 14px',
          width: '100%',
          boxSizing: 'border-box',
          marginBottom: 12,
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Age stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: 'var(--font-nunito), system-ui',
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--color-text)',
              opacity: 0.6,
            }}
          >
            Age
          </span>
          <button
            type="button"
            onClick={() => onChange({ ...slot, age: Math.max(2, slot.age - 1) })}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: '1.5px solid #DDD6FE',
              backgroundColor: 'var(--color-surface)',
              fontFamily: 'var(--font-fredoka-one), system-ui',
              fontSize: 20,
              color: 'var(--color-brand)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            −
          </button>
          <span
            style={{
              fontFamily: 'var(--font-fredoka-one), system-ui',
              fontSize: 22,
              color: 'var(--color-text)',
              minWidth: 28,
              textAlign: 'center',
            }}
          >
            {slot.age}
          </span>
          <button
            type="button"
            onClick={() => onChange({ ...slot, age: Math.min(12, slot.age + 1) })}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: '1.5px solid #DDD6FE',
              backgroundColor: 'var(--color-surface)',
              fontFamily: 'var(--font-fredoka-one), system-ui',
              fontSize: 20,
              color: 'var(--color-brand)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            +
          </button>
        </div>

        {/* Avatar picker */}
        <div style={{ display: 'flex', gap: 8 }}>
          {AVATAR_OPTIONS.map(({ type, emoji, label }) => (
            <button
              key={type}
              type="button"
              aria-label={label}
              onClick={() => onChange({ ...slot, avatar: type })}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                border: slot.avatar === type ? '2.5px solid var(--color-brand)' : '2px solid #DDD6FE',
                backgroundColor: slot.avatar === type ? '#F3E8FF' : 'var(--color-surface)',
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepChildren({
  slots,
  onSlotsChange,
  onNext,
}: {
  slots: ChildSlot[];
  onSlotsChange: (slots: ChildSlot[]) => void;
  onNext: () => void;
}) {
  const canContinue = slots.some((s) => s.name.trim().length > 0);

  function updateSlot(index: number, updated: ChildSlot) {
    const next = [...slots];
    next[index] = updated;
    onSlotsChange(next);
  }

  function addSlot() {
    if (slots.length < 4) onSlotsChange([...slots, emptySlot()]);
  }

  return (
    <div>
      <StepDots step={2} />
      <h1
        style={{
          fontFamily: 'var(--font-fredoka-one), system-ui',
          fontSize: 30,
          color: 'var(--color-brand)',
          margin: '0 0 20px',
        }}
      >
        Who&apos;s in your family?
      </h1>

      {slots.map((slot, i) => (
        <ChildSlotRow key={slot.id} slot={slot} onChange={(u) => updateSlot(i, u)} />
      ))}

      {slots.length < 4 && (
        <button
          type="button"
          onClick={addSlot}
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--color-brand)',
            backgroundColor: 'transparent',
            border: '1.5px dashed var(--color-brand)',
            borderRadius: 12,
            padding: '10px 16px',
            cursor: 'pointer',
            width: '100%',
            marginBottom: 20,
          }}
        >
          + Add another child
        </button>
      )}

      <PrimaryButton onClick={onNext} disabled={!canContinue}>
        Continue →
      </PrimaryButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Default routines + times
// ---------------------------------------------------------------------------

const DEFAULT_MORNING_TASKS = [
  { icon: '🛏️', label: 'Make Bed' },
  { icon: '🥣', label: 'Eat Breakfast' },
  { icon: '🪥', label: 'Brush Teeth' },
  { icon: '👕', label: 'Get Dressed' },
  { icon: '🎒', label: 'Pack Bag' },
  { icon: '☀️', label: 'Sunblock' },
  { icon: '👟', label: 'Shoes' },
];

const DEFAULT_EVENING_TASKS = [
  { icon: '🍽️', label: 'Eat Dinner' },
  { icon: '🪥', label: 'Brush Teeth' },
  { icon: '🛁', label: 'Bath' },
  { icon: '🌙', label: 'Pyjamas' },
  { icon: '📚', label: 'Read' },
  { icon: '⭐', label: 'Bedtime' },
];

function TaskPreviewList({ tasks }: { tasks: { icon: string; label: string }[] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {tasks.map((t) => (
        <div
          key={t.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--color-text)',
          }}
        >
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          {t.label}
        </div>
      ))}
    </div>
  );
}

function StepRoutines({
  morningTarget,
  eveningTarget,
  onMorningChange,
  onEveningChange,
  onNext,
}: {
  morningTarget: string;
  eveningTarget: string;
  onMorningChange: (v: string) => void;
  onEveningChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <StepDots step={3} />
      <h1
        style={{
          fontFamily: 'var(--font-fredoka-one), system-ui',
          fontSize: 30,
          color: 'var(--color-brand)',
          margin: '0 0 8px',
        }}
      >
        Here are their default tasks
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 600,
          fontSize: 14,
          color: 'var(--color-text)',
          opacity: 0.65,
          margin: '0 0 20px',
          lineHeight: 1.5,
        }}
      >
        You can add, remove and reorder tasks any time from the parent settings.
      </p>

      {/* Task previews side by side */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
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
          <TaskPreviewList tasks={DEFAULT_MORNING_TASKS} />
        </div>

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
          <TaskPreviewList tasks={DEFAULT_EVENING_TASKS} />
        </div>
      </div>

      {/* Time inputs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <div style={{ flex: 1 }}>
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
            🏫 School by
          </label>
          <input
            type="time"
            value={morningTarget}
            onChange={(e) => onMorningChange(e.target.value)}
            style={{
              fontFamily: 'var(--font-nunito), system-ui',
              fontWeight: 700,
              fontSize: 18,
              color: 'var(--color-text)',
              backgroundColor: 'var(--color-surface)',
              border: '1.5px solid #DDD6FE',
              borderRadius: 12,
              padding: '10px 14px',
              width: '100%',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
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
            🌙 Bedtime
          </label>
          <input
            type="time"
            value={eveningTarget}
            onChange={(e) => onEveningChange(e.target.value)}
            style={{
              fontFamily: 'var(--font-nunito), system-ui',
              fontWeight: 700,
              fontSize: 18,
              color: 'var(--color-text)',
              backgroundColor: 'var(--color-surface)',
              border: '1.5px solid #DDD6FE',
              borderRadius: 12,
              padding: '10px 14px',
              width: '100%',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <PrimaryButton onClick={onNext}>Continue →</PrimaryButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: All set
// ---------------------------------------------------------------------------

function StepAllSet({
  familyName,
  onFinish,
}: {
  familyName: string;
  onFinish: () => void;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <StepDots step={4} />
      <div
        className="animate-pop-in"
        style={{ fontSize: 80, lineHeight: 1, marginBottom: 24 }}
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
        You&apos;re all set{familyName ? `, ${familyName}` : ''}!
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 600,
          fontSize: 16,
          color: 'var(--color-text)',
          opacity: 0.75,
          margin: '0 0 40px',
          lineHeight: 1.6,
        }}
      >
        Your routines are ready. Tap the tasks each morning and evening to track progress.
      </p>
      <PrimaryButton onClick={onFinish}>Start the day! →</PrimaryButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
  const router = useRouter();
  const setChildren = useAppStore((s) => s.setChildren);

  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState<ChildSlot[]>([emptySlot()]);
  const [morningTarget, setMorningTarget] = useState('08:45');
  const [eveningTarget, setEveningTarget] = useState('19:30');

  // Derive a friendly family name from the first child's name
  const familyName = slots.find((s) => s.name.trim())?.name.trim() ?? '';

  function handleFinish() {
    const children: Child[] = slots
      .filter((s) => s.name.trim().length > 0)
      .map((s) => ({
        id: generateId(),
        name: s.name.trim(),
        age: s.age,
        avatarType: s.avatar,
        colour: AVATAR_COLOUR_MAP[s.avatar],
        morningTasks: makeMorningTasksForOnboarding(),
        eveningTasks: makeEveningTasksForOnboarding(),
        morningTarget,
        eveningTarget,
        streak: 0,
      }));

    // Persist to localStorage for later Supabase write
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'unicorn-sparkles-onboarding',
        JSON.stringify({ children, morningTarget, eveningTarget })
      );
    }

    setChildren(children);
    router.push('/');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          backgroundColor: 'var(--color-surface)',
          borderRadius: 24,
          boxShadow: '0 4px 32px rgba(123,47,190,0.12)',
          padding: '36px 32px',
        }}
      >
        {step === 1 && <StepWelcome onNext={() => setStep(2)} />}
        {step === 2 && (
          <StepChildren
            slots={slots}
            onSlotsChange={setSlots}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepRoutines
            morningTarget={morningTarget}
            eveningTarget={eveningTarget}
            onMorningChange={setMorningTarget}
            onEveningChange={setEveningTarget}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <StepAllSet familyName={familyName} onFinish={handleFinish} />
        )}
      </div>
    </div>
  );
}
