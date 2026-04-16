import type { Icon } from '@phosphor-icons/react';
import {
  Alarm,
  Backpack,
  Bathtub,
  Bed,
  Books,
  ForkKnife,
  Moon,
  Shower,
  Sneaker,
  Sun,
  TShirt,
  Tooth,
} from '@phosphor-icons/react';

/**
 * Maps task labels to Phosphor icon components (Bold weight, large touch targets).
 * Falls back to emoji rendering in KidCard for labels not listed here.
 */
export const TASK_ICON_MAP: Record<string, Icon> = {
  'Make Bed': Bed,
  'Eat Breakfast': ForkKnife,
  'Brush Teeth': Tooth,
  'Get Dressed': TShirt,
  'Pack Bag': Backpack,
  'Check Bag': Backpack,
  'Make Lunch': ForkKnife,
  'Sunblock': Sun,
  'Shoes': Sneaker,
  'Eat Dinner': ForkKnife,
  'Bath': Bathtub,
  'Shower': Shower,
  'Pyjamas': Moon,
  'Read': Books,
  'Bedtime': Moon,
  'Set Alarm': Alarm,
};
