import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'
import { useTestDatabase } from '../db.js'
import { registerUser, authHeader } from '../helpers.js'

useTestDatabase()

function createTransaction(token, data) {
  return request(app).post('/api/transactions').set(authHeader(token)).send(data)
}

describe('Transações (integração)', () => {
  let token
  beforeEach(async () => {
    const u = await registerUser(app)
    token = u.token
  })

  it('rejeita acesso sem token (401)', async () => {
    const res = await request(app).get('/api/transactions')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token não fornecido')
  })

  it('rejeita token inválido (401)', async () => {
    const res = await request(app).get('/api/transactions').set(authHeader('token.falso'))
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token inválido')
  })

  it('cria uma transação (201) vinculada ao usuário', async () => {
    const res = await createTransaction(token, {
      description: 'Salário',
      amount: 1000,
      type: 'income',
      date: '2024-01-10',
    })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ description: 'Salário', type: 'income' })
    expect(res.body.userId).toBeDefined()
  })

  it('lista somente as transações do usuário, ordenadas por data desc', async () => {
    await createTransaction(token, { description: 'Antiga', amount: 100, type: 'income', date: '2024-01-01' })
    await createTransaction(token, { description: 'Recente', amount: 200, type: 'income', date: '2024-02-01' })

    const res = await request(app).get('/api/transactions').set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body[0].description).toBe('Recente')
  })

  it('filtra transações por tipo', async () => {
    await createTransaction(token, { description: 'Salário', amount: 1000, type: 'income', date: '2024-01-10' })
    await createTransaction(token, { description: 'Mercado', amount: 300, type: 'expense', date: '2024-01-12' })

    const res = await request(app).get('/api/transactions?type=expense').set(authHeader(token))
    expect(res.body).toHaveLength(1)
    expect(res.body[0].type).toBe('expense')
  })

  it('filtra transações a partir de uma data (startDate)', async () => {
    await createTransaction(token, { description: 'Jan', amount: 100, type: 'income', date: '2024-01-15' })
    await createTransaction(token, { description: 'Mar', amount: 300, type: 'income', date: '2024-03-15' })

    const res = await request(app).get('/api/transactions?startDate=2024-02-01').set(authHeader(token))
    expect(res.body).toHaveLength(1)
    expect(res.body[0].description).toBe('Mar')
  })

  it('filtra transações até uma data (endDate)', async () => {
    await createTransaction(token, { description: 'Jan', amount: 100, type: 'income', date: '2024-01-15' })
    await createTransaction(token, { description: 'Mar', amount: 300, type: 'income', date: '2024-03-15' })

    const res = await request(app).get('/api/transactions?endDate=2024-02-01').set(authHeader(token))
    expect(res.body).toHaveLength(1)
    expect(res.body[0].description).toBe('Jan')
  })

  it('filtra transações por intervalo de datas (startDate + endDate)', async () => {
    await createTransaction(token, { description: 'Jan', amount: 100, type: 'income', date: '2024-01-15' })
    await createTransaction(token, { description: 'Fev', amount: 200, type: 'income', date: '2024-02-15' })
    await createTransaction(token, { description: 'Mar', amount: 300, type: 'income', date: '2024-03-15' })

    const res = await request(app)
      .get('/api/transactions?startDate=2024-02-01&endDate=2024-02-28')
      .set(authHeader(token))
    expect(res.body).toHaveLength(1)
    expect(res.body[0].description).toBe('Fev')
  })

  it('atualiza a própria transação (200)', async () => {
    const created = await createTransaction(token, { description: 'Orig', amount: 50, type: 'income', date: '2024-01-10' })
    const res = await request(app)
      .put(`/api/transactions/${created.body.id}`)
      .set(authHeader(token))
      .send({ description: 'Atualizada', amount: 75, type: 'income', date: '2024-01-10' })
    expect(res.status).toBe(200)
    expect(res.body.description).toBe('Atualizada')
  })

  it('não permite editar transação de outro usuário (404)', async () => {
    const created = await createTransaction(token, { description: 'Minha', amount: 50, type: 'income', date: '2024-01-10' })
    const { token: outroToken } = await registerUser(app, { email: 'outro@email.com' })

    const res = await request(app)
      .put(`/api/transactions/${created.body.id}`)
      .set(authHeader(outroToken))
      .send({ description: 'Hackeada', amount: 50, type: 'income', date: '2024-01-10' })
    expect(res.status).toBe(404)
  })

  it('remove a própria transação (204)', async () => {
    const created = await createTransaction(token, { description: 'Apagar', amount: 50, type: 'expense', date: '2024-01-10' })
    const res = await request(app).delete(`/api/transactions/${created.body.id}`).set(authHeader(token))
    expect(res.status).toBe(204)

    const list = await request(app).get('/api/transactions').set(authHeader(token))
    expect(list.body).toHaveLength(0)
  })

  it('retorna 404 ao remover transação inexistente', async () => {
    const res = await request(app).delete('/api/transactions/9999').set(authHeader(token))
    expect(res.status).toBe(404)
  })

  it('retorna erro 500 ao remover com id inválido (não numérico)', async () => {
    const res = await request(app).delete('/api/transactions/abc').set(authHeader(token))
    expect(res.status).toBe(500)
  })

  it('retorna erro 500 ao atualizar com id inválido (não numérico)', async () => {
    const res = await request(app)
      .put('/api/transactions/abc')
      .set(authHeader(token))
      .send({ description: 'x', amount: 1, type: 'income', date: '2024-01-01' })
    expect(res.status).toBe(500)
  })

  it('calcula o resumo (incomes, expenses, balance)', async () => {
    await createTransaction(token, { description: 'Salário', amount: 1000, type: 'income', date: '2024-01-10' })
    await createTransaction(token, { description: 'Mercado', amount: 400, type: 'expense', date: '2024-01-12' })

    const res = await request(app).get('/api/transactions/summary').set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ incomes: 1000, expenses: 400, balance: 600 })
  })

  it('exporta um PDF das transações', async () => {
    await createTransaction(token, { description: 'Salário', amount: 1000, type: 'income', date: '2024-01-10' })
    const res = await request(app).get('/api/transactions/export/pdf').set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('application/pdf')
  })

  it('exporta um PDF aplicando filtros de tipo e data', async () => {
    await createTransaction(token, { description: 'Jan', amount: 100, type: 'income', date: '2024-01-15' })
    await createTransaction(token, { description: 'Fev', amount: 200, type: 'expense', date: '2024-02-15' })

    const res = await request(app)
      .get('/api/transactions/export/pdf?type=expense&startDate=2024-02-01&endDate=2024-02-28')
      .set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('application/pdf')
  })
})
