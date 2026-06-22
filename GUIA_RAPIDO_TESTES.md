# Guia rapido de testes

Este projeto tem tres grupos principais de testes:

| Tipo | Ferramenta | Onde fica | O que testa |
|---|---|---|---|
| Unidade | Vitest | `frontend/src/**/*.test.*` e `backend/test/unit` | Funcoes, hooks, contextos, servicos pequenos |
| Integracao | Vitest | `frontend/src/**/*.test.*` e `backend/test/integration` | Paginas/componentes com mocks no frontend; rotas reais com banco no backend |
| E2E / Sistema | Cypress | `frontend/cypress/e2e` | Fluxos completos no navegador, com frontend e backend reais |

## O que significa cada tipo

### Teste de unidade

Testa uma parte pequena do sistema de forma isolada.
Exemplos: uma funcao de validacao, um hook, um servico de PDF, geracao de token JWT.

Normalmente e rapido e nao precisa subir servidor, navegador ou banco.

### Teste de integracao

Testa varias partes trabalhando juntas.

No frontend, testa paginas e componentes usando mocks para simular chamadas da API.
No backend, testa rotas reais como `/auth`, `/transactions` e `/categories`, usando banco de teste.

### Teste E2E / sistema

Testa o fluxo completo como se fosse um usuario real.
O Cypress abre o navegador, acessa o frontend, faz login, cria dados e valida a tela.

E o teste mais proximo do uso real, mas tambem costuma ser mais lento e depende de mais coisas rodando.

### Cobertura

Cobertura mostra quanto do codigo foi executado pelos testes.

Exemplo: se a cobertura de linhas e `95%`, significa que 95% das linhas medidas foram executadas em algum teste.
Nao quer dizer que o sistema esta perfeito, mas ajuda a ver partes pouco testadas.

### Modo observando alteracoes

Tambem chamado de modo watch.
O Vitest fica aberto no terminal e roda novamente quando voce altera algum arquivo.

E util enquanto voce esta programando, porque nao precisa digitar o comando toda hora.

## Frontend com Vitest

Roda testes unitarios e de integracao do frontend.
Nao precisa subir backend nem banco.

```bash
cd /home/beloeser/Codigos/EngSoftware/frontend
npm run test:run
```

Com cobertura:

```bash
cd /home/beloeser/Codigos/EngSoftware/frontend
npm run coverage
```

Use este comando quando quiser ver o percentual de cobertura dos testes do frontend.

Modo observando alteracoes:

```bash
cd /home/beloeser/Codigos/EngSoftware/frontend
npm test
```

Use este comando quando estiver editando codigo/testes e quiser que o Vitest rode automaticamente a cada mudanca.

## Backend com Vitest

Todos os comandos desta secao devem ser rodados dentro da pasta `backend`.
Se o terminal estiver em `frontend`, rode:

```bash
cd ../backend
```

### Apenas testes unitarios

Nao precisa de banco.
Testa partes pequenas do backend, como criptografia, JWT e servico de PDF.

```bash
cd /home/beloeser/Codigos/EngSoftware/backend
npm install
npx vitest run test/unit
```

### Testes de integracao

Precisam do Postgres de teste na porta `5433`.
Testam as rotas reais do backend com banco de teste.

```bash
cd /home/beloeser/Codigos/EngSoftware/backend
npm install
npm run test:db:up
npm run test:run
npm run test:db:down
```

Com cobertura:

```bash
cd /home/beloeser/Codigos/EngSoftware/backend
npm run test:db:up
npm run coverage
npm run test:db:down
```

Use este comando quando quiser ver o percentual de cobertura dos testes do backend.

## Cypress E2E

Testa a aplicacao como um usuario real no navegador.
Precisa de banco, backend e frontend rodando.
Os testes ficam em `frontend/cypress/e2e`.

Terminal 1:

```bash
cd /home/beloeser/Codigos/EngSoftware/backend
npm run dev
```

Terminal 2:

```bash
cd /home/beloeser/Codigos/EngSoftware/frontend
npm run dev
```

Terminal 3, modo terminal:

```bash
cd /home/beloeser/Codigos/EngSoftware/frontend
env -u ELECTRON_RUN_AS_NODE npm run cy:run
```

Terminal 3, interface visual:

```bash
cd /home/beloeser/Codigos/EngSoftware/frontend
env -u ELECTRON_RUN_AS_NODE npm run cy:open
```

Na interface do Cypress, escolha:

```text
E2E Testing -> Electron -> Start E2E Testing
```

## Resumo rapido

```bash
# Frontend
cd /home/beloeser/Codigos/EngSoftware/frontend
npm run test:run
npm run coverage

# Backend
cd /home/beloeser/Codigos/EngSoftware/backend
npx vitest run test/unit
npm run test:db:up
npm run test:run
npm run coverage
npm run test:db:down

# Cypress
cd /home/beloeser/Codigos/EngSoftware/frontend
env -u ELECTRON_RUN_AS_NODE npm run cy:open
```

## Observacoes

- Cypress nao substitui Vitest: eles se complementam.
- Vitest e mais rapido e testa partes menores.
- Cypress e mais lento, mas valida o fluxo completo no navegador.
- Se o Docker falhar ao subir o banco de teste do backend, use um Postgres local na porta `5433` com o banco `financas_test`.
