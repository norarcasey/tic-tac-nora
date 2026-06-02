// Public API for embedding Tic Tac Nora.
export { TicTacNora } from './components/TicTacNora'
export type { TicTacNoraProps } from './components/TicTacNora'
export { useTicTacNora } from './game/useTicTacNora'
export type { Difficulty, TicTacNoraState, UseTicTacNoraOptions } from './game/useTicTacNora'
export type { Board, Cell, GameResult, GameStatus, Player } from './game/types'
export {
  applyMove,
  createEmptyBoard,
  evaluateBoard,
  findWinningLine,
  getAvailableMoves,
  isBoardFull,
  pickBestMove,
  pickRandomMove,
  WINNING_LINES,
} from './game/logic'
