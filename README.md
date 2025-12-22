# Splendor Explorer

Browse Splendor development cards, filter them, and simulate your gem hand/bank to see what you can afford. Built with Vite + React.

## Features
- Filters: cost colors, token (card) colors, VP values, tiers, and an "only affordable" toggle.
- Card view: color-tinted cards, gold highlight for affordable cards, five-across costs with zero-costs faded.
- Hand controls: take/return gems per color, clear hand, bank availability respected; responsive drawer (full-width rows on desktop, compact grid on mobile).

## Project structure
- `public/cards.json` — card data served at runtime.
- `src/App.tsx` — data load, filters, layout.
- `src/components/Card.tsx` — card rendering and affordability highlighting.
- `src/components/Sidebar.tsx` — hand controls and drawer.
- `src/App.css` / `src/components/Sidebar.css` — styling.

## Getting started
```bash
cd app
npm install
npm run dev
```
Visit the printed localhost URL (default http://localhost:5173).

## Build
```bash
npm run build
npm run preview
```

## Notes
- Cards load from `/cards.json`; keep `public/cards.json` in sync if you edit card data.
- The hand has no max size, but you can only take gems when the bank has them.
