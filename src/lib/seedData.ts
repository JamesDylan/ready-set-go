import type { Child, Task } from '@/types';

export type AgeBand = 'little' | 'school' | 'independent';

/**
 * Maps a child's age to an age band used for task generation.
 * @param age - The child's age in years
 * @returns The age band: 'little' (≤5), 'school' (6–8), or 'independent' (9+)
 */
export function getAgeBand(age: number): AgeBand {
  if (age <= 5) return 'little';
  if (age <= 8) return 'school';
  return 'independent';
}

function makeMorningTasks(completedCount: number): Task[] {
  const tasks: Array<{ label: string; icon: string }> = [
    { label: 'Make Bed', icon: '🛏️' },
    { label: 'Eat Breakfast', icon: '🥣' },
    { label: 'Brush Teeth', icon: '🪥' },
    { label: 'Get Dressed', icon: '👕' },
    { label: 'Pack Bag', icon: '🎒' },
    { label: 'Sunblock', icon: '☀️' },
    { label: 'Shoes', icon: '👟' },
  ];
  return tasks.map((t, i) => ({
    id: `morning-${i + 1}`,
    label: t.label,
    icon: t.icon,
    isComplete: i < completedCount,
    order: i + 1,
  }));
}

function makeEveningTasks(): Task[] {
  const tasks: Array<{ label: string; icon: string }> = [
    { label: 'Eat Dinner', icon: '🍽️' },
    { label: 'Brush Teeth', icon: '🪥' },
    { label: 'Bath', icon: '🛁' },
    { label: 'Pyjamas', icon: '🌙' },
    { label: 'Read', icon: '📚' },
    { label: 'Bedtime', icon: '⭐' },
  ];
  return tasks.map((t, i) => ({
    id: `evening-${i + 1}`,
    label: t.label,
    icon: t.icon,
    isComplete: false,
    order: i + 1,
  }));
}

/**
 * Returns age-appropriate morning tasks for onboarding a new child.
 * @param ageBand - The child's age band; defaults to 'school'
 */
export function makeMorningTasksForOnboarding(ageBand: AgeBand = 'school'): Task[] {
  const tasksByBand: Record<AgeBand, Array<{ label: string; icon: string }>> = {
    little: [
      { label: 'Make Bed', icon: '🛏️' },
      { label: 'Eat Breakfast', icon: '🥣' },
      { label: 'Brush Teeth', icon: '🪥' },
      { label: 'Get Dressed', icon: '👕' },
      { label: 'Shoes', icon: '👟' },
    ],
    school: [
      { label: 'Make Bed', icon: '🛏️' },
      { label: 'Eat Breakfast', icon: '🥣' },
      { label: 'Brush Teeth', icon: '🪥' },
      { label: 'Get Dressed', icon: '👕' },
      { label: 'Pack Bag', icon: '🎒' },
      { label: 'Sunblock', icon: '☀️' },
      { label: 'Shoes', icon: '👟' },
    ],
    independent: [
      { label: 'Make Bed', icon: '🛏️' },
      { label: 'Eat Breakfast', icon: '🥣' },
      { label: 'Brush Teeth', icon: '🪥' },
      { label: 'Get Dressed', icon: '👕' },
      { label: 'Pack Bag', icon: '🎒' },
      { label: 'Make Lunch', icon: '🥪' },
      { label: 'Check Bag', icon: '🎒' },
      { label: 'Shoes', icon: '👟' },
    ],
  };
  return tasksByBand[ageBand].map((t, i) => ({
    id: `morning-${i + 1}`,
    label: t.label,
    icon: t.icon,
    isComplete: false,
    order: i + 1,
  }));
}

/**
 * Returns age-appropriate evening tasks for onboarding a new child.
 * @param ageBand - The child's age band; defaults to 'school'
 */
export function makeEveningTasksForOnboarding(ageBand: AgeBand = 'school'): Task[] {
  const tasksByBand: Record<AgeBand, Array<{ label: string; icon: string }>> = {
    little: [
      { label: 'Eat Dinner', icon: '🍽️' },
      { label: 'Bath', icon: '🛁' },
      { label: 'Pyjamas', icon: '🌙' },
      { label: 'Brush Teeth', icon: '🪥' },
      { label: 'Read', icon: '📚' },
      { label: 'Bedtime', icon: '⭐' },
    ],
    school: [
      { label: 'Eat Dinner', icon: '🍽️' },
      { label: 'Brush Teeth', icon: '🪥' },
      { label: 'Bath', icon: '🛁' },
      { label: 'Pyjamas', icon: '🌙' },
      { label: 'Read', icon: '📚' },
      { label: 'Bedtime', icon: '⭐' },
    ],
    independent: [
      { label: 'Eat Dinner', icon: '🍽️' },
      { label: 'Brush Teeth', icon: '🪥' },
      { label: 'Bath', icon: '🛁' },
      { label: 'Pyjamas', icon: '🌙' },
      { label: 'Read', icon: '📚' },
      { label: 'Set Alarm', icon: '⏰' },
      { label: 'Bedtime', icon: '⭐' },
    ],
  };
  return tasksByBand[ageBand].map((t, i) => ({
    id: `evening-${i + 1}`,
    label: t.label,
    icon: t.icon,
    isComplete: false,
    order: i + 1,
  }));
}

export function getEmptyDayData(): Child[] {
  return [
    {
      id: 'griff',
      name: 'Griff',
      age: 4,
      avatarType: 'car',
      colour: 'griff',
      morningTarget: '08:45',
      eveningTarget: '19:00',
      streak: 0,
      morningTasks: makeMorningTasks(0),
      eveningTasks: makeEveningTasks(),
    },
    {
      id: 'harriet',
      name: 'Harriet',
      age: 6,
      avatarType: 'unicorn',
      colour: 'harriet',
      morningTarget: '08:45',
      eveningTarget: '19:30',
      streak: 0,
      morningTasks: makeMorningTasks(0),
      eveningTasks: makeEveningTasks(),
    },
    {
      id: 'evie',
      name: 'Evie',
      age: 8,
      avatarType: 'axolotl',
      colour: 'evie',
      morningTarget: '08:45',
      eveningTarget: '20:00',
      streak: 0,
      morningTasks: makeMorningTasks(0),
      eveningTasks: makeEveningTasks(),
    },
  ];
}

export function getSeedData(): Child[] {
  return [
    {
      id: 'griff',
      name: 'Griff',
      age: 4,
      avatarType: 'car',
      colour: 'griff',
      morningTarget: '08:45',
      eveningTarget: '19:00',
      streak: 0,
      morningTasks: makeMorningTasks(0),
      eveningTasks: makeEveningTasks(),
    },
    {
      id: 'harriet',
      name: 'Harriet',
      age: 6,
      avatarType: 'unicorn',
      colour: 'harriet',
      morningTarget: '08:45',
      eveningTarget: '19:30',
      streak: 0,
      morningTasks: makeMorningTasks(0),
      eveningTasks: makeEveningTasks(),
    },
    {
      id: 'evie',
      name: 'Evie',
      age: 8,
      avatarType: 'axolotl',
      colour: 'evie',
      morningTarget: '08:45',
      eveningTarget: '20:00',
      streak: 0,
      morningTasks: makeMorningTasks(0),
      eveningTasks: makeEveningTasks(),
    },
  ];
}
