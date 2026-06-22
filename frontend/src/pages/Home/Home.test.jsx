import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './Home'

describe('Home', () => {
  it('renderiza o título da página', () => {
    render(<Home />)
    expect(screen.getByText('Isso aqui é a página Home')).toBeInTheDocument()
  })
})
