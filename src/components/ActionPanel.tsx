import type { Inventory, WoodType } from "@/lib/gameTypes";

interface Props {
  inventory: Inventory;
  fireRemainingSeconds: number;
  onLightFire: () => void;
  onAddWood: (type: WoodType) => void;
}

const woodButtons: { type: WoodType; label: string; description: string }[] = [
  { type: "small", label: "Add Small Log", description: "+60s" },
  { type: "medium", label: "Add Medium Log", description: "+180s" },
  { type: "large", label: "Add Large Log", description: "+600s" },
];

const ActionPanel = ({ inventory, fireRemainingSeconds, onLightFire, onAddWood }: Props) => {
  const fireIsOut = fireRemainingSeconds <= 0;

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-white">Actions</p>
        {fireIsOut && <span className="text-xs uppercase tracking-[0.2em] text-amber-200">fire out</span>}
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {woodButtons.map((btn) => (
          <button
            key={btn.type}
            className="button-secondary flex items-center justify-between"
            onClick={() => onAddWood(btn.type)}
            disabled={inventory[btn.type] <= 0}
            aria-label={`${btn.label} (${btn.description})`}
          >
            <span>{btn.label}</span>
            <span className="text-xs text-white/60">{btn.description}</span>
          </button>
        ))}
      </div>

      <button
        className="button-primary w-full"
        onClick={onLightFire}
        disabled={inventory.fireStarters <= 0 || !fireIsOut}
        aria-label="Light the fire with a starter"
      >
        {fireIsOut ? "Light Fire" : "Fire Burning"} ({inventory.fireStarters}✨)
      </button>

      {fireIsOut && (
        <p className="text-xs text-amber-100/90">
          The campfire is cold. Use a fire starter to ignite it, then feed it wood to keep it alive.
        </p>
      )}
    </div>
  );
};

export default ActionPanel;
