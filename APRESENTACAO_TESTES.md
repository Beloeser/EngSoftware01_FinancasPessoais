# TP2 — Apresentação dos Testes
### Sistema de Finanças Pessoais · Engenharia de Software (DCC 603)

> Roteiro da apresentação (15 min). Slides não são obrigatórios — este documento serve
> de apoio para a fala. Estrutura conforme o enunciado: Parte 1 a 4.

---

## Visão geral

Implementamos testes em todas as camadas da **pirâmide de testes** (Cap. 8):

| Camada | Ferramenta | Qtde |
|---|---|---|
| **Unidade + Integração — Frontend** | Vitest + Testing Library | 71 testes |
| **Unidade + Integração — Backend** | Vitest + supertest + Postgres | 41 testes |
| **Sistema / E2E** | Cypress (backend real) | 8 testes (4 specs) |

**Cobertura (meta ≥ 80%):**
- Frontend: **98,89%** statements · 93,01% branches · 95,38% funcs · 98,89% lines
- Backend: **96,66%** statements · 86,04% branches · 100% funcs · 96,66% lines

Princípios seguidos: **FIRST** (rápidos, independentes, determinísticos, autoverificáveis);
estrutura **contexto → exercício → assert**; **mocks só na unidade**; **integração até o banco**.

---

## Parte 1 — Testes de unidade/integração (~5 min)

### Rodar e mostrar a cobertura ao vivo
```bash
# Frontend
cd frontend
npm run coverage

# Backend (sobe um Postgres de teste isolado na porta 5433)
cd backend
npm run test:db:up
npm run coverage
```

### Teste explicado nº 1 — Unidade (frontend): `isValidEmail`
Arquivo: `frontend/src/utils/validators.test.js`

Teste de unidade de uma **função pura** (sem banco, sem mock, sem renderizar componente)
— a menor unidade possível, na base da pirâmide. Valida a regex de e-mail cobrindo o
caso feliz e os de borda.

```js
import { isValidEmail } from './validators'

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
})
```
- **Exercício:** chama `isValidEmail(...)` com uma entrada.
- **Assert:** `expect(...).toBe(true/false)` — um assert por teste (o "verde/vermelho").
- Atende ao **FIRST**: rápido, independente e determinístico; não precisa de mock por não
  ter dependência externa.

### Teste explicado nº 2 — Integração (backend): cadastro via API
Arquivo: `backend/test/integration/auth.test.js` (usa **supertest** + Postgres real)

```js
it('retorna 409 para e-mail já cadastrado', async () => {
  await registerUser(app, { email: 'dup@email.com' })
  const res = await request(app).post('/api/auth/register').send({
    name: 'Outro', email: 'dup@email.com', password: 'outrasenha',
  })
  expect(res.status).toBe(409)
  expect(res.body.message).toBe('Já existe uma conta com esse e-mail')
})
```
- **Contexto:** cria um usuário no banco de teste.
- **Exercício:** tenta cadastrar outro com o mesmo e-mail (requisição HTTP real ao app Express).
- **Assert:** status **409** e mensagem de erro. É **integração**: passa por rota →
  controller → modelo → **banco**, sem mocks.

---

## Parte 2 — Testes E2E (~5 min)

### Rodar ao vivo (precisa da stack no ar)
```bash
docker compose up -d                 # Postgres
cd backend && npm run dev            # API
cd frontend && npm run dev           # App
cd frontend && npm run cy:open       # runner visual do Cypress
```

### Teste E2E nº 1 — Login
Arquivo: `frontend/cypress/e2e/login.cy.js`

```js
it('faz login com credenciais válidas', () => {
  cy.get('input[type=email]').type('usuario@email.com')
  cy.get('input[type=password]').type('senha123')
  cy.get('button[type=submit]').click()
  cy.url().should('include', '/dashboard')
})
```
O Cypress abre um **navegador real**, preenche o formulário e verifica o redirecionamento
para `/dashboard`. A autenticação acontece **de verdade** contra o backend.

### Teste E2E nº 2 — Criar e remover transação
Arquivo: `frontend/cypress/e2e/transacoes.cy.js`

```js
it('remove uma transação após confirmação', () => {
  cy.visit('/dashboard')
  // ... preenche e salva a transação "Conta E2E" ...
  cy.contains('Conta E2E').parent().parent().within(() => {
    cy.contains('button', 'Remover').click()
    cy.contains('button', 'Confirmar').click()
  })
  cy.contains('Conta E2E').should('not.exist')
})
```
Simula o usuário criando, confirmando a exclusão e validando que a transação sumiu —
exercitando frontend, API e banco juntos (teste de **sistema**).

---

## Parte 3 — Divisão do trabalho (~1 min)

> A autoria dos commits no repositório deve refletir esta divisão.

- **[Integrante 1]:** _[o que fez — ex.: testes de unidade do frontend]_
- **[Integrante 2]:** _[ex.: testes de integração do backend / supertest]_
- **[Integrante 3]:** _[ex.: testes E2E (Cypress) e configuração]_

_(Preencher com os nomes e tarefas reais do grupo.)_

---

## Parte 4 — Uso de IA (~4 min)

**Pontos positivos**
- Acelerou a configuração da infra (Vitest, Testing Library, supertest, Cypress) e a
  geração de **casos de borda** abrangentes.
- Ajudou a **diagnosticar problemas de ambiente**: o `localStorage` global incompleto do
  Node 25 nos testes de sessão (resolvido com polyfill no setup) e a porta 5000 ocupada
  pelo AirPlay no macOS.

**Pontos negativos / cuidados**
- O grupo precisou **revisar e entender cada teste** — a IA gera rápido, mas o
  entendimento é nosso (e cobrado no enunciado).
- Ajustes manuais: timezone no `formatDate`, NBSP do `toLocaleString`, dados faltando em
  mocks, e ramos específicos para alcançar 80% de cobertura.
- Mocks podem **mascarar o comportamento real** — por isso os E2E rodam contra o backend
  de verdade.
- Um teste chegou a assertar **500** ao cadastrar categoria duplicada: é o comportamento
  **real** do backend, mas revela um tratamento de erro a melhorar ("testes mostram a
  presença de bugs").

---

## Encerramento
- Pirâmide completa: unidade → integração → sistema.
- Cobertura acima de 80% nas duas bases.
- E2E validados ponta a ponta contra o backend real.

_Mais detalhes técnicos e instruções de execução em `TESTES.md`._
