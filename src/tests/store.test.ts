import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/store/useAppStore';

// Reset store state between tests
beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState());
});

describe('toggleTask', () => {
  it('marks an incomplete task as complete', () => {
    const { children } = useAppStore.getState();
    const child = children[0];
    const task = child.morningTasks[0];
    expect(task.isComplete).toBe(false);

    useAppStore.getState().toggleTask(child.id, task.id);

    const updated = useAppStore.getState().children[0].morningTasks[0];
    expect(updated.isComplete).toBe(true);
  });

  it('unchecks a completed task (regression: was broken by early return)', () => {
    const { children } = useAppStore.getState();
    const child = children[0];
    const task = child.morningTasks[0];

    // Complete it first
    useAppStore.getState().toggleTask(child.id, task.id);
    expect(useAppStore.getState().children[0].morningTasks[0].isComplete).toBe(true);

    // Now uncheck — this was the bug
    useAppStore.getState().toggleTask(child.id, task.id);
    expect(useAppStore.getState().children[0].morningTasks[0].isComplete).toBe(false);
  });
});
