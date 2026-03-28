'use client';
import { useState, useEffect, useCallback } from 'react';

interface PINGateProps {
  onAttempt: (pin: string) => boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;
const PIN_LENGTH = 4;

export default function PINGate({ onAttempt, onSuccess, onCancel }: PINGateProps) {
  const [digits, setDigits] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedOut, setLockedOut] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle lockout countdown
  useEffect(() => {
    if (!lockedOut) return;
    setCountdown(LOCKOUT_SECONDS);
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setLockedOut(false);
          setAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [lockedOut]);

  const triggerWrong = useCallback(() => {
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setDigits([]);
    }, 400);
  }, []);

  const handleDigit = useCallback(
    (d: string) => {
      if (lockedOut) return;
      setDigits((prev) => {
        if (prev.length >= PIN_LENGTH) return prev;
        const next = [...prev, d];
        if (next.length === PIN_LENGTH) {
          const pin = next.join('');
          const correct = onAttempt(pin);
          if (correct) {
            onSuccess();
            return next;
          }
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (newAttempts >= MAX_ATTEMPTS) {
            setLockedOut(true);
          }
          triggerWrong();
          return prev;
        }
        return next;
      });
    },
    [lockedOut, attempts, onAttempt, onSuccess, triggerWrong]
  );

  const handleBackspace = useCallback(() => {
    if (lockedOut) return;
    setDigits((prev) => prev.slice(0, -1));
  }, [lockedOut]);

  const pad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '⌫'],
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}
    >
      <div
        style={{
          width: 380,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Header */}
        <div style={{ fontSize: 40, marginBottom: 8 }}>🔒</div>
        <div
          style={{
            fontFamily: 'var(--font-fredoka-one), system-ui',
            fontSize: 24,
            color: '#3B0764',
            marginBottom: 4,
          }}
        >
          Parent Area
        </div>
        <div
          style={{
            fontFamily: 'var(--font-nunito), system-ui',
            fontSize: 16,
            color: '#6B7280',
            marginBottom: 24,
          }}
        >
          {lockedOut ? `Try again in ${countdown} seconds` : 'Enter your PIN'}
        </div>

        {/* PIN dots */}
        <div
          className={shaking ? 'animate-shake' : ''}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 12,
            marginBottom: 24,
          }}
        >
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: digits[i] !== undefined ? '#7B2FBE' : '#FFFFFF',
                border: '2px solid #7B2FBE',
              }}
            />
          ))}
        </div>

        {/* Number pad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 80px)',
            gap: 8,
            marginBottom: 16,
          }}
        >
          {pad.flat().map((key, idx) => {
            if (key === '') {
              return <div key={idx} style={{ width: 80, height: 64 }} />;
            }
            const isBackspace = key === '⌫';
            return (
              <button
                key={idx}
                type="button"
                disabled={lockedOut}
                onClick={() => {
                  if (isBackspace) {
                    handleBackspace();
                  } else {
                    handleDigit(key);
                  }
                }}
                style={{
                  width: 80,
                  height: 64,
                  borderRadius: 16,
                  border: 'none',
                  backgroundColor: '#F3F4F6',
                  color: '#3B0764',
                  fontFamily: 'var(--font-fredoka-one), system-ui',
                  fontSize: 28,
                  cursor: lockedOut ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.1s',
                  opacity: lockedOut ? 0.5 : 1,
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)';
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Cancel */}
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-nunito), system-ui',
            fontSize: 16,
            color: '#9CA3AF',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
