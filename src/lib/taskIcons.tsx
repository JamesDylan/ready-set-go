import type { Icon } from '@phosphor-icons/react';
import {
  // Core routine icons
  Alarm, Backpack, Bathtub, Bed, Books, ForkKnife, Moon, Shower, Sneaker, Sun, TShirt, Tooth,
  // Extended set for custom tasks
  Avocado, Balloon, Barbell, Basketball, Bell, Bicycle, Bird, BowlFood, Bread,
  Broom, Bus, Camera, Car, Carrot, Cat, Cheese, Coffee, Cookie, Crown, Dog, Egg,
  Fish, FirstAidKit, Flame, FlowerLotus, Football, GameController, Gift, GraduationCap,
  Hamburger, HandWaving, Headphones, Heart, Heartbeat, House, Key, Leaf, Medal,
  MusicNote, Notebook, Palette, PaintBrush, Pen, PencilSimple, PersonSimpleBike,
  PersonSimpleRun, Pill, Pizza, Plant, Scooter, Scissors, Snowflake, Sparkle,
  Star, Smiley, Television, Tree, Trophy, Trash, WashingMachine, Waves,
} from '@phosphor-icons/react';

/**
 * Maps known task labels to Phosphor icon components.
 * Used in KidCard and RoutineEditor to render consistent icons for standard tasks.
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

/**
 * Maps icon key strings (stored in task.icon for custom tasks) to Phosphor components.
 * Used as a secondary lookup after TASK_ICON_MAP — falls back to emoji for legacy tasks.
 */
export const ICON_KEY_MAP: Record<string, Icon> = {
  Alarm, Backpack, Bathtub, Bed, Books, ForkKnife, Moon, Shower, Sneaker, Sun, TShirt, Tooth,
  Avocado, Balloon, Barbell, Basketball, Bell, Bicycle, Bird, BowlFood, Bread,
  Broom, Bus, Camera, Car, Carrot, Cat, Cheese, Coffee, Cookie, Crown, Dog, Egg,
  Fish, FirstAidKit, Flame, FlowerLotus, Football, GameController, Gift, GraduationCap,
  Hamburger, HandWaving, Headphones, Heart, Heartbeat, House, Key, Leaf, Medal,
  MusicNote, Notebook, Palette, PaintBrush, Pen, PencilSimple, PersonSimpleBike,
  PersonSimpleRun, Pill, Pizza, Plant, Scooter, Scissors, Snowflake, Sparkle,
  Star, Smiley, Television, Tree, Trophy, Trash, WashingMachine, Waves,
};

/**
 * Curated, ordered list used to populate the icon picker UI.
 */
export const ICON_PICKER_LIST: { key: string; Icon: Icon }[] = [
  // Sport & movement
  { key: 'PersonSimpleRun', Icon: PersonSimpleRun },
  { key: 'Bicycle', Icon: Bicycle },
  { key: 'PersonSimpleBike', Icon: PersonSimpleBike },
  { key: 'Barbell', Icon: Barbell },
  { key: 'Basketball', Icon: Basketball },
  { key: 'Football', Icon: Football },
  { key: 'Waves', Icon: Waves },
  { key: 'Trophy', Icon: Trophy },
  { key: 'Medal', Icon: Medal },
  { key: 'Scooter', Icon: Scooter },
  // Food & drink
  { key: 'ForkKnife', Icon: ForkKnife },
  { key: 'Pizza', Icon: Pizza },
  { key: 'Hamburger', Icon: Hamburger },
  { key: 'Cookie', Icon: Cookie },
  { key: 'BowlFood', Icon: BowlFood },
  { key: 'Coffee', Icon: Coffee },
  { key: 'Egg', Icon: Egg },
  { key: 'Carrot', Icon: Carrot },
  { key: 'Avocado', Icon: Avocado },
  { key: 'Cheese', Icon: Cheese },
  { key: 'Bread', Icon: Bread },
  // Learning & creative
  { key: 'Books', Icon: Books },
  { key: 'Notebook', Icon: Notebook },
  { key: 'PencilSimple', Icon: PencilSimple },
  { key: 'Pen', Icon: Pen },
  { key: 'GraduationCap', Icon: GraduationCap },
  { key: 'Palette', Icon: Palette },
  { key: 'PaintBrush', Icon: PaintBrush },
  { key: 'MusicNote', Icon: MusicNote },
  { key: 'Camera', Icon: Camera },
  { key: 'Headphones', Icon: Headphones },
  { key: 'GameController', Icon: GameController },
  { key: 'Television', Icon: Television },
  { key: 'Scissors', Icon: Scissors },
  // Animals & nature
  { key: 'Dog', Icon: Dog },
  { key: 'Cat', Icon: Cat },
  { key: 'Bird', Icon: Bird },
  { key: 'Fish', Icon: Fish },
  { key: 'Plant', Icon: Plant },
  { key: 'Leaf', Icon: Leaf },
  { key: 'FlowerLotus', Icon: FlowerLotus },
  { key: 'Tree', Icon: Tree },
  { key: 'Snowflake', Icon: Snowflake },
  // Home & hygiene
  { key: 'Bed', Icon: Bed },
  { key: 'Bathtub', Icon: Bathtub },
  { key: 'Shower', Icon: Shower },
  { key: 'Tooth', Icon: Tooth },
  { key: 'Backpack', Icon: Backpack },
  { key: 'Broom', Icon: Broom },
  { key: 'Trash', Icon: Trash },
  { key: 'WashingMachine', Icon: WashingMachine },
  { key: 'House', Icon: House },
  // Health
  { key: 'Heartbeat', Icon: Heartbeat },
  { key: 'FirstAidKit', Icon: FirstAidKit },
  { key: 'Pill', Icon: Pill },
  // Transport
  { key: 'Car', Icon: Car },
  { key: 'Bus', Icon: Bus },
  // Time & routine
  { key: 'Alarm', Icon: Alarm },
  { key: 'Bell', Icon: Bell },
  { key: 'Sun', Icon: Sun },
  { key: 'Moon', Icon: Moon },
  // Special & fun
  { key: 'Star', Icon: Star },
  { key: 'Heart', Icon: Heart },
  { key: 'Flame', Icon: Flame },
  { key: 'Crown', Icon: Crown },
  { key: 'Gift', Icon: Gift },
  { key: 'Balloon', Icon: Balloon },
  { key: 'Sparkle', Icon: Sparkle },
  { key: 'HandWaving', Icon: HandWaving },
  { key: 'Smiley', Icon: Smiley },
  { key: 'Key', Icon: Key },
];
