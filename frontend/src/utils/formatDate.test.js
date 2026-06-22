import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formata um objeto Date no padrão pt-BR', () => {
    const date = new Date(2024, 0, 15)
    expect(formatDate(date)).toBe(date.toLocaleDateString('pt-BR'))
  })

  it('formata um timestamp numérico', () => {
    const timestamp = new Date(2024, 5, 10).getTime()
    expect(formatDate(timestamp)).toBe(new Date(timestamp).toLocaleDateString('pt-BR'))
  })

  it('retorna "Invalid Date" para uma entrada inválida', () => {
    expect(formatDate('isso-não-é-data')).toBe('Invalid Date')
  })
})
