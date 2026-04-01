'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { AvatarType } from '@/types';

interface CharacterAvatarProps {
  avatarType: AvatarType;
  size?: number;
  className?: string;
}

type AvatarEntry =
  | { kind: 'lottie'; src: string; bg: string }
  | { kind: 'emoji'; emoji: string; bg: string };

const avatarConfig: Record<AvatarType, AvatarEntry> = {
  car:      { kind: 'lottie', src: '/animations/griff.lottie',   bg: 'var(--color-griff-glow)' },
  unicorn:  { kind: 'lottie', src: '/animations/harriet.lottie', bg: 'var(--color-harriet-glow)' },
  axolotl:  { kind: 'lottie', src: '/animations/evie.lottie',    bg: 'var(--color-evie-glow)' },
  rocket:   { kind: 'emoji', emoji: '🚀', bg: 'var(--color-rocket-glow)' },
  dragon:   { kind: 'emoji', emoji: '🐲', bg: 'var(--color-dragon-glow)' },
  cat:      { kind: 'emoji', emoji: '🐱', bg: 'var(--color-cat-glow)' },
};

export default function CharacterAvatar({
  avatarType,
  size = 80,
  className = '',
}: CharacterAvatarProps) {
  const config = avatarConfig[avatarType];

  return (
    <div
      className={`flex items-center justify-center rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size, backgroundColor: config.bg, flexShrink: 0 }}
      aria-label={avatarType}
    >
      {config.kind === 'lottie' ? (
        <DotLottieReact
          src={config.src}
          autoplay
          loop
          style={{ width: size, height: size }}
        />
      ) : (
        <span style={{ fontSize: Math.round(size * 0.55), lineHeight: 1 }}>{config.emoji}</span>
      )}
    </div>
  );
}
