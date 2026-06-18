import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Profile from './Profile'

describe('Profile', () => {
  it('renderiza o título da página', () => {
    render(<Profile />)
    expect(screen.getByText('Isso aqui é a página Profile')).toBeInTheDocument()
  })
})
