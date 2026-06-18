import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./services/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>,
  )
}

function loginUser() {
  localStorage.setItem('token', 'tkn')
  localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Ana' }))
}

describe('Rotas (PrivateRoute / PublicRoute)', () => {
  it('redireciona usuário não autenticado de /dashboard para /login', async () => {
    renderAt('/dashboard')
    expect(await screen.findByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('mostra a página de cadastro em "/" quando não autenticado', () => {
    renderAt('/')
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument()
  })

  it('redireciona usuário autenticado de /login para /dashboard', async () => {
    loginUser()
    renderAt('/login')
    expect(await screen.findByText('Minhas Finanças')).toBeInTheDocument()
  })

  it('renderiza a Navbar nas rotas privadas quando autenticado', async () => {
    loginUser()
    renderAt('/dashboard')
    expect(await screen.findByText('Finanças Pessoais')).toBeInTheDocument()
    expect(screen.getByText('Minhas Finanças')).toBeInTheDocument()
  })
})
