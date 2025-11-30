import GameRoot from "@/components/GameRoot";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 text-slate-50">
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 rounded-2xl bg-white/5 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-campfire-amber/80">cozy idle</p>
              <h1 className="text-3xl font-black text-white">Campfire</h1>
            </div>
            <p className="max-w-xl text-sm text-slate-200/90">
              Build and nurture your own campfire. Gather wood, feed the flame, and come back later to see how it has grown.
            </p>
          </div>
        </header>
        <GameRoot />
      </div>
    </main>
  );
}
