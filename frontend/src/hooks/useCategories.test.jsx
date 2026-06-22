import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCategories } from './useCategories'

describe('useCategories', () => {
  it('inicia vazio quando não há nada no localStorage', () => {
    const { result } = renderHook(() => useCategories())
    expect(result.current.categories).toEqual([])
  })

  it('carrega categorias já existentes do localStorage', () => {
    localStorage.setItem('categories', JSON.stringify(['Alimentação']))
    const { result } = renderHook(() => useCategories())
    expect(result.current.categories).toEqual(['Alimentação'])
  })

  it('retorna lista vazia quando o JSON do localStorage está corrompido', () => {
    localStorage.setItem('categories', '{json invalido')
    const { result } = renderHook(() => useCategories())
    expect(result.current.categories).toEqual([])
  })

  it('adiciona uma categoria e persiste no localStorage', () => {
    const { result } = renderHook(() => useCategories())
    act(() => result.current.addCategory('Lazer'))
    expect(result.current.categories).toEqual(['Lazer'])
    expect(JSON.parse(localStorage.getItem('categories'))).toEqual(['Lazer'])
  })

  it('faz trim do nome ao adicionar', () => {
    const { result } = renderHook(() => useCategories())
    act(() => result.current.addCategory('  Casa  '))
    expect(result.current.categories).toEqual(['Casa'])
  })

  it('ignora nome vazio ou só com espaços', () => {
    const { result } = renderHook(() => useCategories())
    act(() => result.current.addCategory('   '))
    expect(result.current.categories).toEqual([])
  })

  it('ignora categoria duplicada', () => {
    const { result } = renderHook(() => useCategories())
    act(() => result.current.addCategory('Lazer'))
    act(() => result.current.addCategory('Lazer'))
    expect(result.current.categories).toEqual(['Lazer'])
  })

  it('remove uma categoria existente e persiste', () => {
    localStorage.setItem('categories', JSON.stringify(['Lazer', 'Casa']))
    const { result } = renderHook(() => useCategories())
    act(() => result.current.removeCategory('Lazer'))
    expect(result.current.categories).toEqual(['Casa'])
    expect(JSON.parse(localStorage.getItem('categories'))).toEqual(['Casa'])
  })

  it('mantém a lista inalterada ao remover nome inexistente', () => {
    localStorage.setItem('categories', JSON.stringify(['Casa']))
    const { result } = renderHook(() => useCategories())
    act(() => result.current.removeCategory('Lazer'))
    expect(result.current.categories).toEqual(['Casa'])
  })
})
