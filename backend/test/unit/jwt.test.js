import { describe, it, expect } from 'vitest'
import { generateToken, verifyToken } from '../../src/utils/jwt.js'

describe('utils/jwt', () => {
  it('generateToken cria um token (string) que carrega o id do usuário', () => {
    const token = generateToken(42)
    expect(typeof token).toBe('string')
    expect(verifyToken(token).id).toBe(42)
  })

  it('verifyToken lança erro para um token inválido', () => {
    expect(() => verifyToken('isto-nao-e-um-token')).toThrow()
  })
})
