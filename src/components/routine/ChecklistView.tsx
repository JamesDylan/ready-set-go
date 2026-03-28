import type { Task } from '@/types';
import ChecklistItem from './ChecklistItem';

interface ChecklistViewProps {
  tasks: Task[];
  kidColour: string;
  kidName: string;
}

export default function ChecklistView({ tasks, kidColour, kidName }: ChecklistViewProps) {
  const completedCount = tasks.filter((t) => t.isComplete).length;
  const totalCount = tasks.length;
  const allDone = completedCount === totalCount && totalCount > 0;

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div style={{ padding: '16px' }}>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: '20px',
            color: 'var(--color-text)',
          }}
        >
          {kidName}&apos;s Morning Routine
        </span>

        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            color: `var(--color-${kidColour})`,
          }}
        >
          {completedCount} / {totalCount} ✓
        </span>
      </div>

      {/* All done banner */}
      {allDone && (
        <div
          style={{
            backgroundColor: '#D1FAE5',
            border: '2px solid #10B981',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            textAlign: 'center',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            color: '#065F46',
          }}
        >
          All done! 🎉
        </div>
      )}

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
      >
        {sortedTasks.map((task) => (
          <ChecklistItem key={task.id} task={task} kidColour={kidColour} />
        ))}
      </div>
    </div>
  );
}
