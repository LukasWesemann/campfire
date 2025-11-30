import { GRID_HEIGHT, GRID_WIDTH } from "@/lib/gameConfig";
import type { GameState } from "@/lib/gameTypes";

interface Props {
  state: GameState;
  onCollect: (id: string) => void;
}

const MapGrid = ({ state, onCollect }: Props) => {
  const centerX = Math.floor(GRID_WIDTH / 2);
  const centerY = Math.floor(GRID_HEIGHT / 2);

  const renderTile = (x: number, y: number) => {
    if (x === centerX && y === centerY) {
      const fireBurning = state.fireRemainingSeconds > 0;
      return (
        <div className={`tile fire-glow ${fireBurning ? "animate-flicker" : "opacity-60"}`}>
          <span aria-label="Campfire" role="img">
            {fireBurning ? "🔥" : "🪨"}
          </span>
        </div>
      );
    }

    const wood = state.woodOnMap.find((w) => w.x === x && w.y === y);
    if (wood) {
      const label = {
        small: "Small log",
        medium: "Medium log",
        large: "Large log",
      }[wood.type];
      const icon = wood.type === "small" ? "🪵" : wood.type === "medium" ? "🪓" : "🌲";
      return (
        <button
          className="tile focus-visible:outline focus-visible:outline-2 focus-visible:outline-campfire-amber"
          onClick={() => onCollect(wood.id)}
          aria-label={`Collect ${label}`}
        >
          <span>{icon}</span>
        </button>
      );
    }

    return <div className="tile" aria-hidden />;
  };

  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between text-sm text-white/80">
        <p className="font-semibold text-white">Campsite</p>
        <p>{state.woodOnMap.length} wood on the ground</p>
      </div>
      <div className="grid-container" aria-label="Campfire map">
        {Array.from({ length: GRID_HEIGHT }).map((_, y) =>
          Array.from({ length: GRID_WIDTH }).map((_, x) => (
            <div key={`${x}-${y}`}>{renderTile(x, y)}</div>
          )),
        )}
      </div>
    </div>
  );
};

export default MapGrid;
