import { getFireStateName } from "@/lib/gameLogic";
import type { GameState } from "@/lib/gameTypes";

interface Props {
  state: GameState;
  formattedTime: string;
}

const stateLabels: Record<string, string> = {
  out: "Out",
  smoldering: "Smoldering",
  burning: "Burning",
  blaze: "Blaze",
};

const HUD = ({ state, formattedTime }: Props) => {
  const fireState = getFireStateName(state.fireRemainingSeconds);
  const badgeColor = {
    out: "bg-slate-700 text-white",
    smoldering: "bg-amber-500/30 text-amber-200",
    burning: "bg-orange-500/30 text-orange-100",
    blaze: "bg-red-500/30 text-red-100",
  }[fireState];

  return (
    <div className="card flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${badgeColor}`}>
          <span className="text-2xl" aria-hidden>
            {fireState === "out" ? "🪨" : "🔥"}
          </span>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Fire</p>
          <p className="text-xl font-semibold text-white">{stateLabels[fireState]}</p>
          <p className="text-xs text-white/70">Remaining: {formattedTime}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <span aria-hidden>🪵</span>
          <p>
            Wood: {state.inventory.small + state.inventory.medium + state.inventory.large}
            <span className="ml-2 text-xs text-white/60">
              ({state.inventory.small}/{state.inventory.medium}/{state.inventory.large})
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <span aria-hidden>✨</span>
          <p>Fire starters: {state.inventory.fireStarters}</p>
        </div>
      </div>
    </div>
  );
};

export default HUD;
