# Campfire

A cozy, idle-friendly campfire game built with Next.js (App Router), React, TypeScript, and Tailwind CSS. Keep your fire alive, gather wood over time, and pick up where you left off thanks to offline progression and local saves.

## Features
- Continuous timer-based fire with burn states (out, smoldering, burning, blaze) and a visible countdown.
- Wood spawning on a 10×10 grid with weighted probabilities for small, medium, and large logs.
- Collect wood from the map, store it in your inventory, and feed the fire to extend burn time.
- Fire starters to relight the fire when it goes out.
- Offline simulation and periodic autosaving via `localStorage` so progress persists across visits.

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000 to play.

## Project structure
- `src/app` — Next.js App Router pages, layout, and global styles.
- `src/components` — UI building blocks (HUD, map grid, action panel, game root).
- `src/lib` — Game constants, types, and simulation helpers.

## Notes
- All game logic is client-side only; there is no backend.
- Tailwind powers the comic-inspired visuals; feel free to tweak colors and effects in `tailwind.config.ts` and `globals.css`.
