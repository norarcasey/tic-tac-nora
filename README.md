# Tic Tac Nora 🎮

An embeddable React + TypeScript Tic Tac Toe component. Play **one vs. computer** —
you're `X`, Nora (the computer) is `O`. Nora plays a random open square each turn,
and the UI handles win / lose / draw out of the box.

Built with **Vite** and tested with **Vitest** + **React Testing Library**.

## Quick start

```bash
npm install
npm run dev        # demo site at http://localhost:5173
npm test           # run the test suite
npm run build      # build the demo site for deployment
npm run build:lib  # build the embeddable component library
```

## Embedding the component

```tsx
import { TicTacNora } from 'tic-tac-nora'
import 'tic-tac-nora/style.css'

export function App() {
  return <TicTacNora />
}
```

### Props

| Prop              | Type         | Default          | Description                                          |
| ----------------- | ------------ | ---------------- | ---------------------------------------------------- |
| `title`           | `string`     | `"Tic Tac Nora"` | Heading shown above the board.                       |
| `className`       | `string`     | —                | Extra class on the root element.                     |
| `thinkingDelayMs` | `number`     | `450`            | How long Nora "thinks" before moving (cosmetic).     |
| `rng`             | `() => number` | `Math.random`  | Injectable randomness — handy for deterministic play.|

## How it works

- **`src/game/logic.ts`** — pure, framework-free game logic: board creation,
  win/draw detection, and Nora's random move picker. Fully unit-tested.
- **`src/game/useTicTacNora.ts`** — a React hook that owns game state. Whose turn
  it is is derived from the board (you move on even mark counts, Nora on odd), so
  state stays minimal and self-correcting.
- **`src/components/TicTacNora.tsx`** — the presentational, accessible component
  (ARIA grid, live status region, keyboard-friendly buttons).

## Roadmap

The MVP uses a random-move AI on purpose. A natural next step is to make Nora
smarter (block the human's winning move, take a win when available, or a full
minimax) — the move picker is isolated in `logic.ts` to make that a drop-in change.
