import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTicTacNora } from './useTicTacNora'

describe('useTicTacNora', () => {
  it('starts empty with the human to move', () => {
    const { result } = renderHook(() => useTicTacNora({ thinkingDelayMs: 0 }))
    expect(result.current.board.every((c) => c === null)).toBe(true)
    expect(result.current.turn).toBe('X')
    expect(result.current.result.status).toBe('playing')
  })

  it('places the human mark and then lets Nora reply', async () => {
    const { result } = renderHook(() => useTicTacNora({ thinkingDelayMs: 0, rng: () => 0 }))

    act(() => {
      result.current.play(4)
    })
    expect(result.current.board[4]).toBe('X')

    // Nora (rng 0) takes the first open square, index 0.
    await waitFor(() => expect(result.current.board[0]).toBe('O'))
    expect(result.current.turn).toBe('X')
  })

  it('rejects illegal plays on a taken square', async () => {
    const { result } = renderHook(() => useTicTacNora({ thinkingDelayMs: 0, rng: () => 0 }))

    act(() => {
      result.current.play(0)
    })
    // Wait for Nora to reply, then snapshot the settled board.
    await waitFor(() => expect(result.current.board[1]).toBe('O'))
    const snapshot = [...result.current.board]

    // Replaying an occupied square must be a no-op.
    act(() => {
      result.current.play(0)
    })
    act(() => {
      result.current.play(1)
    })
    expect(result.current.board).toEqual(snapshot)
  })

  it('reset returns to a clean board', async () => {
    const { result } = renderHook(() => useTicTacNora({ thinkingDelayMs: 0, rng: () => 0 }))
    act(() => {
      result.current.play(0)
    })
    await waitFor(() => expect(result.current.board[1]).toBe('O'))

    act(() => {
      result.current.reset()
    })
    expect(result.current.board.every((c) => c === null)).toBe(true)
    expect(result.current.turn).toBe('X')
  })
})
