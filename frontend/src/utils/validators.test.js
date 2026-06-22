import { describe, it, expect } from 'vitest'
import { isValidEmail, isNotEmpty } from './validators'

describe('isValidEmail', () => {
  it('aceita um e-mail válido', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('rejeita string sem @', () => {
    expect(isValidEmail('invalido')).toBe(false)
  })

  it('rejeita e-mail sem domínio/TLD', () => {
    expect(isValidEmail('a@b')).toBe(false)
  })

  it('rejeita e-mail com espaço', () => {
    expect(isValidEmail('a b@example.com')).toBe(false)
  })

  it('rejeita string vazia', () => {
    expect(isValidEmail('')).toBe(false)
  })
})

describe('isNotEmpty', () => {
  it('retorna true para texto', () => {
    expect(isNotEmpty('abc')).toBe(true)
  })

  it('retorna true para o número 0', () => {
    expect(isNotEmpty(0)).toBe(true)
  })

  it('retorna false para string vazia', () => {
    expect(isNotEmpty('')).toBe(false)
  })

  it('retorna false para apenas espaços', () => {
    expect(isNotEmpty('   ')).toBe(false)
  })

  it('retorna false para null', () => {
    expect(isNotEmpty(null)).toBe(false)
  })

  it('retorna false para undefined', () => {
    expect(isNotEmpty(undefined)).toBe(false)
  })
})
