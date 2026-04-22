'use client';
import { useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { RoutineMode } from '@/types';
import { TASK_ICON_MAP } from '@/lib/taskIcons';
import CharacterAvatar from '@/components/shared/CharacterAvatar';

interface RoutineEditorProps {
  childId: string;
  onBack: () => void;
  hideHeader?: boolean;
}

const ROUTINE_EMOJIS = [
  // Morning & hygiene
  '☀️', '🌅', '🛏️', '🚿', '🛁', '🪥', '🧼', '🪒', '💊', '🧻',
  // Hair
  '🪮', '💇', '💈', '✂️',
  // Clothing & accessories
  '👕', '👗', '👖', '👟', '🥿', '🧦', '🧤', '🧢', '🎒', '👜', '👒',
  // Food & drink
  '🍽️', '🥣', '🍳', '🥞', '🥐', '🍎', '🍌', '🥛', '🥤', '🧃', '☕', '🫖',
  // School & learning
  '🏫', '📚', '📖', '📝', '✏️', '🖍️', '📐', '🔬',
  // Evening & bedtime
  '🌙', '😴', '🌟', '⭐', '💫', '🌛',
  // Activities & exercise
  '🏃', '💪', '🧘', '🚲', '⚽', '🏊', '🎨', '🎵', '🎸', '🤸',
  // Outdoors & nature
  '🌿', '🌸', '🌈', '🌤️', '☂️', '🧴',
  // Pets
  '🐶', '🐱', '🐠', '🐹',
  // Tech & devices
  '📱', '💻', '🎮', '📺',
  // Misc fun
  '🦷', '👋', '🙌', '🤝', '❤️', '😊', '🎉', '🍀',
];


export default function RoutineEditor({ childId, onBack, hideHeader = false }: RoutineEditorProps) {
  const children = useAppStore((s) => s.children);
  const addTask = useAppStore((s) => s.addTask);
  const removeTask = useAppStore((s) => s.removeTask);
  const reorderTasks = useAppStore((s) => s.reorderTasks);
  const updateTargetTime = useAppStore((s) => s.updateTargetTime);
  const updateTaskLabel = useAppStore((s) => s.updateTaskLabel);
  const updateTaskIcon = useAppStore((s) => s.updateTaskIcon);

  const child = children.find((c) => c.id === childId);

  const [selectedMode, setSelectedMode] = useState<RoutineMode>('morning');
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newTaskEmoji, setNewTaskEmoji] = useState('⭐');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingTimeMode, setEditingTimeMode] = useState(false);
  const [pendingTime, setPendingTime] = useState('');
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editingLabelValue, setEditingLabelValue] = useState('');
  const [editingIconTaskId, setEditingIconTaskId] = useState<string | null>(null);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const iconPickerRef = useRef<HTMLDivElement>(null);

  if (!child) return null;

  const tasks = selectedMode === 'morning' ? child.morningTasks : child.eveningTasks;
  const targetTime = selectedMode === 'morning' ? child.morningTarget : child.eveningTarget;

  const handleAddTask = () => {
    const trimmed = newTaskLabel.trim();
    if (!trimmed) return;
    addTask(childId, selectedMode, trimmed, newTaskEmoji);
    setNewTaskLabel('');
    setNewTaskEmoji('⭐');
  };

  const handleDeleteTask = (taskId: string) => {
    setDeletingTaskId(taskId);
    setTimeout(() => {
      removeTask(childId, selectedMode, taskId);
      setDeletingTaskId(null);
    }, 300);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const ids = tasks.map((t) => t.id);
    const newIds = [...ids];
    [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
    reorderTasks(childId, selectedMode, newIds);
  };

  const handleMoveDown = (index: number) => {
    if (index === tasks.length - 1) return;
    const ids = tasks.map((t) => t.id);
    const newIds = [...ids];
    [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    reorderTasks(childId, selectedMode, newIds);
  };

  const handleLabelClick = (taskId: string, currentLabel: string) => {
    setEditingLabelId(taskId);
    setEditingLabelValue(currentLabel);
  };

  const handleLabelCommit = (taskId: string, originalLabel: string) => {
    const trimmed = editingLabelValue.trim();
    if (trimmed && trimmed !== originalLabel) {
      updateTaskLabel(childId, selectedMode, taskId, trimmed);
    }
    setEditingLabelId(null);
    setEditingLabelValue('');
  };

  const handleTimeEdit = () => {
    setPendingTime(targetTime);
    setEditingTimeMode(true);
  };

  const handleTimeCommit = () => {
    if (pendingTime) {
      updateTargetTime(childId, selectedMode, pendingTime);
    }
    setEditingTimeMode(false);
  };

  // avatarEmoji kept for compatibility but CharacterAvatar used in JSX

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header row — hidden when ParentPanel renders its own header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {!hideHeader && (
          <>
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
                color: '#6B7280',
                padding: '4px 8px',
                borderRadius: 8,
                lineHeight: 1,
              }}
              aria-label="Back"
            >
              ←
            </button>
            <CharacterAvatar avatarType={child.avatarType} size={32} />
            <span
              style={{
                fontFamily: 'var(--font-fredoka-one), system-ui',
                fontSize: 22,
                color: '#3B0764',
                flex: 1,
              }}
            >
              {child.name}
            </span>
          </>
        )}
        {/* Morning / Evening toggle */}
        <div style={{ marginLeft: hideHeader ? 0 : undefined, flex: hideHeader ? 1 : undefined, display: 'flex', justifyContent: hideHeader ? 'flex-start' : undefined }}>
          <div
            style={{
              display: 'flex',
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid #E5E7EB',
            }}
          >
            {(['morning', 'evening'] as RoutineMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMode(m)}
                style={{
                  fontFamily: 'var(--font-nunito), system-ui',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '6px 14px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedMode === m ? '#7B2FBE' : '#F9FAFB',
                  color: selectedMode === m ? '#FFFFFF' : '#6B7280',
                  transition: 'background-color 0.15s',
                  borderRadius: selectedMode === m ? 6 : 0,
                }}
              >
                {m === 'morning' ? '☀️ Morning' : '🌙 Evening'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target time row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 16,
          padding: '10px 14px',
          backgroundColor: '#F9FAFB',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
        }}
      >
        <span style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 14, color: '#4B5563', flex: 1 }}>
          ⏰ Target time:
        </span>
        {editingTimeMode ? (
          <>
            <input
              type="time"
              value={pendingTime}
              onChange={(e) => setPendingTime(e.target.value)}
              style={{
                fontFamily: 'var(--font-nunito), system-ui',
                fontSize: 14,
                border: '1px solid #D1D5DB',
                borderRadius: 8,
                padding: '4px 8px',
                color: '#3B0764',
              }}
            />
            <button
              type="button"
              onClick={handleTimeCommit}
              style={{
                fontFamily: 'var(--font-nunito), system-ui',
                fontSize: 13,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#7B2FBE',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <span style={{ fontFamily: 'var(--font-nunito), system-ui', fontSize: 14, fontWeight: 700, color: '#3B0764' }}>
              {targetTime}
            </span>
            <button
              type="button"
              onClick={handleTimeEdit}
              style={{
                fontFamily: 'var(--font-nunito), system-ui',
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#6B7280',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
          </>
        )}
      </div>

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {tasks.length === 0 && (
          <div
            style={{
              fontFamily: 'var(--font-nunito), system-ui',
              fontSize: 14,
              color: '#9CA3AF',
              textAlign: 'center',
              padding: '24px 0',
            }}
          >
            No tasks yet — add one below.
          </div>
        )}
        {tasks.map((task, index) => {
          const isDeleting = deletingTaskId === task.id;
          const isEditingLabel = editingLabelId === task.id;
          const TaskPhosphorIcon = TASK_ICON_MAP[task.label];
          return (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 64,
                gap: 8,
                padding: '0 12px',
                borderRadius: 12,
                border: '1px solid #E5E7EB',
                backgroundColor: isDeleting ? '#FEE2E2' : task.isComplete ? '#F9FAFB' : '#FFFFFF',
                opacity: task.isComplete ? 0.6 : 1,
                transition: 'background-color 0.3s',
              }}
            >
              {/* Up/Down buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  aria-label="Move up"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 12,
                    cursor: index === 0 ? 'default' : 'pointer',
                    color: index === 0 ? '#D1D5DB' : '#9CA3AF',
                    padding: '2px 4px',
                    lineHeight: 1,
                    minWidth: 20,
                    minHeight: 20,
                  }}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === tasks.length - 1}
                  aria-label="Move down"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 12,
                    cursor: index === tasks.length - 1 ? 'default' : 'pointer',
                    color: index === tasks.length - 1 ? '#D1D5DB' : '#9CA3AF',
                    padding: '2px 4px',
                    lineHeight: 1,
                    minWidth: 20,
                    minHeight: 20,
                  }}
                >
                  ▼
                </button>
              </div>

              {/* Icon — tap to edit */}
              <div style={{ position: 'relative', flexShrink: 0 }} ref={editingIconTaskId === task.id ? iconPickerRef : undefined}>
                <button
                  type="button"
                  onClick={() => setEditingIconTaskId(editingIconTaskId === task.id ? null : task.id)}
                  aria-label={`Change icon for ${task.label}`}
                  style={{
                    fontSize: 24,
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: editingIconTaskId === task.id ? '#F3E8FF' : 'none',
                    border: editingIconTaskId === task.id ? '1px solid #C084FC' : '1px solid transparent',
                    borderRadius: 8,
                    cursor: 'pointer',
                    lineHeight: 1,
                  }}
                >
                  {TaskPhosphorIcon ? (
                    <TaskPhosphorIcon size={22} weight="bold" style={{ color: '#7B2FBE' }} />
                  ) : (
                    task.icon
                  )}
                </button>
                {editingIconTaskId === task.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '110%',
                      left: 0,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 12,
                      padding: 10,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 38px)',
                      gap: 4,
                      zIndex: 50,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                      maxHeight: 220,
                      overflowY: 'auto',
                      width: 268,
                    }}
                  >
                    {ROUTINE_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          updateTaskIcon(childId, selectedMode, task.id, emoji);
                          setEditingIconTaskId(null);
                        }}
                        style={{
                          width: 38,
                          height: 38,
                          fontSize: 20,
                          background: emoji === task.icon ? '#F3E8FF' : 'none',
                          border: emoji === task.icon ? '1px solid #C084FC' : '1px solid transparent',
                          borderRadius: 8,
                          cursor: 'pointer',
                          lineHeight: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Label — editable on tap */}
              {isEditingLabel ? (
                <input
                  autoFocus
                  value={editingLabelValue}
                  onChange={(e) => setEditingLabelValue(e.target.value)}
                  onBlur={() => handleLabelCommit(task.id, task.label)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLabelCommit(task.id, task.label);
                    if (e.key === 'Escape') { setEditingLabelId(null); setEditingLabelValue(''); }
                  }}
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-nunito), system-ui',
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#3B0764',
                    border: '1px solid #C084FC',
                    borderRadius: 8,
                    padding: '4px 8px',
                    outline: 'none',
                    backgroundColor: '#FAF5FF',
                  }}
                />
              ) : (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => handleLabelClick(task.id, task.label)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLabelClick(task.id, task.label); }}
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-nunito), system-ui',
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#3B0764',
                    cursor: 'text',
                    padding: '4px 2px',
                    borderRadius: 6,
                    textDecoration: task.isComplete ? 'line-through' : 'none',
                  }}
                >
                  {task.label}
                </span>
              )}

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleDeleteTask(task.id)}
                aria-label={`Delete ${task.label}`}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 18,
                  cursor: 'pointer',
                  color: '#EF4444',
                  padding: '4px 6px',
                  borderRadius: 8,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>

      {/* Add task row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 14px',
          backgroundColor: '#F9FAFB',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          position: 'relative',
        }}
      >
        {/* Emoji picker button */}
        <div style={{ position: 'relative' }} ref={emojiPickerRef}>
          <button
            type="button"
            onClick={() => setShowEmojiPicker((p) => !p)}
            style={{
              fontSize: 24,
              background: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: 10,
              padding: '4px 8px',
              cursor: 'pointer',
              lineHeight: 1,
            }}
            aria-label="Choose emoji"
          >
            {newTaskEmoji}
          </button>
          {showEmojiPicker && (
            <div
              style={{
                position: 'absolute',
                bottom: '110%',
                left: 0,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 14,
                padding: 10,
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 38px)',
                gap: 4,
                zIndex: 50,
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                maxHeight: 240,
                overflowY: 'auto',
                width: 268,
              }}
            >
              {ROUTINE_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => { setNewTaskEmoji(emoji); setShowEmojiPicker(false); }}
                  style={{
                    width: 38,
                    height: 38,
                    fontSize: 20,
                    background: emoji === newTaskEmoji ? '#F3E8FF' : 'none',
                    border: emoji === newTaskEmoji ? '1px solid #C084FC' : '1px solid transparent',
                    borderRadius: 8,
                    cursor: 'pointer',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text input */}
        <input
          type="text"
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
          placeholder="Task name..."
          style={{
            flex: 1,
            fontFamily: 'var(--font-nunito), system-ui',
            fontSize: 14,
            border: '1px solid #D1D5DB',
            borderRadius: 10,
            padding: '8px 12px',
            color: '#3B0764',
            outline: 'none',
            backgroundColor: '#FFFFFF',
          }}
        />

        {/* Add button */}
        <button
          type="button"
          onClick={handleAddTask}
          disabled={!newTaskLabel.trim()}
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontSize: 14,
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: 10,
            border: 'none',
            backgroundColor: newTaskLabel.trim() ? '#7B2FBE' : '#E5E7EB',
            color: newTaskLabel.trim() ? '#FFFFFF' : '#9CA3AF',
            cursor: newTaskLabel.trim() ? 'pointer' : 'default',
            transition: 'background-color 0.15s',
            flexShrink: 0,
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
