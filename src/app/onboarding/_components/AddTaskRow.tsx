'use client';
import React, { useState } from 'react';

const QUICK_EMOJIS = [
  // Morning & hygiene
  '☀️','🌅','🛏️','🚿','🛁','🪥','🧼','💊','🧻',
  // Hair & clothing
  '🪮','💇','✂️','👕','👗','👖','👟','🧦','🧤','🧢','🎒',
  // Food & drink
  '🍽️','🥣','🍳','🥞','🥐','🍎','🍌','🥛','🥤','🧃','☕',
  // School & learning
  '🏫','📚','📖','📝','✏️','🖍️','🔬',
  // Evening & bedtime
  '🌙','😴','🌟','⭐','💫','🌛',
  // Activities
  '🏃','💪','🧘','🚲','⚽','🏊','🎨','🎵','🎸','🤸',
  // Nature & outdoors
  '🌿','🌸','🌈','🌤️','☂️',
  // Pets
  '🐶','🐱','🐠','🐹',
  // Misc fun
  '🦷','👋','🙌','❤️','😊','🎉','🍀','✨','🎯','🧩','🥗','🪴',
];

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
          bottom: '110%',
          zIndex: 50,
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 10,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 36px)',
          gap: 4,
          width: 'max-content',
          maxHeight: 220,
          overflowY: 'auto',
        }}>
          {QUICK_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onMouseDown={(ev) => { ev.preventDefault(); setIcon(e); setShowEmoji(false); }}
              style={{
                width: 36, height: 36, borderRadius: 8, border: 'none',
                backgroundColor: e === icon ? '#F3E8FF' : 'transparent',
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
