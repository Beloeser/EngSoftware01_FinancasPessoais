import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('renderiza o conteúdo (children)', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('repassa props (type) e dispara onClick', async () => {
    const onClick = vi.fn()
    render(
      <Button type="submit" onClick={onClick}>
        Enviar
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Enviar' })
    expect(button).toHaveAttribute('type', 'submit')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })
})
