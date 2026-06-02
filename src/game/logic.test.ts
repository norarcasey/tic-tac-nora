import { describe, expect, it } from 'vitest'
import {
  applyMove,
  createEmptyBoard,
  evaluateBoard,
  findWinningLine,
  getAvailableMoves,
  isBoardFull,
  pickRandomMove,
  WINNING_LINES,
} from './logic'
import type { Board } from './types'

/** Build a board from a 9-char string: 'X', 'O', or '.' for empty. */
function board(spec: string): Board {
  const cells = spec.replace(/\s/g, '').split('')
  if (cells.length !== 9) throw new Error('board spec must have 9 cells')
  return cells.map((c) => (c === 'X' ? 'X' : c === 'O' ? 'O' : null))
}

describe('createEmptyBoard', () => {
  it('creates 9 empty cells', () => {
    const b = createEmptyBoard()
    expect(b).toHaveLength(9)
    expect(b.every((c) => c === null)).toBe(true)
  })

  it('returns a fresh array each call', () => {
    expect(createEmptyBoard()).not.toBe(createEmptyBoard())
  })
})

describe('getAvailableMoves', () => {
  it('lists every empty index on a fresh board', () => {
    expect(getAvailableMoves(createEmptyBoard())).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('omits taken squares', () => {
    expect(getAvailableMoves(board('X.O.X.O..'))).toEqual([1, 3, 5, 7, 8])
  })

  it('returns nothing for a full board', () => {
    expect(getAvailableMoves(board('XOXOXOXOX'))).toEqual([])
  })
})

describe('isBoardFull', () => {
  it('is false when squares remain', () => {
    expect(isBoardFull(board('XOX.O.X..'))).toBe(false)
  })
  it('is true when no squares remain', () => {
    expect(isBoardFull(board('XOXXOOOXX'))).toBe(true)
  })
})

describe('findWinningLine', () => {
  it('returns null on an empty board', () => {
    expect(findWinningLine(createEmptyBoard())).toBeNull()
  })

  it('detects a row win', () => {
    const result = findWinningLine(board('XXX.O.O..'))
    expect(result).toEqual({ winner: 'X', line: [0, 1, 2] })
  })

  it('detects a column win', () => {
    const result = findWinningLine(board('O.XO.XO..'))
    expect(result).toEqual({ winner: 'O', line: [0, 3, 6] })
  })

  it('detects a diagonal win', () => {
    // 0,4,8 = X,X,X
    expect(findWinningLine(board('X.O.X.O.X'))).toEqual({ winner: 'X', line: [0, 4, 8] })
    // 2,4,6 = O,O,O
    expect(findWinningLine(board('X.O.O.OX.'))).toEqual({ winner: 'O', line: [2, 4, 6] })
  })

  it('finds every winning line for X', () => {
    for (const line of WINNING_LINES) {
      const b = createEmptyBoard()
      for (const idx of line) b[idx] = 'X'
      expect(findWinningLine(b)).toEqual({ winner: 'X', line })
    }
  })

  it('does not report a win for a non-winning board', () => {
    expect(findWinningLine(board('XOXXOOOXX'))).toBeNull()
  })
})

describe('evaluateBoard', () => {
  it('reports playing while the game is open', () => {
    expect(evaluateBoard(board('X.O.X.O..'))).toEqual({
      status: 'playing',
      winner: null,
      winningLine: null,
    })
  })

  it('reports a win with the winning line', () => {
    expect(evaluateBoard(board('OOO.X.X..'))).toEqual({
      status: 'won',
      winner: 'O',
      winningLine: [0, 1, 2],
    })
  })

  it('reports a draw on a full board with no winner', () => {
    expect(evaluateBoard(board('XOXXOOOXX'))).toEqual({
      status: 'draw',
      winner: null,
      winningLine: null,
    })
  })

  it('prefers a win over a draw on a full winning board', () => {
    // full board where X completes the top row
    expect(evaluateBoard(board('XXXOOXOXO')).status).toBe('won')
  })
})

describe('applyMove', () => {
  it('places a mark on an empty square without mutating the original', () => {
    const original = createEmptyBoard()
    const next = applyMove(original, 4, 'X')
    expect(next[4]).toBe('X')
    expect(original[4]).toBeNull()
    expect(next).not.toBe(original)
  })

  it('throws when the square is taken', () => {
    expect(() => applyMove(board('X........'), 0, 'O')).toThrow(/already taken/)
  })

  it('throws when the index is out of range', () => {
    expect(() => applyMove(createEmptyBoard(), 9, 'X')).toThrow(RangeError)
    expect(() => applyMove(createEmptyBoard(), -1, 'X')).toThrow(RangeError)
  })
})

describe('pickRandomMove', () => {
  it('returns null when the board is full', () => {
    expect(pickRandomMove(board('XOXOXOXOX'))).toBeNull()
  })

  it('always picks an empty square', () => {
    const b = board('XX.OO.X..')
    const available = getAvailableMoves(b)
    for (let i = 0; i < 50; i++) {
      const move = pickRandomMove(b)
      expect(available).toContain(move)
    }
  })

  it('uses the injected rng deterministically', () => {
    const b = board('X.O.X.O..') // available: [1,3,5,7,8]
    // rng -> 0 selects first available, rng -> 0.99 selects last
    expect(pickRandomMove(b, () => 0)).toBe(1)
    expect(pickRandomMove(b, () => 0.999)).toBe(8)
  })

  it('can fill a board to completion one move at a time', () => {
    let b = createEmptyBoard()
    let player: 'X' | 'O' = 'X'
    let placed = 0
    while (!isBoardFull(b)) {
      const move = pickRandomMove(b, () => 0)
      expect(move).not.toBeNull()
      b = applyMove(b, move as number, player)
      player = player === 'X' ? 'O' : 'X'
      placed++
    }
    expect(placed).toBe(9)
  })
})
