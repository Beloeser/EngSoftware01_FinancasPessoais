import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const mockLogout = vi.fn()
const mockNavigate = vi.fn()
let mockUser = { name: 'Ana' }

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser, logout: mockLogout }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

import Navbar from './Navbar'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  it('mostra os links de navegação e a saudação do usuário', () => {
    mockUser = { name: 'Ana' }
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: 'Visão Geral' })).toHaveAttribute('href', '/visao-geral')
    expect(screen.getByRole('link', { name: 'Categorias' })).toHaveAttribute('href', '/categories')
    expect(screen.getByText('Olá, Ana')).toBeInTheDocument()
  })

  it('mostra rótulo genérico quando o usuário não tem nome', () => {
    mockUser = {}
    renderNavbar()
    expect(screen.getByText('Usuário autenticado')).toBeInTheDocument()
  })

  it('faz logout e redireciona para /login', async () => {
    mockUser = { name: 'Ana' }
    renderNavbar()
    await userEvent.click(screen.getByRole('button', { name: 'Sair' }))
    expect(mockLogout).toHaveBeenCalledOnce()
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })
})
