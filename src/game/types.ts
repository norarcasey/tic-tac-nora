/** The human always plays X, Nora (the computer) always plays O. */
export type Player = 'X' | 'O'

/** A single square: a player's mark, or empty. */
export type Cell = Player | null

/** The board is a flat array of 9 cells, indexed 0–8 (row-major). */
export type Board = Cell[]

export type GameStatus = 'playing' | 'won' | 'draw'

export interface GameResult {
  status: GameStatus
  /** The winning player, if the game was won. */
  winner: Player | null
  /** The three board indices that make up the winning line, if any. */
  winningLine: number[] | null
}

export const HUMAN: Player = 'X'
export const NORA: Player = 'O'
