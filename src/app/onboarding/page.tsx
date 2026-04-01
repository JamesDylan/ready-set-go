'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { makeMorningTasksForOnboarding, makeEveningTasksForOnboarding } from '@/lib/seedData';
import { AVATAR_COLOUR_MAP } from '@/lib/avatarUtils';
import type { Child } from '@/types';
import { emptySlot } from './_components/shared';
import type { ChildSlot } from './_components/shared';
import { StepWelcome } from './_components/StepWelcome';
import { StepChildren } from './_components/StepChildren';
import { StepRoutines } from './_components/StepRoutines';
import { StepAllSet } from './_components/StepAllSet';

export default function OnboardingPage() {
  const router = useRouter();
  const setChildren = useAppStore((s) => s.setChildren);

  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState<ChildSlot[]>(() => [emptySlot()]);
  const [morningTarget, setMorningTarget] = useState('08:45');

  // Task toggle sets — initialised / re-initialised when step becomes 3
  const [selectedMorning, setSelectedMorning] = useState<Set<string>>(new Set());
  const [selectedEvening, setSelectedEvening] = useState<Set<string>>(new Set());

  // Custom tasks added by the user in step 3
  const [customMorningTasks, setCustomMorningTasks] = useState<{ label: string; icon: string }[]>([]);
  const [customEveningTasks, setCustomEveningTasks] = useState<{ label: string; icon: string }[]>([]);

  const firstBand = slots[0]?.ageBand ?? 'school';

  // Seed task selections whenever the user enters Step 3
  useEffect(() => {
    if (step === 3) {
      setSelectedMorning(
        new Set(makeMorningTasksForOnboarding(firstBand).map((t) => t.label))
      );
      setSelectedEvening(
        new Set(makeEveningTasksForOnboarding(firstBand).map((t) => t.label))
      );
    }
  }, [step, firstBand]);

  function handleMorningToggle(label: string) {
    setSelectedMorning((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  function handleEveningToggle(label: string) {
    setSelectedEvening((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  function handleAddMorningTask(label: string, icon: string) {
    setCustomMorningTasks((prev) => [...prev, { label, icon }]);
    setSelectedMorning((prev) => new Set([...prev, label]));
  }

  function handleAddEveningTask(label: string, icon: string) {
    setCustomEveningTasks((prev) => [...prev, { label, icon }]);
    setSelectedEvening((prev) => new Set([...prev, label]));
  }

  function handleFinish() {
    const children: Child[] = slots
      .filter((s) => s.name.trim().length > 0)
      .map((s) => {
        const band = s.ageBand;
        const allMorning = makeMorningTasksForOnboarding(band);
        const allEvening = makeEveningTasksForOnboarding(band);
        const customMorningAsTasks = customMorningTasks
          .filter((t) => selectedMorning.has(t.label))
          .map((t, i) => ({
            id: `custom-morning-${i}`,
            label: t.label,
            icon: t.icon,
            isComplete: false,
            order: allMorning.length + i + 1,
          }));
        const customEveningAsTasks = customEveningTasks
          .filter((t) => selectedEvening.has(t.label))
          .map((t, i) => ({
            id: `custom-evening-${i}`,
            label: t.label,
            icon: t.icon,
            isComplete: false,
            order: allEvening.length + i + 1,
          }));
        return {
          id: `child-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
          name: s.name.trim(),
          age: band === 'little' ? 4 : band === 'school' ? 7 : 10,
          avatarType: s.avatar,
          colour: AVATAR_COLOUR_MAP[s.avatar],
          morningTasks: [
            ...allMorning.filter((t) => selectedMorning.has(t.label)),
            ...customMorningAsTasks,
          ],
          eveningTasks: [
            ...allEvening.filter((t) => selectedEvening.has(t.label)),
            ...customEveningAsTasks,
          ],
          morningTarget,
          eveningTarget: s.eveningTarget,
          streak: 0,
          avatarConfirmed: false,
        };
      });

    if (typeof window !== 'undefined') {
      localStorage.setItem('unicorn-sparkles-onboarding', JSON.stringify({ children }));
    }

    setChildren(children);
    router.push('/');
  }

  // Derive first-child data for StepAllSet preview
  const firstSlot = slots.find((s) => s.name.trim().length > 0) ?? slots[0];
  const firstMorningTask = makeMorningTasksForOnboarding(firstSlot?.ageBand ?? 'school')[0];

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
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
        {step === 1 ? (
          <StepWelcome onNext={() => setStep(2)} />
        ) : step === 2 ? (
          <StepChildren
            slots={slots}
            onSlotsChange={setSlots}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        ) : step === 3 ? (
          <StepRoutines
            firstChildAgeBand={firstBand}
            selectedMorning={selectedMorning}
            selectedEvening={selectedEvening}
            onMorningToggle={handleMorningToggle}
            onEveningToggle={handleEveningToggle}
            morningTarget={morningTarget}
            onMorningTargetChange={setMorningTarget}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
            slotCount={slots.filter((s) => s.name.trim()).length}
            customMorningTasks={customMorningTasks}
            customEveningTasks={customEveningTasks}
            onAddMorningTask={handleAddMorningTask}
            onAddEveningTask={handleAddEveningTask}
          />
        ) : (
          <StepAllSet
            firstName={firstSlot?.name.trim() ?? ''}
            firstAvatar={firstSlot?.avatar ?? 'unicorn'}
            firstTaskLabel={firstMorningTask?.label ?? 'Make Bed'}
            firstTaskIcon={firstMorningTask?.icon ?? '🛏️'}
            onFinish={handleFinish}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}
