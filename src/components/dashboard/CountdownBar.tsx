import type { RoutineMode } from '@/types';

interface CountdownBarProps {
  label: string;
  minutesRemaining: number;
  mode: RoutineMode;
  windowMinutes?: number;
}

function getTrackColour(minutesRemaining: number): string {
  if (minutesRemaining > 30) return '#22C55E';
  if (minutesRemaining >= 10) return '#F59E0B';
  return '#EF4444';
}

export default function CountdownBar({
  label,
  minutesRemaining,
  mode,
  windowMinutes = 120,
}: CountdownBarProps) {
  const isLate = minutesRemaining < 0;
  const clampedRemaining = Math.max(0, minutesRemaining);
  // fillPercent = how much of the bar is REMAINING (rocket sits at this point)
  const fillPercent = Math.min(100, Math.max(0, (clampedRemaining / windowMinutes) * 100));
  const trackColour = getTrackColour(minutesRemaining);
  const modeEmoji = mode === 'morning' ? '🏁' : '🌙';
  const markerEmoji = mode === 'morning' ? '🏎️' : '⭐';

  const timeLabel = isLate
    ? `${Math.abs(minutesRemaining)} min late!`
    : `${minutesRemaining} min left`;

  // Number of blocks to show (10 blocks total)
  const BLOCKS = 10;
  const filledBlocks = Math.round((fillPercent / 100) * BLOCKS);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${label}: ${timeLabel}`}
      style={{
        padding: '10px 16px 12px',
        background: 'var(--color-surface)',
        borderTop: `3px solid ${trackColour}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flexShrink: 0,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '20px', lineHeight: 1 }}>{modeEmoji}</span>
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: '13px',
              color: 'var(--color-text)',
              opacity: 0.8,
            }}
          >
            {label}
          </span>
        </span>
        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: '15px',
            color: trackColour,
            whiteSpace: 'nowrap',
          }}
          className={isLate ? 'animate-pulse-soft' : undefined}
        >
          {timeLabel}
        </span>
      </div>

      {/* Fuel gauge track */}
      <div style={{ position: 'relative', height: '28px', display: 'flex', alignItems: 'center' }}>
        {/* Background track */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '14px',
            background: 'var(--color-bg)',
            border: `2px solid ${trackColour}`,
            overflow: 'hidden',
          }}
        >
          {/* Filled portion (remaining time) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${fillPercent}%`,
              background: `linear-gradient(90deg, ${trackColour}99, ${trackColour})`,
              borderRadius: '12px',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {/* Block dividers overlaid on the track */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: BLOCKS - 1 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '20%',
                  bottom: '20%',
                  left: `${((i + 1) / BLOCKS) * 100}%`,
                  width: '2px',
                  background: 'var(--color-surface)',
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* Marker emoji that slides to the fill boundary */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${fillPercent}% - 16px)`,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '20px',
            lineHeight: 1,
            transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
            zIndex: 2,
            pointerEvents: 'none',
          }}
          className={filledBlocks <= 2 ? 'animate-pulse-soft' : undefined}
        >
          {markerEmoji}
        </div>
      </div>
    </div>
  );
}
