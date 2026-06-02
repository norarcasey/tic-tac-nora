import { useTicTacNora, type UseTicTacNoraOptions } from '../game/useTicTacNora'
import type { Cell } from '../game/types'
import './TicTacNora.css'

export interface TicTacNoraProps extends UseTicTacNoraOptions {
  /** Optional heading shown above the board. Defaults to "Tic Tac Nora". */
  title?: string
  className?: string
}

export function TicTacNora({ title = 'Tic Tac Nora', className, ...options }: TicTacNoraProps) {
  const { board, result, turn, isNoraThinking, play, reset, human, nora } = useTicTacNora(options)

  const isOver = result.status !== 'playing'
  const winningLine = result.winningLine ?? []

  const status = getStatusMessage()
  const statusTone =
    result.status === 'won' ? (result.winner === human ? 'win' : 'lose') : result.status

  function getStatusMessage(): string {
    if (result.status === 'won') {
      return result.winner === human ? 'You win! 🎉' : 'Nora wins! 🤖'
    }
    if (result.status === 'draw') return "It's a draw. 🤝"
    if (isNoraThinking) return 'Nora is thinking…'
    return turn === human ? 'Your move' : 'Nora is up'
  }

  return (
    <div className={['ttn', className].filter(Boolean).join(' ')} data-testid="tic-tac-nora">
      <header className="ttn__header">
        <h2 className="ttn__title">{title}</h2>
        <p className="ttn__subtitle">You are {human} · Nora is {nora}</p>
      </header>

      <div
        className={`ttn__status ttn__status--${statusTone}`}
        role="status"
        aria-live="polite"
        data-status={result.status}
      >
        {status}
      </div>

      <div
        className="ttn__board"
        role="grid"
        aria-label="Tic Tac Nora board"
        data-thinking={isNoraThinking || undefined}
      >
        {board.map((cell, index) => (
          <Square
            key={index}
            value={cell}
            index={index}
            isWinning={winningLine.includes(index)}
            disabled={isOver || isNoraThinking || cell !== null || turn !== human}
            onClick={() => play(index)}
          />
        ))}
      </div>

      <button className="ttn__reset" type="button" onClick={reset}>
        {isOver ? 'Play again' : 'Restart'}
      </button>
    </div>
  )
}

interface SquareProps {
  value: Cell
  index: number
  isWinning: boolean
  disabled: boolean
  onClick: () => void
}

function Square({ value, index, isWinning, disabled, onClick }: SquareProps) {
  const label = value ? `Square ${index + 1}, ${value}` : `Play square ${index + 1}`
  return (
    <button
      type="button"
      role="gridcell"
      className={[
        'ttn__square',
        value ? `ttn__square--${value.toLowerCase()}` : '',
        isWinning ? 'ttn__square--winning' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <span aria-hidden="true">{value}</span>
    </button>
  )
}
