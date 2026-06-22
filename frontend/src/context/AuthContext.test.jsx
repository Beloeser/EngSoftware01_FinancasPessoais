import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContext } from 'react'

vi.mock('../services/api', () => ({
  default: { post: vi.fn() },
}))

import api from '../services/api'
import { AuthContext, AuthProvider } from './AuthContext'

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('inicia sem usuário quando não há sessão salva', () => {
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    expect(result.current.user).toBeNull()
  })

  it('hidrata o usuário a partir do localStorage (token + user)', () => {
    localStorage.setItem('token', 'tkn')
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Ana' }))
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    expect(result.current.user).toEqual({ id: 1, name: 'Ana' })
  })

  it('limpa a sessão se o usuário salvo estiver corrompido', () => {
    localStorage.setItem('token', 'tkn')
    localStorage.setItem('user', '{corrompido')
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    expect(result.current.user).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('login chama a API, persiste a sessão e seta o usuário', async () => {
    api.post.mockResolvedValue({ data: { token: 'jwt', user: { id: 1, name: 'Ana' } } })
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })

    await act(async () => {
      await result.current.login('ana@email.com', 'senha')
    })

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'ana@email.com',
      password: 'senha',
    })
    expect(localStorage.getItem('token')).toBe('jwt')
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, name: 'Ana' })
    expect(result.current.user).toEqual({ id: 1, name: 'Ana' })
  })

  it('register chama a API com nome/email/senha e persiste a sessão', async () => {
    api.post.mockResolvedValue({ data: { token: 'jwt2', user: { id: 2, name: 'Beto' } } })
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })

    await act(async () => {
      await result.current.register('Beto', 'beto@email.com', 'senha')
    })

    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      name: 'Beto',
      email: 'beto@email.com',
      password: 'senha',
    })
    expect(result.current.user).toEqual({ id: 2, name: 'Beto' })
  })

  it('propaga erro de login e mantém o usuário nulo', async () => {
    api.post.mockRejectedValue(new Error('401'))
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })

    await expect(
      act(async () => {
        await result.current.login('x@email.com', 'errada')
      }),
    ).rejects.toThrow()

    expect(result.current.user).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('logout limpa a sessão do localStorage e zera o usuário', async () => {
    api.post.mockResolvedValue({ data: { token: 'jwt', user: { id: 1, name: 'Ana' } } })
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })

    await act(async () => {
      await result.current.login('ana@email.com', 'senha')
    })

    act(() => result.current.logout())

    expect(result.current.user).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })
})
