export type AvatarType = 'car' | 'unicorn' | 'axolotl' | 'rocket' | 'dragon' | 'cat';
export type RoutineMode = 'morning' | 'evening';

export interface Task {
  id: string;
  label: string;
  icon: string;
  isComplete: boolean;
  order: number;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  avatarType: AvatarType;
  colour: string;
  morningTasks: Task[];
  eveningTasks: Task[];
  morningTarget: string;
  eveningTarget: string;
  morningStreak: number;
  eveningStreak: number;
  /** @deprecated use morningStreak / eveningStreak — kept for migration only */
  streak?: number;
  avatarConfirmed?: boolean;  // undefined = treat as confirmed (backward compat)
}

export interface StreakSettings {
  /** If false, completing morning tasks on Sat/Sun does not increment morningStreak */
  morningCountsWeekends: boolean;
  /** If false, completing evening tasks on Sat/Sun does not increment eveningStreak */
  eveningCountsWeekends: boolean;
}
