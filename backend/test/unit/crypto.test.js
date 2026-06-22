import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '../../src/utils/crypto.js'

describe('utils/crypto', () => {
  it('hashPassword gera um hash diferente da senha original', async () => {
    const hash = await hashPassword('senha123')
    expect(hash).not.toBe('senha123')
    expect(hash.length).toBeGreaterThan(0)
  })

  it('comparePassword valida a senha correta e rejeita a errada', async () => {
    const hash = await hashPassword('senha123')
    expect(await comparePassword('senha123', hash)).toBe(true)
    expect(await comparePassword('errada', hash)).toBe(false)
  })
})
