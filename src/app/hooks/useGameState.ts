export interface CollectedItem {
  id: string;
  name: string;
  rarity: string;
  emoji: string;
  description: string;
  collectedAt: number;
}

interface GameState {
  lastCompletedAt: number | null;
  collectedItems: CollectedItem[];
}

const STATE_KEY = "clorb-game-state";

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { lastCompletedAt: null, collectedItems: [] };
}

function saveState(state: GameState) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function getGuiltLevel(): 0 | 1 | 2 {
  const state = loadState();
  if (!state.lastCompletedAt) return 2;
  const hoursSince = (Date.now() - state.lastCompletedAt) / (1000 * 60 * 60);
  if (hoursSince < 24) return 0;
  if (hoursSince < 72) return 1;
  return 2;
}

export function getHoursSinceLastChore(): number {
  const state = loadState();
  if (!state.lastCompletedAt) return Infinity;
  return (Date.now() - state.lastCompletedAt) / (1000 * 60 * 60);
}

export function recordCompletion(item: Omit<CollectedItem, "id" | "collectedAt">) {
  const state = loadState();
  const newItem: CollectedItem = {
    ...item,
    id: `${Date.now()}-${Math.random()}`,
    collectedAt: Date.now(),
  };
  saveState({
    lastCompletedAt: Date.now(),
    collectedItems: [...state.collectedItems, newItem],
  });
}

export function getCollectedItems(): CollectedItem[] {
  return loadState().collectedItems;
}
