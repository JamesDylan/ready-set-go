import type { AvatarType } from '@/types';

export const AVATAR_EMOJIS: Record<AvatarType, string> = {
  car: '🚗',
  unicorn: '🦄',
  axolotl: '🦎',
  rocket: '🚀',
  dragon: '🐲',
  cat: '🐱',
};

export const AVATAR_OPTIONS: { type: AvatarType; emoji: string; label: string }[] = [
  { type: 'car',      emoji: '🚗', label: 'Car' },
  { type: 'unicorn',  emoji: '🦄', label: 'Unicorn' },
  { type: 'axolotl',  emoji: '🦎', label: 'Axolotl' },
  { type: 'rocket',   emoji: '🚀', label: 'Rocket' },
  { type: 'dragon',   emoji: '🐲', label: 'Dragon' },
  { type: 'cat',      emoji: '🐱', label: 'Cat' },
];

export const AVATAR_COLOUR_MAP: Record<AvatarType, string> = {
  car:      'griff',
  unicorn:  'harriet',
  axolotl:  'evie',
  rocket:   'rocket',
  dragon:   'dragon',
  cat:      'cat',
};
