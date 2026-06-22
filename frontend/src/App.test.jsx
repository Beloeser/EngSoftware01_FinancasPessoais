import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renderiza a rota pública inicial (cadastro) sem usuário autenticado', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument()
  })
})
