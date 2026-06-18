import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'
import { useTestDatabase } from '../db.js'
import { registerUser, authHeader } from '../helpers.js'

useTestDatabase()

describe('Categorias (integração)', () => {
  let token
  beforeEach(async () => {
    const u = await registerUser(app)
    token = u.token
  })

  it('rejeita acesso sem token (401)', async () => {
    const res = await request(app).get('/api/categories')
    expect(res.status).toBe(401)
  })

  it('cria uma categoria (201) vinculada ao usuário', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set(authHeader(token))
      .send({ name: 'Alimentação' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ name: 'Alimentação' })
    expect(res.body.userId).toBeDefined()
  })

  it('rejeita categoria duplicada para o mesmo usuário', async () => {
    await request(app).post('/api/categories').set(authHeader(token)).send({ name: 'Lazer' })
    const res = await request(app).post('/api/categories').set(authHeader(token)).send({ name: 'Lazer' })
    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Categoria já existe')
  })

  it('lista as categorias do usuário', async () => {
    await request(app).post('/api/categories').set(authHeader(token)).send({ name: 'Alimentação' })
    await request(app).post('/api/categories').set(authHeader(token)).send({ name: 'Transporte' })

    const res = await request(app).get('/api/categories').set(authHeader(token))
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})
