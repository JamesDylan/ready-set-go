'use client';
import React from 'react';
import { AVATAR_OPTIONS } from '@/lib/avatarUtils';
import type { AgeBand } from '@/lib/seedData';
import { StepDots, PrimaryButton, emptySlot } from './shared';
import type { ChildSlot } from './shared';
import type { AvatarType } from '@/types';
import CharacterAvatar from '@/components/shared/CharacterAvatar';

// ---------------------------------------------------------------------------
// Bedtime dropdown helpers
// ---------------------------------------------------------------------------

function bedtimeOptions(): { value: string; label: string }[] {
  const opts = [];
  for (let h = 17; h <= 23; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === 23 && m > 30) break;
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const displayH = h > 12 ? h - 12 : h;
      const label = `${displayH}:${String(m).padStart(2, '0')} PM`;
      opts.push({ value, label });
    }
  }
  return opts;
}

const BEDTIME_OPTIONS = bedtimeOptions();

const AGE_BAND_DEFAULTS: Record<AgeBand, string> = {
  little: '19:00',
  school: '19:30',
  independent: '20:30',
};

// ---------------------------------------------------------------------------
// Age-band segmented control config
// ---------------------------------------------------------------------------

const AGE_BANDS: { band: AgeBand; emoji: string; label: string }[] = [
  { band: 'little', emoji: '🧸', label: 'Little (3–5)' },
  { band: 'school', emoji: '⭐', label: 'School age (6–8)' },
  { band: 'independent', emoji: '🚀', label: 'Independent (9+)' },
];

// ---------------------------------------------------------------------------
// ChildSlotRow
// ---------------------------------------------------------------------------

interface ChildSlotRowProps {
  slot: ChildSlot;
  onChange: (updated: ChildSlot) => void;
}

export function ChildSlotRow({ slot, onChange }: ChildSlotRowProps) {
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
      {slot.name.trim().length > 0 && (
        <p style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 600,
          fontSize: 13,
          color: 'var(--color-brand)',
          opacity: 0.85,
          margin: '-8px 0 8px',
          transition: 'opacity 0.2s ease',
        }}>
          Hi {slot.name.trim()}! Now pick an age group and avatar.
        </p>
      )}

      {/* Age-band segmented control */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--color-text)',
            opacity: 0.6,
            marginBottom: 8,
          }}
        >
          Age group
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {AGE_BANDS.map(({ band, emoji, label }) => {
            const isSelected = slot.ageBand === band;
            return (
              <button
                key={band}
                type="button"
                onClick={() => onChange({ ...slot, ageBand: band, eveningTarget: AGE_BAND_DEFAULTS[band] })}
                style={{
                  flex: 1,
                  fontFamily: 'var(--font-nunito), system-ui',
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: 20,
                  padding: '10px 4px',
                  minHeight: 56,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--color-brand)' : '1.5px solid #DDD6FE',
                  backgroundColor: isSelected ? 'var(--color-brand)' : 'var(--color-surface)',
                  color: isSelected ? '#fff' : 'var(--color-brand)',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                <div style={{ fontSize: 16, marginBottom: 2 }}>{emoji}</div>
                <div>{label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Avatar picker */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--color-text)',
            opacity: 0.6,
            marginBottom: 8,
          }}
        >
          Avatar
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {AVATAR_OPTIONS.map(({ type, label }) => (
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
                padding: 0,
                overflow: 'hidden',
              }}
            >
              <CharacterAvatar avatarType={type} size={36} />
            </button>
          ))}
        </div>
      </div>

      {/* Per-child bedtime */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <label
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--color-text)',
            opacity: 0.7,
            whiteSpace: 'nowrap',
          }}
        >
          🌙 Bedtime (optional)
        </label>
        <select
          value={slot.eveningTarget}
          onChange={(e) => onChange({ ...slot, eveningTarget: e.target.value })}
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 700,
            fontSize: 16,
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid #DDD6FE',
            borderRadius: 12,
            padding: '10px 14px',
            width: '100%',
            boxSizing: 'border-box' as const,
            minHeight: 48,
            cursor: 'pointer',
            appearance: 'none' as const,
            WebkitAppearance: 'none' as const,
          }}
        >
          {BEDTIME_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StepChildren
// ---------------------------------------------------------------------------

interface StepChildrenProps {
  slots: ChildSlot[];
  onSlotsChange: (slots: ChildSlot[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepChildren({ slots, onSlotsChange, onNext, onBack }: StepChildrenProps) {
  const canContinue = slots.some((s) => s.name.trim().length > 0);

  function updateSlot(index: number, updated: ChildSlot) {
    const next = [...slots];
    next[index] = updated;
    onSlotsChange(next);
  }

  function addSlot() {
    if (slots.length >= 4) return;
    const usedAvatars = new Set(slots.map((s) => s.avatar));
    const AVATAR_TYPE_ORDER: AvatarType[] = ['unicorn', 'car', 'axolotl', 'rocket', 'dragon', 'cat'];
    const nextAvatar = AVATAR_TYPE_ORDER.find((a) => !usedAvatars.has(a)) ?? 'unicorn';
    onSlotsChange([...slots, { ...emptySlot(), avatar: nextAvatar }]);
  }

  return (
    <div>
      <StepDots step={2} total={4} onBack={onBack} />
      <h1
        style={{
          fontFamily: 'var(--font-fredoka-one), system-ui',
          fontSize: 30,
          color: 'var(--color-brand)',
          margin: '0 0 8px',
        }}
      >
        Who&apos;s in your family?
      </h1>
      <p style={{
        fontFamily: 'var(--font-nunito), system-ui',
        fontWeight: 600,
        fontSize: 14,
        color: 'var(--color-text)',
        opacity: 0.65,
        margin: '0 0 20px',
        lineHeight: 1.5,
      }}>
        Start with one. You can add more any time.
      </p>

      {slots.map((slot, i) => (
        <ChildSlotRow key={slot.id} slot={slot} onChange={(u) => updateSlot(i, u)} />
      ))}

      {slots.length < 4 ? (
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
            padding: '12px 16px',
            minHeight: 48,
            cursor: 'pointer',
            width: '100%',
            marginBottom: 20,
          }}
        >
          + Add another child  (up to 4)
        </button>
      ) : (
        <div style={{ marginBottom: 20 }} />
      )}

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
        You can always add more children or rename them from Settings.
      </p>
      <PrimaryButton onClick={onNext} disabled={!canContinue}>
        Continue →
      </PrimaryButton>
    </div>
  );
}
