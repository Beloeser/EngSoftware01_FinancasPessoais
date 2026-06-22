import request from 'supertest'

// Cria um usuário via API e devolve token + dados (usado nos testes de rotas protegidas).
export async function registerUser(app, overrides = {}) {
  const payload = {
    name: 'Usuário Teste',
    email: 'teste@email.com',
    password: 'senha123',
    ...overrides,
  }
  const res = await request(app).post('/api/auth/register').send(payload)
  return { token: res.body.token, user: res.body.user, password: payload.password, res }
}

export function authHeader(token) {
  return { Authorization: `Bearer ${token}` }
}
