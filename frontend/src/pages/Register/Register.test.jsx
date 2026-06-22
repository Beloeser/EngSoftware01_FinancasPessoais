import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const mockRegister = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ register: mockRegister }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

import Register from './Register'

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  )
}

describe('Register (integração)', () => {
  beforeEach(() => {
    mockRegister.mockReset()
    mockNavigate.mockReset()
  })

  it('renderiza os campos do formulário de cadastro', () => {
    renderRegister()
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirmar senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument()
  })

  it('exibe erro e não chama register quando as senhas não coincidem', async () => {
    renderRegister()
    await userEvent.type(screen.getByPlaceholderText('Nome'), 'Beto')
    await userEvent.type(screen.getByPlaceholderText('E-mail'), 'beto@email.com')
    await userEvent.type(screen.getByPlaceholderText('Senha'), 'senha123')
    await userEvent.type(screen.getByPlaceholderText('Confirmar senha'), 'outra123')
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('cria a conta e redireciona para /dashboard em caso de sucesso', async () => {
    mockRegister.mockResolvedValue()
    renderRegister()
    await userEvent.type(screen.getByPlaceholderText('Nome'), 'Beto')
    await userEvent.type(screen.getByPlaceholderText('E-mail'), 'beto@email.com')
    await userEvent.type(screen.getByPlaceholderText('Senha'), 'senha123')
    await userEvent.type(screen.getByPlaceholderText('Confirmar senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(mockRegister).toHaveBeenCalledWith('Beto', 'beto@email.com', 'senha123')
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
  })
})
