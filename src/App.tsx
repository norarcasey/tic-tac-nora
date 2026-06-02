import { useState } from 'react'
import { TicTacNora } from './components/TicTacNora'
import type { Difficulty } from './game/useTicTacNora'
import './App.css'

const LEVELS: { value: Difficulty; label: string; hint: string }[] = [
  { value: 'smart', label: 'Smart', hint: 'Optimal play — the best you can do is draw.' },
  { value: 'random', label: 'Random', hint: 'Nora plays a random open square.' },
]

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('smart')
  const active = LEVELS.find((l) => l.value === difficulty)!

  return (
    <main className="demo">
      <div className="demo__controls" role="radiogroup" aria-label="Difficulty">
        {LEVELS.map((level) => (
          <button
            key={level.value}
            type="button"
            role="radio"
            aria-checked={difficulty === level.value}
            className={`demo__level ${difficulty === level.value ? 'is-active' : ''}`}
            onClick={() => setDifficulty(level.value)}
          >
            {level.label}
          </button>
        ))}
      </div>
      <p className="demo__hint">{active.hint}</p>

      <TicTacNora difficulty={difficulty} />

      <p className="demo__credit">
        An embeddable React component. Drop <code>&lt;TicTacNora /&gt;</code> anywhere.
      </p>
    </main>
  )
}
