# TP2 — Testes Automatizados (Finanças Pessoais)

Implementação dos testes do TP2 de Engenharia de Software (DCC 603), alinhada ao
**Capítulo 8 — Testes** (pirâmide de testes, princípios FIRST, cobertura, mocks).

## Pirâmide de testes (como o capítulo organiza)

| Camada | Onde | Ferramenta | O que cobre |
|---|---|---|---|
| **Unidade** (base) | Frontend | Vitest + Testing Library | `validators`, `formatDate`, `useCategories`, `AuthContext`/`ThemeContext`, interceptor do `api` — dependências externas via **mock** |
| **Unidade** (base) | Backend | Vitest | `utils/jwt`, `utils/crypto`, `services/pdfService` — lógica pura, sem banco |
| **Integração** (meio) | Frontend | Vitest + Testing Library | páginas/fluxos (`Login`, `Register`, `Dashboard`, `VisaoGeral`, `Categories`, `Navbar`, rotas) com o `api` **mockado** |
| **Integração** (meio) | Backend | Vitest + **supertest** | rotas completas (`/auth`, `/transactions`, `/categories`) indo **até o banco, sem mock** |
| **Sistema / E2E** (topo) | Stack completa | **Cypress** | 4 specs simulando o usuário no navegador, contra o **backend real** |

Princípios seguidos: testes **rápidos, independentes, determinísticos, autoverificáveis** (FIRST);
estrutura **contexto → exercício → assert**; **mocks apenas na unidade**; integração com banco real.

## Resultados de cobertura (meta do TP2: ≥ 80%)

**Frontend** — 71 testes (20 arquivos):
```
Statements 98.89%   Branches 93.01%   Functions 95.38%   Lines 98.89%
```

**Backend** — 41 testes (6 arquivos):
```
Statements 96.66%   Branches 86.04%   Functions 100%   Lines 96.66%
```

**E2E (Cypress)** — 8 testes em 4 specs (`login`, `transacoes`, `categorias`, `visao-geral`): todos verdes.

## Como rodar

### Frontend (unidade + integração)
```bash
cd frontend
npm install
npm run test:run     # roda todos os testes
npm run coverage     # roda com relatório de cobertura (usar este na apresentação)
```

### Backend (unidade + integração)
Os testes de integração usam um **Postgres de teste** isolado (porta 5433, via Docker):
```bash
cd backend
npm install
npm run test:db:up   # sobe o Postgres de teste (docker-compose.test.yml)
npm run coverage     # roda unidade + integração com cobertura
npm run test:db:down # derruba o Postgres de teste (opcional)
```
> Só os testes de **integração** precisam do Postgres. Os de **unidade**
> (`test/unit`) rodam sem banco: `npx vitest run test/unit`.

### E2E (Cypress, contra o backend real)
Precisa da stack inteira no ar + um usuário cadastrado (`usuario@email.com` / `senha123`):
```bash
# 1) banco de dev
docker compose up -d                 # Postgres na porta 5432

# 2) backend (porta 5000) — precisa de um backend/.env (ver abaixo)
cd backend && npm run dev

# 3) cadastrar o usuário de teste uma vez
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Usuario Demo","email":"usuario@email.com","password":"senha123"}'

# 4) frontend (porta 3000)
cd frontend && npm run dev

# 5) rodar os E2E (outro terminal)
cd frontend && npm run cy:run        # headless  (ou: npm run cy:open p/ runner visual)
```

`backend/.env` mínimo:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=financas_db
DB_USER=postgres
DB_PASS=postgres
JWT_SECRET=um_segredo
```

> **Gotcha macOS:** a porta **5000** é usada pelo *AirPlay Receiver* (Control Center).
> Se o backend não subir (`EADDRINUSE`), desative em
> *Ajustes do Sistema → Geral → AirDrop e Handoff → Receptor do AirPlay*,
> **ou** rode o backend em outra porta (`PORT=5050 npm run dev`) e aponte o
> frontend criando `frontend/.env.local` com `VITE_API_URL=http://localhost:5050/api`.

## Estrutura dos arquivos de teste
```
frontend/
  vite.config.js                 # bloco test + cobertura (thresholds 80%)
  src/test/setup.js              # setup (jest-dom, localStorage fake para sessão)
  src/**/*.test.{js,jsx}         # testes co-localizados com o código
  cypress/
    cypress.config.js
    support/{e2e,commands}.js    # cy.login() custom command
    e2e/{login,transacoes,categorias,visao-geral}.cy.js

backend/
  vitest.config.js               # carrega .env.test, cobertura (thresholds 80%)
  docker-compose.test.yml        # Postgres de teste (porta 5433)
  .env.test                      # credenciais do banco de teste
  test/
    db.js                        # sync + truncate por teste (isolamento)
    helpers.js                   # registerUser / authHeader
    unit/{jwt,crypto,pdfService}.test.js
    integration/{auth,transactions,categories}.test.js
```

## Decisões de teste (alinhamento com o Cap. 8)
- **Mocks** (dublês) só nos testes de **unidade**, para isolar dependências externas
  (`api` do axios no frontend; nada de banco). Os de **integração do backend** vão
  **até o Postgres**, sem mock, como o capítulo recomenda.
- **Cobertura honesta:** medimos o código realmente exercitado. Ficam de fora apenas
  bootstrap (`main.jsx`/`server.js`), estilos (`Styles.js`), barrels (`index.js`) e
  código não montado (`userController`/`userRoutes`, rota morta no backend).
- Os testes documentam o **comportamento atual** — inclusive um caso em que cadastrar
  categoria duplicada retorna **500** (revela um tratamento de erro a melhorar no backend;
  "testes mostram a presença de bugs").
- **E2E com backend real** (não mock) para validar a stack ponta a ponta, como o
  exemplo do Selenium no capítulo.

## Relatório de uso de IA (apresentação — 2 pts)

**Pontos positivos**
- Aceleração na configuração da infra (Vitest, Testing Library, supertest, Cypress, mocks)
  e na geração de casos de borda abrangentes (validações, isolamento por usuário, JSON
  falha de API, token ausente/ inválido, filtros de data/categoria, etc.).
- Diagnóstico de problemas de ambiente: o **Node 25 expõe um `localStorage` global
  incompleto** (resolvido com polyfill no setup) e a **porta 5000 ocupada pelo AirPlay**.
- Boa aderência aos conceitos do capítulo (pirâmide, FIRST, mocks só na unidade,
  integração com banco real, cobertura sem obsessão por 100%).

**Pontos negativos / cuidados**
- O grupo precisa **entender e dominar** cada teste (requisito do enunciado) — a IA
  gera rápido, mas a revisão é indispensável.
- Foram necessários ajustes manuais: timezone no `formatDate`, espaço não-quebrável
  (NBSP) do `toLocaleString`, campo faltando no mock do PDF, e ramos específicos para
  atingir 80% de *branches* no backend.
- Mocks podem **mascarar o comportamento real** — por isso os E2E rodam contra o
  backend de verdade.
- A IA chegou a escrever um teste que assertava **500** (comportamento real, porém que
  expõe um bug latente) — só percebido na revisão humana.
