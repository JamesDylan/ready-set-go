'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSeedData, makeMorningTasksForOnboarding, makeEveningTasksForOnboarding, getAgeBand } from '@/lib/seedData';
import type { AvatarType, Child, RoutineMode, StreakSettings } from '@/types';
import { AVATAR_COLOUR_MAP } from '@/lib/avatarUtils';

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

interface AppStore {
  children: Child[];
  mode: RoutineMode;
  streakSettings: StreakSettings;
  setMode: (mode: RoutineMode) => void;
  toggleTask: (childId: string, taskId: string) => void;
  resetDay: () => void;
  resetStreaks: (childId?: string) => void;
  parentUnlocked: boolean;
  unlockParent: (pin: string) => boolean;
  lockParent: () => void;
  lastResetDate: string;
  checkAndResetIfNewDay: () => void;
  setChildren: (children: Child[]) => void;
  addChild: (name: string, avatarType: AvatarType, age?: number) => void;
  removeChild: (childId: string) => void;
  addTask: (childId: string, mode: RoutineMode, label: string, icon: string) => void;
  removeTask: (childId: string, mode: RoutineMode, taskId: string) => void;
  reorderTasks: (childId: string, mode: RoutineMode, taskIds: string[]) => void;
  updateTargetTime: (childId: string, mode: RoutineMode, time: string) => void;
  updateTaskLabel: (childId: string, mode: RoutineMode, taskId: string, newLabel: string) => void;
  updateTaskIcon: (childId: string, mode: RoutineMode, taskId: string, newIcon: string) => void;
  confirmAvatar: (childId: string, avatarType: AvatarType) => void;
  updateStreakSettings: (settings: Partial<StreakSettings>) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      children: getSeedData(),
      mode: 'morning',
      streakSettings: {
        morningCountsWeekends: false,
        eveningCountsWeekends: true,
      },
      setMode: (mode) => set({ mode }),
      toggleTask: (childId, taskId) =>
        set((state) => {
          const mode = state.mode;
          const weekend = isWeekend();
          const { morningCountsWeekends, eveningCountsWeekends } = state.streakSettings;
          const streakAllowed = mode === 'morning'
            ? !weekend || morningCountsWeekends
            : !weekend || eveningCountsWeekends;

          return {
            children: state.children.map((child) => {
              if (child.id !== childId) return child;

              const wasAllDone = mode === 'morning'
                ? child.morningTasks.every((t) => t.isComplete)
                : child.eveningTasks.every((t) => t.isComplete);

              const morningTasks = mode === 'morning'
                ? child.morningTasks.map((t) => t.id === taskId ? { ...t, isComplete: !t.isComplete } : t)
                : child.morningTasks;

              const eveningTasks = mode === 'evening'
                ? child.eveningTasks.map((t) => t.id === taskId ? { ...t, isComplete: !t.isComplete } : t)
                : child.eveningTasks;

              const isNowAllDone = mode === 'morning'
                ? morningTasks.every((t) => t.isComplete)
                : eveningTasks.every((t) => t.isComplete);

              const streakIncrement = !wasAllDone && isNowAllDone && streakAllowed ? 1 : 0;

              return {
                ...child,
                morningTasks,
                eveningTasks,
                morningStreak: mode === 'morning'
                  ? child.morningStreak + streakIncrement
                  : child.morningStreak,
                eveningStreak: mode === 'evening'
                  ? child.eveningStreak + streakIncrement
                  : child.eveningStreak,
              };
            }),
          };
        }),
      setChildren: (children) => set({ children }),
      addChild: (name, avatarType, age = 8) =>
        set((state) => {
          const id = `child-${Date.now()}`;
          const colour = AVATAR_COLOUR_MAP[avatarType];
          const ageBand = getAgeBand(age);
          const morningTasks = makeMorningTasksForOnboarding(ageBand).map((t, i) => ({
            ...t, id: `${id}-morning-${i}`,
          }));
          const eveningTasks = makeEveningTasksForOnboarding(ageBand).map((t, i) => ({
            ...t, id: `${id}-evening-${i}`,
          }));
          const newChild: Child = {
            id,
            name,
            age,
            avatarType,
            colour,
            morningTarget: '08:45',
            eveningTarget: '20:00',
            morningStreak: 0,
            eveningStreak: 0,
            morningTasks,
            eveningTasks,
            avatarConfirmed: true,
          };
          return { children: [...state.children, newChild] };
        }),
      removeChild: (childId) =>
        set((state) => ({
          children: state.children.filter((c) => c.id !== childId),
        })),
      resetStreaks: (childId) =>
        set((state) => ({
          children: state.children.map((child) => {
            if (childId && child.id !== childId) return child;
            return { ...child, morningStreak: 0, eveningStreak: 0 };
          }),
        })),
      addTask: (childId, mode, label, icon) =>
        set((state) => ({
          children: state.children.map((child) => {
            if (child.id !== childId) return child;
            const tasks = mode === 'morning' ? child.morningTasks : child.eveningTasks;
            const newTask = {
              id: `${childId}-${mode}-${Date.now()}`,
              label,
              icon,
              isComplete: false,
              order: tasks.length,
            };
            const updated = [...tasks, newTask];
            return mode === 'morning'
              ? { ...child, morningTasks: updated }
              : { ...child, eveningTasks: updated };
          }),
        })),
      removeTask: (childId, mode, taskId) =>
        set((state) => ({
          children: state.children.map((child) => {
            if (child.id !== childId) return child;
            const tasks = mode === 'morning' ? child.morningTasks : child.eveningTasks;
            const updated = tasks.filter((t) => t.id !== taskId);
            return mode === 'morning'
              ? { ...child, morningTasks: updated }
              : { ...child, eveningTasks: updated };
          }),
        })),
      reorderTasks: (childId, mode, taskIds) =>
        set((state) => ({
          children: state.children.map((child) => {
            if (child.id !== childId) return child;
            const tasks = mode === 'morning' ? child.morningTasks : child.eveningTasks;
            const taskMap = new Map(tasks.map((t) => [t.id, t]));
            const updated = taskIds
              .map((id, index) => {
                const task = taskMap.get(id);
                if (!task) return null;
                return { ...task, order: index };
              })
              .filter((t): t is NonNullable<typeof t> => t !== null);
            return mode === 'morning'
              ? { ...child, morningTasks: updated }
              : { ...child, eveningTasks: updated };
          }),
        })),
      updateTargetTime: (childId, mode, time) =>
        set((state) => ({
          children: state.children.map((child) => {
            if (child.id !== childId) return child;
            return mode === 'morning'
              ? { ...child, morningTarget: time }
              : { ...child, eveningTarget: time };
          }),
        })),
      updateTaskLabel: (childId, mode, taskId, newLabel) =>
        set((state) => ({
          children: state.children.map((child) => {
            if (child.id !== childId) return child;
            const tasks = mode === 'morning' ? child.morningTasks : child.eveningTasks;
            const updated = tasks.map((t) => t.id === taskId ? { ...t, label: newLabel } : t);
            return mode === 'morning'
              ? { ...child, morningTasks: updated }
              : { ...child, eveningTasks: updated };
          }),
        })),
      updateTaskIcon: (childId, mode, taskId, newIcon) =>
        set((state) => ({
          children: state.children.map((child) => {
            if (child.id !== childId) return child;
            const tasks = mode === 'morning' ? child.morningTasks : child.eveningTasks;
            const updated = tasks.map((t) => t.id === taskId ? { ...t, icon: newIcon } : t);
            return mode === 'morning'
              ? { ...child, morningTasks: updated }
              : { ...child, eveningTasks: updated };
          }),
        })),
      confirmAvatar: (childId, avatarType) =>
        set((state) => ({
          children: state.children.map((child) =>
            child.id !== childId
              ? child
              : {
                  ...child,
                  avatarType,
                  colour: AVATAR_COLOUR_MAP[avatarType],
                  avatarConfirmed: true,
                }
          ),
        })),
      updateStreakSettings: (settings) =>
        set((state) => ({
          streakSettings: { ...state.streakSettings, ...settings },
        })),
      resetDay: () => set((state) => ({
        children: state.children.map((child) => ({
          ...child,
          morningTasks: child.morningTasks.map((t) => ({ ...t, isComplete: false })),
          eveningTasks: child.eveningTasks.map((t) => ({ ...t, isComplete: false })),
        })),
      })),
      parentUnlocked: false,
      unlockParent: (pin) => {
        if (pin === '1234') {
          set({ parentUnlocked: true });
          return true;
        }
        return false;
      },
      lockParent: () => set({ parentUnlocked: false }),
      lastResetDate: new Date().toISOString().slice(0, 10),
      checkAndResetIfNewDay: () => set((state) => {
        const today = new Date().toISOString().slice(0, 10);
        if (state.lastResetDate === today) return state;
        return {
          lastResetDate: today,
          children: state.children.map((child) => ({
            ...child,
            morningTasks: child.morningTasks.map((t) => ({ ...t, isComplete: false })),
            eveningTasks: child.eveningTasks.map((t) => ({ ...t, isComplete: false })),
          })),
        };
      }),
    }),
    {
      name: 'ready-set-go-v1',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 2) {
          // Migrate single streak → morningStreak + eveningStreak
          const children = state.children as Array<Record<string, unknown>> | undefined;
          if (Array.isArray(children)) {
            state.children = children.map((c) => ({
              ...c,
              morningStreak: c.morningStreak ?? c.streak ?? 0,
              eveningStreak: c.eveningStreak ?? c.streak ?? 0,
            }));
          }
        }
        return state;
      },
      partialize: (state) => ({
        children: state.children,
        mode: state.mode,
        lastResetDate: state.lastResetDate,
        streakSettings: state.streakSettings,
      }),
    }
  )
);
