import { useCallback, useEffect, useRef, useState } from 'react'
import { applyMove, createEmptyBoard, evaluateBoard, pickRandomMove } from './logic'
import { HUMAN, NORA, type Board, type GameResult, type Player } from './types'

export interface UseTicTacNoraOptions {
  /**
   * How long Nora "thinks" before playing, in ms. Purely cosmetic — it makes
   * the computer's move feel deliberate rather than instant. Set to 0 in tests.
   */
  thinkingDelayMs?: number
  /** Injectable randomness so Nora's moves can be made deterministic in tests. */
  rng?: () => number
}

export interface TicTacNoraState {
  board: Board
  result: GameResult
  /** Whose turn it is. Null once the game is over. */
  turn: Player | null
  /** True while Nora is about to move (drives the "thinking" UI). */
  isNoraThinking: boolean
  /** Place the human's mark. No-op if the square is taken or it isn't your turn. */
  play: (index: number) => void
  /** Start a brand new game. */
  reset: () => void
  human: Player
  nora: Player
}

/**
 * Whose turn it is, derived from the board. The human (X) moves on even mark
 * counts (they go first), Nora (O) on odd counts.
 */
function turnFromBoard(board: Board): Player {
  const marks = board.reduce((n, cell) => (cell !== null ? n + 1 : n), 0)
  return marks % 2 === 0 ? HUMAN : NORA
}

/**
 * Owns all game state for a single human-vs-Nora match. The human (X) always
 * moves first; Nora (O) replies with a random legal move after a short delay.
 */
export function useTicTacNora(options: UseTicTacNoraOptions = {}): TicTacNoraState {
  const { thinkingDelayMs = 450, rng = Math.random } = options

  const [board, setBoard] = useState<Board>(createEmptyBoard)

  const result = evaluateBoard(board)
  const isOver = result.status !== 'playing'
  const turn = turnFromBoard(board)

  // Keep the latest rng without making the effect depend on it.
  const rngRef = useRef(rng)
  rngRef.current = rng

  const reset = useCallback(() => {
    setBoard(createEmptyBoard())
  }, [])

  const play = useCallback((index: number) => {
    setBoard((current) => {
      // Guard: only the human, only on their turn, only on empty squares.
      if (turnFromBoard(current) !== HUMAN) return current
      if (current[index] !== null) return current
      if (evaluateBoard(current).status !== 'playing') return current
      return applyMove(current, index, HUMAN)
    })
  }, [])

  // When it becomes Nora's turn, let her think briefly, then play.
  useEffect(() => {
    if (isOver || turn !== NORA) return

    const timer = setTimeout(() => {
      setBoard((current) => {
        if (evaluateBoard(current).status !== 'playing') return current
        if (turnFromBoard(current) !== NORA) return current
        const move = pickRandomMove(current, rngRef.current)
        if (move === null) return current
        return applyMove(current, move, NORA)
      })
    }, thinkingDelayMs)

    return () => clearTimeout(timer)
  }, [turn, isOver, thinkingDelayMs])

  return {
    board,
    result,
    turn: isOver ? null : turn,
    isNoraThinking: !isOver && turn === NORA,
    play,
    reset,
    human: HUMAN,
    nora: NORA,
  }
}
