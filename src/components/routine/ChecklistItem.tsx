import type { Task } from '@/types';

interface ChecklistItemProps {
  task: Task;
  kidColour: string;
}

export default function ChecklistItem({ task, kidColour }: ChecklistItemProps) {
  const containerStyle: React.CSSProperties = task.isComplete
    ? {
        backgroundColor: '#D1FAE5',
        borderColor: '#10B981',
        borderWidth: '2px',
        borderStyle: 'solid',
      }
    : {
        backgroundColor: '#FFFFFF',
        borderLeftColor: `var(--color-${kidColour})`,
        borderLeftWidth: '4px',
        borderTopColor: '#E5E7EB',
        borderRightColor: '#E5E7EB',
        borderBottomColor: '#E5E7EB',
        borderTopWidth: '2px',
        borderRightWidth: '2px',
        borderBottomWidth: '2px',
        borderStyle: 'solid',
      };

  return (
    <div
      style={{
        ...containerStyle,
        borderRadius: '16px',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 12px',
        position: 'relative',
        cursor: 'default',
        boxSizing: 'border-box',
      }}
    >
      {/* Completion badge */}
      {task.isComplete && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          ✓
        </div>
      )}

      {/* Emoji icon */}
      <span
        style={{
          fontSize: '56px',
          lineHeight: 1,
          display: 'block',
          textAlign: 'center',
        }}
      >
        {task.icon}
      </span>

      {/* Task label */}
      <span
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: 1.3,
          textAlign: 'center',
          marginTop: '20px',
          color: task.isComplete ? '#9CA3AF' : 'var(--color-text)',
          textDecoration: task.isComplete ? 'line-through' : 'none',
        }}
      >
        {task.label}
      </span>
    </div>
  );
}
