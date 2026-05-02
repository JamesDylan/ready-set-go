'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ModeToggle from '@/components/dashboard/ModeToggle';
import KidCard from '@/components/dashboard/KidCard';
import CountdownBar from '@/components/dashboard/CountdownBar';
import PINGate from '@/components/parent/PINGate';
import ParentPanel from '@/components/parent/ParentPanel';
import AvatarPickerModal from '@/components/dashboard/AvatarPickerModal';
import { useAppStore } from '@/store/useAppStore';

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function minutesUntil(targetHHMM: string, nowMinutes: number): number {
  return timeToMinutes(targetHHMM) - nowMinutes;
}

export default function Home() {
  const children = useAppStore((s) => s.children);
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);
  const resetDay = useAppStore((s) => s.resetDay);
  const checkAndResetIfNewDay = useAppStore((s) => s.checkAndResetIfNewDay);
  const parentUnlocked = useAppStore((s) => s.parentUnlocked);
  const unlockParent = useAppStore((s) => s.unlockParent);
  const lockParent = useAppStore((s) => s.lockParent);
  const confirmAvatar = useAppStore((s) => s.confirmAvatar);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const router = useRouter();

  const pendingAvatarChild = children.find((c) => c.avatarConfirmed === false) ?? null;

  const [now, setNow] = useState<Date>(() => new Date());
  const [showPINGate, setShowPINGate] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  // Live clock: tick every 60 seconds
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Auto mode detection on first load only
  useEffect(() => {
    const hour = new Date().getHours();
    const detectedMode = hour < 14 ? 'morning' : 'evening';
    setMode(detectedMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Daily auto-reset: clear tasks if it's a new day
  useEffect(() => {
    checkAndResetIfNewDay();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Verify onboarding status — if not locally complete, check Supabase before redirecting.
  // This handles authenticated users on a new device whose localStorage was wiped.
  useEffect(() => {
    if (onboardingComplete) {
      setOnboardingChecked(true);
      return;
    }
    let cancelled = false;
    createClient()
      .from('families')
      .select('id')
      .limit(1)
      .then(({ data }) => {
        if (cancelled) return;
        if (data && data.length > 0) {
          setOnboardingComplete(true);
          setOnboardingChecked(true);
        } else {
          router.replace('/onboarding');
        }
      });
    return () => { cancelled = true; };
  }, [onboardingComplete, router, setOnboardingComplete]);

  if (!onboardingChecked) return null;

  // Compute countdown bar props
  let countdownTarget: string | null = null;
  let countdownLabel = '';
  let minutesRemaining = 0;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (mode === 'morning') {
    // Find child with the nearest (soonest) morning target that hasn't passed
    const upcomingMorning = children
      .map((child) => ({
        name: child.name,
        target: child.morningTarget,
        minsLeft: minutesUntil(child.morningTarget, nowMinutes),
      }))
      .filter((c) => c.minsLeft > 0)
      .sort((a, b) => a.minsLeft - b.minsLeft);

    if (upcomingMorning.length > 0) {
      const next = upcomingMorning[0];
      countdownTarget = next.target;
      countdownLabel = children.length > 1 ? `${next.name} — School ready by` : 'School ready by';
      minutesRemaining = next.minsLeft;
    } else {
      // All targets passed — show first child as late
      countdownTarget = children[0]?.morningTarget ?? '08:45';
      countdownLabel = 'School ready by';
      minutesRemaining = minutesUntil(countdownTarget, nowMinutes);
    }
  } else {
    // Find the child with the earliest bedtime that hasn't been passed yet
    const upcoming = children
      .map((child) => ({
        name: child.name,
        target: child.eveningTarget,
        minsLeft: minutesUntil(child.eveningTarget, nowMinutes),
      }))
      .filter((c) => c.minsLeft > 0)
      .sort((a, b) => a.minsLeft - b.minsLeft);

    if (upcoming.length > 0) {
      const next = upcoming[0];
      countdownTarget = next.target;
      countdownLabel = `${next.name}'s bedtime`;
      minutesRemaining = next.minsLeft;
    }
  }

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      data-mode={mode}
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Header bar */}
      <header
        className="flex flex-row items-center justify-between px-6"
        style={{
          height: 72,
          backgroundColor: 'var(--color-surface)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* Left: Mode toggle */}
        <ModeToggle currentMode={mode} onToggle={setMode} />

        {/* Centre: Brand + Clock */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              justifyContent: 'center',
              marginBottom: 2,
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>🏁</span>
            <span
              style={{
                fontFamily: 'var(--font-fredoka-one), system-ui',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: mode === 'morning' ? 'var(--color-ready)' : 'var(--color-brand-light)',
              }}
            >
              READY SET GO
            </span>
          </div>
          <time
            dateTime={now.toISOString()}
            style={{
              fontFamily: 'var(--font-fredoka-one), system-ui',
              fontSize: 28,
              color: 'var(--color-text)',
              display: 'block',
            }}
          >
            {formatTime(now)}
          </time>
        </div>

        {/* Right: dev Reset + Parent lock */}
        <div className="flex items-center gap-2">
          {process.env.NODE_ENV === 'development' && (
            <button
              type="button"
              onClick={resetDay}
              style={{
                fontSize: 12,
                fontFamily: 'var(--font-nunito), system-ui',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                backgroundColor: '#F9FAFB',
                color: '#6B7280',
                cursor: 'pointer',
              }}
            >
              Reset day
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowPINGate(true)}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 56,
              height: 56,
              backgroundColor: 'var(--color-brand-light)',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
            }}
            aria-label="Parent settings"
          >
            {parentUnlocked ? '🔓' : '🔒'}
          </button>
        </div>
      </header>

      {/* Content area: 3 kid columns */}
      <div className="flex-1 flex flex-row gap-4 px-4 py-3 overflow-hidden">
        {children.map((child) => (
          <KidCard key={child.id} child={child} mode={mode} />
        ))}
      </div>

      {/* Countdown bar */}
      {countdownTarget && (
        <CountdownBar
          label={countdownLabel}
          minutesRemaining={minutesRemaining}
          mode={mode}
        />
      )}

      {/* Avatar picker: shown once per child when avatarConfirmed === false */}
      {pendingAvatarChild && (
        <AvatarPickerModal
          child={pendingAvatarChild}
          onConfirm={(avatarType) => confirmAvatar(pendingAvatarChild.id, avatarType)}
        />
      )}

      {/* PIN gate: show when button clicked and not yet unlocked */}
      {showPINGate && !parentUnlocked && (
        <PINGate
          onAttempt={(pin) => unlockParent(pin)}
          onSuccess={() => setShowPINGate(false)}
          onCancel={() => setShowPINGate(false)}
        />
      )}

      {/* Parent panel: show when unlocked */}
      {parentUnlocked && (
        <ParentPanel onClose={() => lockParent()} />
      )}
    </div>
  );
}
