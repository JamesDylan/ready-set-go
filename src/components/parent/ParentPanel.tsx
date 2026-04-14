'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/hooks/useAuth';
import RoutineEditor from './RoutineEditor';
import { createClient } from '@/lib/supabase/client';

interface ParentPanelProps {
  onClose: () => void;
}

const AVATAR_EMOJIS: Record<string, string> = {
  car: '🚗',
  unicorn: '🦄',
  axolotl: '🦎',
  rocket: '🚀',
  dragon: '🐉',
  cat: '🐱',
};

export default function ParentPanel({ onClose }: ParentPanelProps) {
  const resetDay = useAppStore((s) => s.resetDay);
  const lockParent = useAppStore((s) => s.lockParent);
  const children = useAppStore((s) => s.children);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  const handleResetDay = () => {
    resetDay();
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 2000);
  };

  const handleLock = () => {
    lockParent();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}
    >
      <div
        style={{
          width: 480,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          position: 'relative',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}
      >
        {/* Header — shows child context when editing a routine */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          {editingChildId ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={() => setEditingChildId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: '#6B7280',
                  padding: '4px 8px',
                  borderRadius: 8,
                  lineHeight: 1,
                }}
                aria-label="Back to settings"
              >
                ←
              </button>
              <span style={{ fontSize: 22 }}>
                {AVATAR_EMOJIS[children.find(c => c.id === editingChildId)?.avatarType ?? ''] ?? '👶'}
              </span>
              <span style={{ fontFamily: 'var(--font-fredoka-one), system-ui', fontSize: 22, color: '#3B0764' }}>
                {children.find(c => c.id === editingChildId)?.name}
              </span>
            </div>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-fredoka-one), system-ui',
                fontSize: 28,
                color: '#3B0764',
              }}
            >
              ⚙️ Settings
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#6B7280',
              lineHeight: 1,
              padding: 4,
            }}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {editingChildId ? (
          /* RoutineEditor view — back/header handled by panel above */
          <RoutineEditor
            childId={editingChildId}
            onBack={() => setEditingChildId(null)}
            hideHeader
          />
        ) : (
          /* Default settings view */
          <>
            {/* Section: Today's Routines */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: 'var(--font-fredoka-one), system-ui',
                  fontSize: 18,
                  color: '#3B0764',
                  marginBottom: 12,
                }}
              >
                Today&apos;s Routines
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={handleResetDay}
                  style={{
                    fontFamily: 'var(--font-nunito), system-ui',
                    fontSize: 15,
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    color: '#3B0764',
                    cursor: 'pointer',
                  }}
                >
                  Reset Day
                </button>
                {resetConfirm && (
                  <span
                    style={{
                      fontFamily: 'var(--font-nunito), system-ui',
                      fontSize: 15,
                      color: '#10B981',
                      fontWeight: 700,
                    }}
                  >
                    ✓ Day reset!
                  </span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 24 }} />

            {/* Section: Edit Routines */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: 'var(--font-fredoka-one), system-ui',
                  fontSize: 18,
                  color: '#3B0764',
                  marginBottom: 12,
                }}
              >
                Edit Routines
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => setEditingChildId(child.id)}
                    style={{
                      fontFamily: 'var(--font-nunito), system-ui',
                      fontSize: 15,
                      fontWeight: 700,
                      padding: '10px 18px',
                      borderRadius: 14,
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      color: '#3B0764',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{AVATAR_EMOJIS[child.avatarType] ?? '👶'}</span>
                    {child.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 24 }} />

            {/* Section: PIN */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: 'var(--font-fredoka-one), system-ui',
                  fontSize: 18,
                  color: '#3B0764',
                  marginBottom: 8,
                }}
              >
                PIN
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-nunito), system-ui',
                  fontSize: 15,
                  color: '#4B5563',
                }}
              >
                Current PIN: ••••
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-nunito), system-ui',
                  fontSize: 13,
                  color: '#9CA3AF',
                  marginTop: 4,
                }}
              >
                (PIN management coming soon)
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 24 }} />

            {/* Lock button — primary action */}
            <button
              type="button"
              onClick={handleLock}
              style={{
                fontFamily: 'var(--font-fredoka-one), system-ui',
                fontSize: 18,
                padding: '12px 24px',
                borderRadius: 20,
                border: 'none',
                backgroundColor: '#7B2FBE',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
              }}
            >
              🔒 Lock Parent Area
            </button>

            {/* Sign out — muted text link */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                style={{
                  fontFamily: 'var(--font-nunito), system-ui',
                  fontSize: 13,
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  color: signingOut ? '#D1D5DB' : '#9CA3AF',
                  cursor: signingOut ? 'not-allowed' : 'pointer',
                  padding: 0,
                }}
              >
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
              <span style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 12, color: '#D1D5DB' }}>
                v0.1
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
