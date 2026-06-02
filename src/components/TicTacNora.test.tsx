import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TicTacNora } from './TicTacNora'

/** rng that always returns 0 → Nora always takes the first available square. */
const firstAvailable = () => 0

function square(index: number): HTMLButtonElement {
  return screen.getByRole('gridcell', {
    name: new RegExp(`square ${index + 1}`, 'i'),
  }) as HTMLButtonElement
}

describe('<TicTacNora />', () => {
  it('renders the brand and an empty 3x3 board', () => {
    render(<TicTacNora thinkingDelayMs={0} />)
    expect(screen.getByText('Tic Tac Nora')).toBeInTheDocument()
    expect(screen.getByRole('grid')).toBeInTheDocument()
    expect(screen.getAllByRole('gridcell')).toHaveLength(9)
    expect(screen.getByRole('status')).toHaveTextContent('Your move')
  })

  it('lets the human place an X and has Nora respond with an O', async () => {
    const user = userEvent.setup()
    render(<TicTacNora thinkingDelayMs={0} rng={firstAvailable} />)

    await user.click(square(4))
    expect(square(4)).toHaveTextContent('X')

    // Nora replies with the first open square (index 0 here).
    await waitFor(() => expect(square(0)).toHaveTextContent('O'))
  })

  it('ignores clicks on a square that is already taken', async () => {
    const user = userEvent.setup()
    render(<TicTacNora thinkingDelayMs={0} rng={firstAvailable} />)

    await user.click(square(4))
    await waitFor(() => expect(square(0)).toHaveTextContent('O'))

    // Square 0 is Nora's; clicking it must not overwrite it.
    await user.click(square(0))
    expect(square(0)).toHaveTextContent('O')
  })

  it('announces a human win and highlights the winning line', async () => {
    const user = userEvent.setup()
    render(<TicTacNora thinkingDelayMs={0} rng={firstAvailable} />)

    // Human takes 0, Nora 1; human takes 3, Nora 2; human takes 6 → column 0,3,6.
    await user.click(square(0))
    await waitFor(() => expect(square(1)).toHaveTextContent('O'))
    await user.click(square(3))
    await waitFor(() => expect(square(2)).toHaveTextContent('O'))
    await user.click(square(6))

    const status = screen.getByRole('status')
    await waitFor(() => expect(status).toHaveTextContent(/you win/i))
    expect(status).toHaveAttribute('data-status', 'won')

    // The three winning squares are flagged.
    for (const idx of [0, 3, 6]) {
      expect(square(idx).className).toMatch(/winning/)
    }
  })

  it('disables the board once the game is over', async () => {
    const user = userEvent.setup()
    render(<TicTacNora thinkingDelayMs={0} rng={firstAvailable} />)

    await user.click(square(0))
    await waitFor(() => expect(square(1)).toHaveTextContent('O'))
    await user.click(square(3))
    await waitFor(() => expect(square(2)).toHaveTextContent('O'))
    await user.click(square(6))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/you win/i))

    // Every remaining empty square is now disabled.
    for (const idx of [4, 5, 7, 8]) {
      expect(square(idx)).toBeDisabled()
    }
  })

  it('starts a fresh game when Play again is clicked', async () => {
    const user = userEvent.setup()
    render(<TicTacNora thinkingDelayMs={0} rng={firstAvailable} />)

    await user.click(square(0))
    await waitFor(() => expect(square(1)).toHaveTextContent('O'))
    await user.click(square(3))
    await waitFor(() => expect(square(2)).toHaveTextContent('O'))
    await user.click(square(6))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/you win/i))

    await user.click(screen.getByRole('button', { name: /play again/i }))

    const grid = screen.getByRole('grid')
    for (const cell of within(grid).getAllByRole('gridcell')) {
      expect(cell).toHaveTextContent('')
    }
    expect(screen.getByRole('status')).toHaveTextContent('Your move')
  })
})
