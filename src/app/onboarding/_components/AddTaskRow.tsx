'use client';
import React, { useState } from 'react';

const QUICK_EMOJIS = ['✨','🎨','📖','🧹','🐕','🌱','🏃','🧺','🎹','🧩','🥗','💊','🚲','🛁','🪴','🎯','📝','💤'];

interface AddTaskRowProps {
  onAdd: (label: string, icon: string) => void;
  maxReached: boolean;
}

export function AddTaskRow({ onAdd, maxReached }: AddTaskRowProps) {
  const [active, setActive] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [icon, setIcon] = useState('✨');
  const [showEmoji, setShowEmoji] = useState(false);

  if (maxReached) return null;

  function commit() {
    const trimmed = inputVal.trim();
    if (trimmed.length > 0) {
      onAdd(trimmed, icon);
      setInputVal('');
      setIcon('✨');
    }
    setActive(false);
    setShowEmoji(false);
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
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); setShowEmoji((v) => !v); }}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: '1.5px solid #DDD6FE',
            backgroundColor: 'var(--color-bg)',
            fontSize: 18, cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >{icon}</button>
      </div>

      {showEmoji && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 44,
          zIndex: 10,
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 4,
          width: 210,
        }}>
          {QUICK_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onMouseDown={(ev) => { ev.preventDefault(); setIcon(e); setShowEmoji(false); }}
              style={{
                width: 32, height: 32, borderRadius: 8, border: 'none',
                backgroundColor: e === icon ? 'var(--color-bg)' : 'transparent',
                fontSize: 18, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >{e}</button>
          ))}
        </div>
      )}
    </div>
  );
}
