import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

import Login from './Login'

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  )
}

describe('Login (integração)', () => {
  beforeEach(() => {
    mockLogin.mockReset()
    mockNavigate.mockReset()
  })

  it('renderiza os campos e o botão do formulário', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('faz login e redireciona para /dashboard em caso de sucesso', async () => {
    mockLogin.mockResolvedValue()
    renderLogin()
    await userEvent.type(screen.getByPlaceholderText('E-mail'), 'ana@email.com')
    await userEvent.type(screen.getByPlaceholderText('Senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(mockLogin).toHaveBeenCalledWith('ana@email.com', 'senha123')
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
  })

  it('exibe mensagem de erro quando o login falha', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: 'Credenciais inválidas' } },
    })
    renderLogin()
    await userEvent.type(screen.getByPlaceholderText('E-mail'), 'x@email.com')
    await userEvent.type(screen.getByPlaceholderText('Senha'), 'errada')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Credenciais inválidas')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
