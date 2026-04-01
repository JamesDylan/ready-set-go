'use client';
import type { AvatarType, Child } from '@/types';
import { AVATAR_OPTIONS } from '@/lib/avatarUtils';
import CharacterAvatar from '@/components/shared/CharacterAvatar';

interface AvatarPickerModalProps {
  child: Child;
  onConfirm: (avatarType: AvatarType) => void;
}

export default function AvatarPickerModal({ child, onConfirm }: AvatarPickerModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 32,
          padding: 40,
          maxWidth: 500,
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Big greeting avatar */}
        <CharacterAvatar avatarType={child.avatarType} size={96} />

        {/* Heading */}
        <h2
          style={{
            fontFamily: 'var(--font-fredoka-one), system-ui',
            fontSize: 28,
            color: 'var(--color-brand-purple, #7C3AED)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Hi {child.name}! Which one do you want to be?
        </h2>

        {/* Subheading */}
        <p
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontSize: 16,
            color: '#9CA3AF',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Tap your favourite →
        </p>

        {/* Avatar grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            width: '100%',
            marginTop: 8,
          }}
        >
          {AVATAR_OPTIONS.map((option) => (
            <button
              key={option.type}
              type="button"
              onClick={() => onConfirm(option.type)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: '3px solid transparent',
                borderRadius: '50%',
                padding: 0,
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-brand-purple, #7C3AED)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
              }}
              aria-label={`Choose ${option.label}`}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <CharacterAvatar avatarType={option.type} size={80} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-nunito), system-ui',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#374151',
                }}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
