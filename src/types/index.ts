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
  streak: number;
  avatarConfirmed?: boolean;  // undefined = treat as confirmed (backward compat)
}
