import {
  GRID_HEIGHT,
  GRID_WIDTH,
  INITIAL_FIRE_SECONDS,
  MAX_FIRE_SECONDS,
  MAX_WOOD_ON_MAP,
  WOOD_BURN_VALUES,
  WOOD_SPAWN_INTERVAL_SECONDS,
  WOOD_SPAWN_WEIGHTS,
} from "./gameConfig";
import type { FireStateName, GameState, Inventory, WoodOnMap, WoodType } from "./gameTypes";

export const getFireStateName = (fireRemainingSeconds: number): FireStateName => {
  if (fireRemainingSeconds <= 0) return "out";
  if (fireRemainingSeconds <= 60) return "smoldering";
  if (fireRemainingSeconds <= 300) return "burning";
  return "blaze";
};

export const createDefaultState = (now: number): GameState => ({
  fireRemainingSeconds: 0,
  lastUpdateTimestamp: now,
  woodOnMap: [],
  inventory: { small: 0, medium: 0, large: 0, fireStarters: 3 },
});

const weightedRandomWood = (): WoodType => {
  const roll = Math.random();
  const { small, medium } = WOOD_SPAWN_WEIGHTS;
  if (roll < small) return "small";
  if (roll < small + medium) return "medium";
  return "large";
};

const findEmptyTile = (woodOnMap: WoodOnMap[]): { x: number; y: number } | null => {
  const occupied = new Set(woodOnMap.map((w) => `${w.x},${w.y}`));
  const center = `${Math.floor(GRID_WIDTH / 2)},${Math.floor(GRID_HEIGHT / 2)}`;
  occupied.add(center);

  const openTiles: { x: number; y: number }[] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        openTiles.push({ x, y });
      }
    }
  }

  if (!openTiles.length) return null;
  const idx = Math.floor(Math.random() * openTiles.length);
  return openTiles[idx];
};

export const spawnWood = (state: GameState, numToSpawn: number, now: number): GameState => {
  if (numToSpawn <= 0) return state;
  const woodOnMap = [...state.woodOnMap];

  for (let i = 0; i < numToSpawn; i++) {
    if (woodOnMap.length >= MAX_WOOD_ON_MAP) break;
    const location = findEmptyTile(woodOnMap);
    if (!location) break;
    woodOnMap.push({
      id: crypto.randomUUID(),
      x: location.x,
      y: location.y,
      type: weightedRandomWood(),
      spawnedAt: now,
    });
  }

  return { ...state, woodOnMap };
};

export const simulateOffline = (state: GameState, now: number): GameState => {
  const deltaSeconds = Math.max(0, (now - state.lastUpdateTimestamp) / 1000);
  let fireRemainingSeconds = Math.max(0, state.fireRemainingSeconds - deltaSeconds);

  const expectedSpawns = Math.floor(deltaSeconds / WOOD_SPAWN_INTERVAL_SECONDS);
  let updatedState: GameState = {
    ...state,
    fireRemainingSeconds: Math.min(fireRemainingSeconds, MAX_FIRE_SECONDS),
    lastUpdateTimestamp: now,
  };

  updatedState = spawnWood(updatedState, expectedSpawns, now);

  return updatedState;
};

export const tick = (state: GameState, deltaSeconds: number, now: number): GameState => {
  const fireRemainingSeconds = Math.max(0, state.fireRemainingSeconds - deltaSeconds);
  return {
    ...state,
    fireRemainingSeconds,
    lastUpdateTimestamp: now,
  };
};

export const addWoodToFire = (state: GameState, type: WoodType): GameState => {
  if (state.fireRemainingSeconds <= 0) return state;
  const inventory: Inventory = { ...state.inventory };
  if (inventory[type] <= 0) return state;

  inventory[type] -= 1;
  const added = WOOD_BURN_VALUES[type];
  const fireRemainingSeconds = Math.min(MAX_FIRE_SECONDS, state.fireRemainingSeconds + added);
  return { ...state, inventory, fireRemainingSeconds };
};

export const lightFire = (state: GameState): GameState => {
  if (state.fireRemainingSeconds > 0) return state;
  if (state.inventory.fireStarters <= 0) return state;
  return {
    ...state,
    inventory: { ...state.inventory, fireStarters: state.inventory.fireStarters - 1 },
    fireRemainingSeconds: INITIAL_FIRE_SECONDS,
  };
};

export const collectWood = (state: GameState, id: string): GameState => {
  const target = state.woodOnMap.find((w) => w.id === id);
  if (!target) return state;
  const inventory: Inventory = { ...state.inventory, [target.type]: state.inventory[target.type] + 1 };
  const woodOnMap = state.woodOnMap.filter((w) => w.id !== id);
  return { ...state, inventory, woodOnMap };
};
