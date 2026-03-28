import type { Child, Task } from '@/types';

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

export function makeMorningTasksForOnboarding(): ReturnType<typeof makeMorningTasks> {
  return makeMorningTasks(0);
}

export function makeEveningTasksForOnboarding(): ReturnType<typeof makeEveningTasks> {
  return makeEveningTasks();
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
