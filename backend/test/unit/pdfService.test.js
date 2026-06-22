import { describe, it, expect } from 'vitest'
import { pdfService } from '../../src/services/pdfService.js'

describe('services/pdfService', () => {
  it('gera um Buffer de PDF para uma lista de transações', async () => {
    const buffer = await pdfService.generateTransactionReport([
      { description: 'Salário', type: 'income', amount: 1000, date: '2024-01-05' },
      { description: 'Mercado', type: 'expense', amount: 400, date: '2024-01-06' },
    ])
    expect(Buffer.isBuffer(buffer)).toBe(true)
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })

  it('gera um PDF válido mesmo sem transações', async () => {
    const buffer = await pdfService.generateTransactionReport([])
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })
})
