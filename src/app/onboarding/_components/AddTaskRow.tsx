'use client';
import React, { useState } from 'react';
import { ICON_KEY_MAP, ICON_PICKER_LIST } from '@/lib/taskIcons';

interface AddTaskRowProps {
  onAdd: (label: string, icon: string) => void;
  maxReached: boolean;
}

export function AddTaskRow({ onAdd, maxReached }: AddTaskRowProps) {
  const [active, setActive] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [iconKey, setIconKey] = useState('Star');
  const [showPicker, setShowPicker] = useState(false);

  if (maxReached) return null;

  function commit() {
    const trimmed = inputVal.trim();
    if (trimmed.length > 0) {
      onAdd(trimmed, iconKey);
      setInputVal('');
      setIconKey('Star');
    }
    setActive(false);
    setShowPicker(false);
  }

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '10px 4px',
          minHeight: 44,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderTop: '1px dashed #DDD6FE',
          marginTop: 4,
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '2px solid var(--color-brand)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: 'var(--color-brand)', flexShrink: 0,
        }}>+</div>
        <span style={{
          fontFamily: 'var(--font-nunito), system-ui',
          fontWeight: 600,
          fontSize: 14,
          color: 'var(--color-text)',
          opacity: 0.45,
        }}>Add a task...</span>
      </button>
    );
  }

  const CurrentIcon = ICON_KEY_MAP[iconKey];

  return (
    <div style={{ position: 'relative', borderTop: '1px dashed #DDD6FE', paddingTop: 8, marginTop: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          backgroundColor: '#10B981',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0,
        }}>✓</div>
        <input
          autoFocus
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
          placeholder="What's the task?"
          style={{
            flex: 1,
            fontFamily: 'var(--font-nunito), system-ui',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--color-text)',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            minWidth: 0,
          }}
        />
        {/* Icon picker trigger */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); setShowPicker((v) => !v); }}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: '1.5px solid #DDD6FE',
            backgroundColor: 'var(--color-bg)',
            cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Choose icon"
        >
          {CurrentIcon
            ? <CurrentIcon size={18} weight="bold" style={{ color: 'var(--color-brand)' }} />
            : <span style={{ fontSize: 16 }}>{iconKey}</span>}
        </button>
      </div>

      {showPicker && (
        <div style={{
          position: 'absolute',
          right: 0,
          bottom: '110%',
          zIndex: 50,
          backgroundColor: '#fff',
          borderRadius: 12,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          border: '1px solid #E5E7EB',
          width: 268,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 38px)',
            gap: 4,
            padding: 10,
            maxHeight: 220,
            overflowY: 'auto',
          }}>
            {ICON_PICKER_LIST.map(({ key, Icon }) => (
              <button
                key={key}
                type="button"
                onMouseDown={(ev) => { ev.preventDefault(); setIconKey(key); setShowPicker(false); }}
                style={{
                  width: 38, height: 38, borderRadius: 8,
                  border: key === iconKey ? '1.5px solid #C084FC' : '1px solid transparent',
                  backgroundColor: key === iconKey ? '#F3E8FF' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon size={20} weight="bold" style={{ color: 'var(--color-brand)' }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
