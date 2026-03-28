'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { AvatarType } from '@/types';

interface CharacterAvatarProps {
  avatarType: AvatarType;
  size?: number;
  className?: string;
}

const avatarConfig: Record<AvatarType, { src: string; bg: string }> = {
  car:      { src: '/animations/griff.lottie',   bg: 'var(--color-griff-glow)' },
  unicorn:  { src: '/animations/harriet.lottie', bg: 'var(--color-harriet-glow)' },
  axolotl:  { src: '/animations/evie.lottie',    bg: 'var(--color-evie-glow)' },
};

export default function CharacterAvatar({
  avatarType,
  size = 80,
  className = '',
}: CharacterAvatarProps) {
  const { src, bg } = avatarConfig[avatarType];

  return (
    <div
      className={`flex items-center justify-center rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size, backgroundColor: bg, flexShrink: 0 }}
      aria-label={avatarType}
    >
      <DotLottieReact
        src={src}
        autoplay
        loop
        style={{ width: size, height: size }}
      />
    </div>
  );
}
