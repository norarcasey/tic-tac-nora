import type { Board, Cell, GameResult, Player } from './types'

/** All eight ways to win: three rows, three columns, two diagonals. */
export const WINNING_LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

/** A fresh, empty 3x3 board. */
export function createEmptyBoard(): Board {
  return Array<Cell>(9).fill(null)
}

/** The indices of every empty square, in ascending order. */
export function getAvailableMoves(board: Board): number[] {
  const moves: number[] = []
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) moves.push(i)
  }
  return moves
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null)
}

/**
 * Returns the winning player and line if one exists, otherwise null.
 * A line wins when all three of its cells hold the same (non-empty) mark.
 */
export function findWinningLine(
  board: Board,
): { winner: Player; line: readonly [number, number, number] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line
    const mark = board[a]
    if (mark !== null && mark === board[b] && mark === board[c]) {
      return { winner: mark, line }
    }
  }
  return null
}

/** Evaluate the board into a full game result (playing / won / draw). */
export function evaluateBoard(board: Board): GameResult {
  const win = findWinningLine(board)
  if (win) {
    return { status: 'won', winner: win.winner, winningLine: [...win.line] }
  }
  if (isBoardFull(board)) {
    return { status: 'draw', winner: null, winningLine: null }
  }
  return { status: 'playing', winner: null, winningLine: null }
}

/**
 * Return a new board with `player`'s mark placed at `index`.
 * Throws if the square is already taken or out of range — callers should
 * only place moves on empty squares.
 */
export function applyMove(board: Board, index: number, player: Player): Board {
  if (index < 0 || index >= board.length) {
    throw new RangeError(`Move index ${index} is out of range`)
  }
  if (board[index] !== null) {
    throw new Error(`Square ${index} is already taken`)
  }
  const next = board.slice()
  next[index] = player
  return next
}

/**
 * Pick a random empty square for the computer to play.
 * Returns null when the board is full. The `rng` is injectable so the
 * AI is deterministic and testable; it defaults to Math.random.
 */
export function pickRandomMove(board: Board, rng: () => number = Math.random): number | null {
  const moves = getAvailableMoves(board)
  if (moves.length === 0) return null
  const choice = Math.floor(rng() * moves.length)
  return moves[choice]
}
