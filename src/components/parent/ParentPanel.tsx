'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/hooks/useAuth';
import RoutineEditor from './RoutineEditor';
import CharacterAvatar from '@/components/shared/CharacterAvatar';
import { AVATAR_OPTIONS } from '@/lib/avatarUtils';
import { createClient } from '@/lib/supabase/client';
import type { AvatarType } from '@/types';

interface ParentPanelProps {
  onClose: () => void;
}

const COLOUR_MAP: Record<string, string> = {
  griff: '#1E40AF', harriet: '#BE185D', evie: '#065F46',
  rocket: '#EA580C', dragon: '#B91C1C', cat: '#0D9488',
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-fredoka-one), system-ui',
      fontSize: 16,
      color: '#3B0764',
      marginBottom: 12,
      letterSpacing: '0.02em',
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: '#F3F4F6', margin: '20px 0' }} />;
}

export default function ParentPanel({ onClose }: ParentPanelProps) {
  const children = useAppStore((s) => s.children);
  const streakSettings = useAppStore((s) => s.streakSettings);
  const resetDay = useAppStore((s) => s.resetDay);
  const resetStreaks = useAppStore((s) => s.resetStreaks);
  const lockParent = useAppStore((s) => s.lockParent);
  const addChild = useAppStore((s) => s.addChild);
  const removeChild = useAppStore((s) => s.removeChild);
  const updateStreakSettings = useAppStore((s) => s.updateStreakSettings);
  const { signOut: _signOut } = useAuth();

  const [view, setView] = useState<'main' | 'editRoutine' | 'addChild'>('main');
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);
  const [resetDayConfirm, setResetDayConfirm] = useState(false);
  const [resetStreakConfirm, setResetStreakConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Add child form state
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState<AvatarType>('rocket');
  const [newAge, setNewAge] = useState(8);

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  const handleResetDay = () => {
    resetDay();
    setResetDayConfirm(true);
    setTimeout(() => setResetDayConfirm(false), 2000);
  };

  const handleResetStreaks = () => {
    resetStreaks();
    setResetStreakConfirm(true);
    setTimeout(() => setResetStreakConfirm(false), 2000);
  };

  const handleLock = () => { lockParent(); onClose(); };

  const handleAddChild = () => {
    if (!newName.trim()) return;
    addChild(newName.trim(), newAvatar, newAge);
    setNewName('');
    setNewAvatar('rocket');
    setNewAge(8);
    setView('main');
  };

  const handleEditRoutine = (childId: string) => {
    setEditingChildId(childId);
    setView('editRoutine');
  };

  const handleRemove = (childId: string) => {
    if (children.length <= 1) return; // never remove last child
    removeChild(childId);
    setRemoveConfirmId(null);
  };

  const editingChild = children.find((c) => c.id === editingChildId);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '82vw',
          maxWidth: 900,
          height: '85vh',
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
        }}
      >
        {/* Fixed header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px 16px',
          borderBottom: '1px solid #F3F4F6',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {view !== 'main' && (
              <button
                type="button"
                onClick={() => setView('main')}
                style={{
                  background: 'none', border: 'none', fontSize: 20,
                  cursor: 'pointer', color: '#6B7280', padding: '2px 6px',
                  borderRadius: 8, lineHeight: 1,
                }}
                aria-label="Back"
              >
                ←
              </button>
            )}
            {view === 'editRoutine' && editingChild && (
              <CharacterAvatar avatarType={editingChild.avatarType} size={36} />
            )}
            <span style={{
              fontFamily: 'var(--font-fredoka-one), system-ui',
              fontSize: 24,
              color: '#3B0764',
            }}>
              {view === 'main' && '⚙️ Settings'}
              {view === 'editRoutine' && editingChild ? `${editingChild.name}'s Routine` : ''}
              {view === 'addChild' && 'Add a Kid'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none', border: 'none', fontSize: 22,
              cursor: 'pointer', color: '#9CA3AF', lineHeight: 1, padding: 4,
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {/* ── ROUTINE EDITOR VIEW ── */}
          {view === 'editRoutine' && editingChildId && (
            <RoutineEditor
              childId={editingChildId}
              onBack={() => setView('main')}
              hideHeader
            />
          )}

          {/* ── ADD CHILD VIEW ── */}
          {view === 'addChild' && (
            <div style={{ maxWidth: 480 }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: 'var(--font-nunito), system-ui', fontWeight: 700, fontSize: 14, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sam"
                  maxLength={20}
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: 12, border: '2px solid #E5E7EB',
                    fontFamily: 'var(--font-nunito), system-ui', fontSize: 16,
                    color: '#1F2937', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: 'var(--font-nunito), system-ui', fontWeight: 700, fontSize: 14, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Age (sets starter tasks)
                </label>
                <input
                  type="number"
                  value={newAge}
                  min={3}
                  max={16}
                  onChange={(e) => setNewAge(Number(e.target.value))}
                  style={{
                    width: 90, padding: '10px 14px',
                    borderRadius: 12, border: '2px solid #E5E7EB',
                    fontFamily: 'var(--font-nunito), system-ui', fontSize: 16,
                    color: '#1F2937', outline: 'none',
                  }}
                />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontFamily: 'var(--font-nunito), system-ui', fontWeight: 700, fontSize: 14, color: '#374151', display: 'block', marginBottom: 10 }}>
                  Choose character
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setNewAvatar(opt.type)}
                      style={{
                        padding: 8, borderRadius: 16,
                        border: newAvatar === opt.type ? '3px solid #7B2FBE' : '3px solid #E5E7EB',
                        background: newAvatar === opt.type ? '#F5F3FF' : '#F9FAFB',
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <CharacterAvatar avatarType={opt.type} size={56} />
                      <span style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 11, fontWeight: 700, color: '#6B7280' }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddChild}
                disabled={!newName.trim()}
                style={{
                  fontFamily: 'var(--font-fredoka-one), system-ui',
                  fontSize: 18, padding: '12px 32px',
                  borderRadius: 16, border: 'none',
                  backgroundColor: newName.trim() ? '#7B2FBE' : '#E5E7EB',
                  color: newName.trim() ? '#FFFFFF' : '#9CA3AF',
                  cursor: newName.trim() ? 'pointer' : 'not-allowed',
                  width: '100%',
                }}
              >
                Add {newName.trim() || 'Kid'}
              </button>
            </div>
          )}

          {/* ── MAIN SETTINGS VIEW ── */}
          {view === 'main' && (
            <>
              {/* KIDS */}
              <SectionHeading>Kids</SectionHeading>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                {children.map((child) => {
                  const accentHex = COLOUR_MAP[child.colour] ?? '#7B2FBE';
                  const isConfirmingRemove = removeConfirmId === child.id;
                  return (
                    <div
                      key={child.id}
                      style={{
                        border: `2px solid ${accentHex}22`,
                        borderRadius: 16,
                        backgroundColor: `${accentHex}08`,
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        minWidth: 180,
                      }}
                    >
                      <CharacterAvatar avatarType={child.avatarType} size={48} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-fredoka-one), system-ui',
                          fontSize: 18, color: '#1F2937',
                        }}>
                          {child.name}
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleEditRoutine(child.id)}
                            style={{
                              fontFamily: 'var(--font-nunito), system-ui',
                              fontSize: 12, fontWeight: 700,
                              padding: '3px 10px', borderRadius: 8,
                              border: `1.5px solid ${accentHex}`,
                              backgroundColor: 'transparent',
                              color: accentHex, cursor: 'pointer',
                            }}
                          >
                            Edit routine
                          </button>
                          {children.length > 1 && (
                            isConfirmingRemove ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(child.id)}
                                  style={{
                                    fontFamily: 'var(--font-nunito), system-ui',
                                    fontSize: 12, fontWeight: 700,
                                    padding: '3px 10px', borderRadius: 8,
                                    border: '1.5px solid #EF4444',
                                    backgroundColor: '#EF4444',
                                    color: '#fff', cursor: 'pointer',
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRemoveConfirmId(null)}
                                  style={{
                                    fontFamily: 'var(--font-nunito), system-ui',
                                    fontSize: 12, fontWeight: 700,
                                    padding: '3px 8px', borderRadius: 8,
                                    border: '1.5px solid #D1D5DB',
                                    backgroundColor: 'transparent',
                                    color: '#6B7280', cursor: 'pointer',
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setRemoveConfirmId(child.id)}
                                style={{
                                  fontFamily: 'var(--font-nunito), system-ui',
                                  fontSize: 12, fontWeight: 700,
                                  padding: '3px 10px', borderRadius: 8,
                                  border: '1.5px solid #FCA5A5',
                                  backgroundColor: 'transparent',
                                  color: '#EF4444', cursor: 'pointer',
                                }}
                              >
                                Remove
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setView('addChild')}
                  style={{
                    border: '2px dashed #D1D5DB',
                    borderRadius: 16,
                    backgroundColor: '#F9FAFB',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    minWidth: 100,
                    minHeight: 80,
                  }}
                >
                  <span style={{ fontSize: 24, lineHeight: 1 }}>+</span>
                  <span style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>
                    Add kid
                  </span>
                </button>
              </div>

              <Divider />

              {/* TODAY */}
              <SectionHeading>Today&apos;s Routines</SectionHeading>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={handleResetDay}
                  style={{
                    fontFamily: 'var(--font-nunito), system-ui',
                    fontSize: 14, fontWeight: 700,
                    padding: '8px 18px', borderRadius: 10,
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#F9FAFB', color: '#3B0764',
                    cursor: 'pointer',
                  }}
                >
                  Reset Day
                </button>
                {resetDayConfirm && (
                  <span style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 14, color: '#10B981', fontWeight: 700 }}>
                    ✓ All tasks cleared!
                  </span>
                )}
              </div>

              <Divider />

              {/* STREAKS */}
              <SectionHeading>Streaks</SectionHeading>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                {children.map((child) => (
                  <div key={child.id} style={{
                    padding: '10px 16px',
                    borderRadius: 12,
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    minWidth: 130,
                  }}>
                    <div style={{ fontFamily: 'var(--font-fredoka-one), system-ui', fontSize: 15, color: '#1F2937', marginBottom: 4 }}>
                      {child.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 13, color: '#4B5563' }}>
                      🌅 Morning: <strong>{child.morningStreak ?? 0}</strong> days
                    </div>
                    <div style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 13, color: '#4B5563' }}>
                      🌙 Evening: <strong>{child.eveningStreak ?? 0}</strong> days
                    </div>
                  </div>
                ))}
              </div>

              {/* Weekend toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {[
                  {
                    key: 'morningCountsWeekends' as const,
                    label: 'Count weekends for morning streaks',
                    hint: 'Off = weekends don\'t affect morning streaks',
                    value: streakSettings.morningCountsWeekends,
                  },
                  {
                    key: 'eveningCountsWeekends' as const,
                    label: 'Count weekends for evening streaks',
                    hint: 'On = bedtime every night counts',
                    value: streakSettings.eveningCountsWeekends,
                  },
                ].map((toggle) => (
                  <label
                    key={toggle.key}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      onClick={() => updateStreakSettings({ [toggle.key]: !toggle.value })}
                      style={{
                        width: 44, height: 24,
                        borderRadius: 12,
                        backgroundColor: toggle.value ? '#7B2FBE' : '#D1D5DB',
                        position: 'relative',
                        transition: 'background-color 0.2s',
                        flexShrink: 0,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 3, left: toggle.value ? 23 : 3,
                        width: 18, height: 18,
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 14, fontWeight: 700, color: '#1F2937' }}>
                        {toggle.label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 12, color: '#9CA3AF' }}>
                        {toggle.hint}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={handleResetStreaks}
                  style={{
                    fontFamily: 'var(--font-nunito), system-ui',
                    fontSize: 14, fontWeight: 700,
                    padding: '8px 18px', borderRadius: 10,
                    border: '1px solid #FCA5A5',
                    backgroundColor: '#FFF5F5', color: '#EF4444',
                    cursor: 'pointer',
                  }}
                >
                  Reset All Streaks
                </button>
                {resetStreakConfirm && (
                  <span style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 14, color: '#10B981', fontWeight: 700 }}>
                    ✓ Streaks reset!
                  </span>
                )}
              </div>

              <Divider />

              {/* PIN */}
              <SectionHeading>PIN</SectionHeading>
              <div style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 14, color: '#4B5563' }}>
                Current PIN: ••••
              </div>
              <div style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                PIN management coming soon
              </div>

              <Divider />

              {/* LOCK + SIGN OUT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  type="button"
                  onClick={handleLock}
                  style={{
                    fontFamily: 'var(--font-fredoka-one), system-ui',
                    fontSize: 18, padding: '12px 24px',
                    borderRadius: 16, border: 'none',
                    backgroundColor: '#7B2FBE', color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  🔒 Lock Parent Area
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    style={{
                      fontFamily: 'var(--font-nunito), system-ui',
                      fontSize: 13, fontWeight: 600,
                      background: 'none', border: 'none',
                      color: signingOut ? '#D1D5DB' : '#9CA3AF',
                      cursor: signingOut ? 'not-allowed' : 'pointer',
                      padding: 0,
                    }}
                  >
                    {signingOut ? 'Signing out…' : 'Sign out'}
                  </button>
                  <span style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 12, color: '#D1D5DB' }}>
                    v1.0
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
