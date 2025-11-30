export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 10;
export const MAX_WOOD_ON_MAP = 10;

export const WOOD_SPAWN_INTERVAL_SECONDS = 180; // 3 minutes
export const MAX_FIRE_SECONDS = 3600; // 1 hour
export const INITIAL_FIRE_SECONDS = 60; // when lighting

export const WOOD_BURN_VALUES = {
  small: 60,
  medium: 180,
  large: 600,
} as const;

export const WOOD_SPAWN_WEIGHTS = {
  small: 0.7,
  medium: 0.25,
  large: 0.05,
} as const;

export const SAVE_KEY = "campfire-game-state-v1";
export const SAVE_DEBOUNCE_MS = 3500;
