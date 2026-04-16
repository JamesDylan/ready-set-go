import type { SupabaseClient } from '@supabase/supabase-js';
import type { Child } from '@/types';

const STORAGE_KEY = 'unicorn-sparkles-v1'; // old key — reads existing user data before the rename
const MIGRATION_FLAG = 'ready-set-go-migrated';

interface PersistedState {
  state: {
    children: Child[];
    mode: string;
    lastResetDate: string;
  };
}

/**
 * Reads the existing unicorn-sparkles-v1 localStorage data and writes it to
 * Supabase if it has not been migrated yet.
 *
 * Returns true if migration ran, false if already done or no data found.
 */
export async function migrateLocalStorageToSupabase(
  supabase: SupabaseClient,
  familyId: string
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  if (localStorage.getItem(MIGRATION_FLAG) === 'true') {
    return false;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  let parsed: PersistedState;
  try {
    parsed = JSON.parse(raw) as PersistedState;
  } catch {
    return false;
  }

  const children: Child[] = parsed?.state?.children ?? [];
  if (children.length === 0) return false;

  const today = new Date().toISOString().slice(0, 10);

  for (const child of children) {
    const { data: insertedChild, error: childError } = await supabase
      .from('children')
      .insert({
        family_id: familyId,
        name: child.name,
        age: child.age,
        avatar_type: child.avatarType,
        colour: child.colour,
        morning_target: child.morningTarget,
        evening_target: child.eveningTarget,
        streak: child.streak,
      })
      .select('id')
      .single();

    if (childError || !insertedChild) continue;

    const childDbId: string = insertedChild.id;

    const allTasks = [
      ...child.morningTasks.map((t) => ({ ...t, mode: 'morning' as const })),
      ...child.eveningTasks.map((t) => ({ ...t, mode: 'evening' as const })),
    ];

    for (const task of allTasks) {
      const { data: insertedTask, error: taskError } = await supabase
        .from('tasks')
        .insert({
          child_id: childDbId,
          label: task.label,
          icon: task.icon,
          mode: task.mode,
          order: task.order,
        })
        .select('id')
        .single();

      if (taskError || !insertedTask) continue;

      if (task.isComplete) {
        await supabase.from('task_completions').insert({
          task_id: insertedTask.id,
          child_id: childDbId,
          completed_on: today,
        });
      }
    }
  }

  localStorage.setItem(MIGRATION_FLAG, 'true');
  return true;
}
