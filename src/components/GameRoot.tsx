"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ActionPanel from "@/components/ActionPanel";
import HUD from "@/components/HUD";
import MapGrid from "@/components/MapGrid";
import {
  SAVE_DEBOUNCE_MS,
  SAVE_KEY,
  WOOD_SPAWN_INTERVAL_SECONDS,
} from "@/lib/gameConfig";
import {
  addWoodToFire,
  collectWood,
  createDefaultState,
  lightFire,
  simulateOffline,
  spawnWood,
  tick,
} from "@/lib/gameLogic";
import type { GameState, WoodType } from "@/lib/gameTypes";

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return "00:00";
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

const EventLog = ({ logs }: { logs: string[] }) => {
  return (
    <div className="card text-sm text-slate-100/90">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold text-campfire-amber">Recent events</p>
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">last 8</span>
      </div>
      <ul className="space-y-1 text-white/90">
        {logs.length === 0 && <li className="text-white/60">Ready when you are.</li>}
        {logs.map((log, idx) => (
          <li key={`${log}-${idx}`} className="rounded-lg bg-white/5 px-3 py-2 text-xs">
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
};

const GameRoot = () => {
  const [state, setState] = useState<GameState | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const spawnAccumulatorRef = useRef(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pushLog = (message: string) => {
    setLogs((prev) => {
      const next = [message, ...prev];
      return next.slice(0, 8);
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const now = Date.now();
    const raw = localStorage.getItem(SAVE_KEY);
    let loaded: GameState;
    if (raw) {
      try {
        loaded = JSON.parse(raw) as GameState;
      } catch (error) {
        console.warn("Failed to parse save, resetting.", error);
        loaded = createDefaultState(now);
      }
    } else {
      loaded = createDefaultState(now);
    }
    const offlineState = simulateOffline(loaded, now);
    setState(offlineState);
    pushLog("Welcome back to the campsite.");
  }, []);

  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => {
      setState((current) => {
        if (!current) return current;
        const now = Date.now();
        const deltaSeconds = Math.max(0, (now - current.lastUpdateTimestamp) / 1000);
        let nextState = tick(current, deltaSeconds, now);

        const accumulated = spawnAccumulatorRef.current + deltaSeconds;
        const spawnCount = Math.floor(accumulated / WOOD_SPAWN_INTERVAL_SECONDS);
        spawnAccumulatorRef.current = accumulated - spawnCount * WOOD_SPAWN_INTERVAL_SECONDS;

        if (spawnCount > 0) {
          nextState = spawnWood(nextState, spawnCount, now);
        }

        return nextState;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (!state || typeof window === "undefined") return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }, SAVE_DEBOUNCE_MS);
  }, [state]);

  const handleCollectWood = (id: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = collectWood(prev, id);
      if (next !== prev) {
        pushLog("You collected wood.");
      }
      return next;
    });
  };

  const handleAddWood = (type: WoodType) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.fireRemainingSeconds <= 0) {
        pushLog("The fire is out. Light it first.");
        return prev;
      }
      if (prev.inventory[type] <= 0) {
        pushLog("No more of that wood type.");
        return prev;
      }
      const next = addWoodToFire(prev, type);
      if (next !== prev) {
        pushLog(`You fed the fire a ${type} log.`);
      }
      return next;
    });
  };

  const handleLightFire = () => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.inventory.fireStarters <= 0) {
        pushLog("You are out of fire starters!");
        return prev;
      }
      if (prev.fireRemainingSeconds > 0) return prev;
      const next = lightFire(prev);
      if (next !== prev) {
        pushLog("You lit the campfire.");
      }
      return next;
    });
  };

  const fireTime = useMemo(() => formatTime(state?.fireRemainingSeconds ?? 0), [state]);

  if (!state) {
    return (
      <div className="card text-center text-sm text-white/70">Loading your campfire...</div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <HUD state={state} formattedTime={fireTime} />
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <MapGrid state={state} onCollect={handleCollectWood} />
        <div className="flex flex-col gap-4">
          <ActionPanel
            inventory={state.inventory}
            fireRemainingSeconds={state.fireRemainingSeconds}
            onLightFire={handleLightFire}
            onAddWood={handleAddWood}
          />
          <EventLog logs={logs} />
        </div>
      </div>
    </section>
  );
};

export default GameRoot;
