import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCategories } from './useCategories'

vi.mock('../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}))

import api from '../services/api'

describe('useCategories', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [] })
    api.post.mockResolvedValue({ data: { id: 1, name: 'Lazer' } })
    api.delete.mockResolvedValue({ data: {} })
  })

  it('carrega categorias da API ao montar', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, name: 'Alimentação' }] })

    const { result } = renderHook(() => useCategories())

    await waitFor(() => {
      expect(result.current.categories).toEqual([{ id: 1, name: 'Alimentação' }])
    })
    expect(api.get).toHaveBeenCalledWith('/categories')
  })

  it('retorna lista vazia e erro quando a API falha', async () => {
    api.get.mockRejectedValue(new Error('falha'))

    const { result } = renderHook(() => useCategories())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.categories).toEqual([])
    expect(result.current.error).toBe('Não foi possível carregar as categorias.')
  })

  it('adiciona uma categoria pela API e atualiza a lista', async () => {
    const { result } = renderHook(() => useCategories())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.addCategory('  Lazer  ')
    })

    expect(api.post).toHaveBeenCalledWith('/categories', { name: 'Lazer' })
    expect(result.current.categories).toEqual([{ id: 1, name: 'Lazer' }])
  })

  it('ignora nome vazio ou categoria duplicada', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, name: 'Lazer' }] })
    const { result } = renderHook(() => useCategories())

    await waitFor(() => {
      expect(result.current.categories).toHaveLength(1)
    })

    await act(async () => {
      await result.current.addCategory('   ')
      await result.current.addCategory('Lazer')
    })

    expect(api.post).not.toHaveBeenCalled()
    expect(result.current.categories).toEqual([{ id: 1, name: 'Lazer' }])
  })

  it('remove uma categoria pela API e atualiza a lista', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, name: 'Lazer' },
        { id: 2, name: 'Casa' },
      ],
    })
    const { result } = renderHook(() => useCategories())

    await waitFor(() => {
      expect(result.current.categories).toHaveLength(2)
    })

    await act(async () => {
      await result.current.removeCategory(1)
    })

    expect(api.delete).toHaveBeenCalledWith('/categories/1')
    expect(result.current.categories).toEqual([{ id: 2, name: 'Casa' }])
  })
})
