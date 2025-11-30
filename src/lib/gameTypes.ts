export type FireStateName = "out" | "smoldering" | "burning" | "blaze";

export type WoodType = "small" | "medium" | "large";

export interface WoodOnMap {
  id: string;
  x: number;
  y: number;
  type: WoodType;
  spawnedAt: number; // timestamp (ms)
}

export interface Inventory {
  small: number;
  medium: number;
  large: number;
  fireStarters: number;
}

export interface GameState {
  fireRemainingSeconds: number;
  lastUpdateTimestamp: number; // ms since epoch
  woodOnMap: WoodOnMap[];
  inventory: Inventory;
}
