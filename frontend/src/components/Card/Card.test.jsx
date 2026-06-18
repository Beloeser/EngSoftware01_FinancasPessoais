import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('Card', () => {
  it('renderiza o conteúdo dentro do card', () => {
    render(
      <Card>
        <p>Conteúdo do card</p>
      </Card>,
    )
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument()
  })
})
