import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'
import { useTestDatabase } from '../db.js'
import { registerUser } from '../helpers.js'

useTestDatabase()

describe('Auth (integração)', () => {
  describe('POST /api/auth/register', () => {
    it('cria um usuário e retorna token + dados (201)', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Ana',
        email: 'ana@email.com',
        password: 'senha123',
      })
      expect(res.status).toBe(201)
      expect(res.body.token).toBeDefined()
      expect(res.body.user).toMatchObject({ name: 'Ana', email: 'ana@email.com' })
      expect(res.body.user.password).toBeUndefined()
    })

    it('retorna 400 quando faltam campos obrigatórios', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'x@email.com' })
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Nome, e-mail e senha são obrigatórios')
    })

    it('retorna 409 para e-mail já cadastrado', async () => {
      await registerUser(app, { email: 'dup@email.com' })
      const res = await request(app).post('/api/auth/register').send({
        name: 'Outro',
        email: 'dup@email.com',
        password: 'outrasenha',
      })
      expect(res.status).toBe(409)
      expect(res.body.message).toBe('Já existe uma conta com esse e-mail')
    })

    it('normaliza o e-mail (trim + lowercase)', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Ana',
        email: '  ANA@Email.com ',
        password: 'senha123',
      })
      expect(res.status).toBe(201)
      expect(res.body.user.email).toBe('ana@email.com')
    })
  })

  describe('POST /api/auth/login', () => {
    it('autentica com credenciais válidas (200)', async () => {
      await registerUser(app, { email: 'ana@email.com', password: 'senha123' })
      const res = await request(app).post('/api/auth/login').send({
        email: 'ana@email.com',
        password: 'senha123',
      })
      expect(res.status).toBe(200)
      expect(res.body.token).toBeDefined()
      expect(res.body.user.email).toBe('ana@email.com')
    })

    it('retorna 400 quando faltam campos', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'ana@email.com' })
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('E-mail e senha são obrigatórios')
    })

    it('retorna 401 para senha incorreta', async () => {
      await registerUser(app, { email: 'ana@email.com', password: 'senha123' })
      const res = await request(app).post('/api/auth/login').send({
        email: 'ana@email.com',
        password: 'errada',
      })
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Credenciais inválidas')
    })

    it('retorna 401 para e-mail inexistente', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'naoexiste@email.com',
        password: 'senha123',
      })
      expect(res.status).toBe(401)
    })
  })
})
