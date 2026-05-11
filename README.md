# Finanças Pessoais

Sistema web para gerenciamento de finanças pessoais.

## Tecnologias

**Frontend**
- React 18 + Vite
- React Router DOM v6
- Styled Components
- Axios

**Backend**
- Node.js + Express
- Sequelize ORM + PostgreSQL
- JWT para autenticação
- bcryptjs para hash de senhas

## Estrutura

```
project-root/
├── frontend/        → React app (porta 3000)
├── backend/         → API REST (porta 5000)
├── docker-compose.yml
└── README.md
```

## Como rodar

### 1. Banco de dados (Docker)
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Rotas da API

| Método | Rota                    | Descrição              | Auth |
|--------|-------------------------|------------------------|------|
| POST   | /api/auth/register      | Cadastro de usuário    | Não  |
| POST   | /api/auth/login         | Login                  | Não  |
| GET    | /api/users/profile      | Perfil do usuário      | Sim  |
| GET    | /api/transactions       | Listar transações      | Sim  |
| POST   | /api/transactions       | Criar transação        | Sim  |
| DELETE | /api/transactions/:id   | Remover transação      | Sim  |

## Variáveis de ambiente (backend/.env)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=financas_db
DB_USER=postgres
DB_PASS=postgres
JWT_SECRET=sua_chave_secreta_aqui
```

## Diagramas UML

Documentação preliminar do sistema em UML (Mermaid). Versão estendida e legendada em [`DIAGRAMAS_UML.md`](./DIAGRAMAS_UML.md). PNGs renderizados em [`docs/uml/`](./docs/uml/).

### 1. Casos de Uso

Funcionalidades do ponto de vista do usuário. **Categorizar transação** está em amarelo — a entidade `Category` já existe no backend (`/api/categories`), mas o frontend ainda usa `localStorage` e ainda não vincula `categoryId` às transações via API (integração pendente).

```mermaid
graph LR
    User((Usuário))

    User --> UC1[Cadastrar conta]
    User --> UC2[Fazer login]
    User --> UC3[Listar transações]
    User --> UC4[Cadastrar transação]
    User --> UC5[Editar transação]
    User --> UC6[Remover transação]
    User --> UC7[Filtrar transações<br/>por tipo/categoria/data]
    User --> UC8[Ver resumo financeiro]
    User --> UC9[Cadastrar categoria]
    User --> UC10[Listar categorias]
    User --> UC11[Categorizar transação]:::pending
    User --> UC12[Ver dashboard com gráficos]
    User --> UC13[Exportar PDF]

    UC3 -.->|include| UC2
    UC4 -.->|include| UC2
    UC5 -.->|include| UC2
    UC6 -.->|include| UC2
    UC7 -.->|include| UC3
    UC8 -.->|include| UC2
    UC9 -.->|include| UC2
    UC10 -.->|include| UC2
    UC12 -.->|include| UC3
    UC13 -.->|include| UC3

    classDef pending fill:#fff3cd,stroke:#e0a800,color:#333
```

### 2. Classes

Modelo de dados e principais classes do backend. **Não há camada de Services geral** — controllers chamam os Models do Sequelize diretamente. O único service é o `PdfService`, usado pelo `TransactionController` para gerar o relatório.

```mermaid
classDiagram
    class User {
        +Integer id
        +String name
        +String email
        +String password
        +Date createdAt
        +Date updatedAt
    }

    class Transaction {
        +Integer id
        +String description
        +Decimal amount
        +Enum type
        +Date date
        +Integer userId
    }

    class Category {
        +Integer id
        +String name
        +String color
        +Integer userId
    }

    class AuthController {
        +register(req, res, next)
        +login(req, res, next)
    }

    class TransactionController {
        +getAll(req, res, next)
        +getSummary(req, res, next)
        +create(req, res, next)
        +update(req, res, next)
        +remove(req, res, next)
        +exportPDF(req, res, next)
    }

    class CategoryController {
        +create(req, res, next)
        +getAll(req, res, next)
    }

    class PdfService {
        +generateTransactionReport(transactions)
    }

    class AuthMiddleware {
        +authMiddleware(req, res, next)
    }

    class JwtUtils {
        +generateToken(id)
        +verifyToken(token)
    }

    class CryptoUtils {
        +hashPassword(password)
        +comparePassword(pw, hash)
    }

    User "1" --> "0..*" Transaction : possui
    User "1" --> "0..*" Category : possui
    AuthController ..> User
    AuthController ..> JwtUtils
    AuthController ..> CryptoUtils
    TransactionController ..> Transaction
    TransactionController ..> PdfService
    CategoryController ..> Category
    AuthMiddleware ..> JwtUtils
```

### 3. Componentes / Arquitetura

Como os módulos se comunicam: frontend ↔ backend via HTTP + JWT; backend ↔ PostgreSQL via Sequelize. `pdfService` é invocado apenas pelo `TransactionController` no fluxo de exportação. `useCategories` no frontend ainda usa `localStorage` (integração com `/api/categories` pendente).

```mermaid
graph LR
    Browser([Navegador])

    subgraph FE["Frontend (React + Vite)"]
        Pages["Pages<br/>Login · Register · Dashboard<br/>VisaoGeral · Categories"]
        AuthCtx["AuthContext<br/>useAuth"]
        UseCat["useCategories<br/>(localStorage, integração pendente)"]
        LS[("localStorage<br/>token + categories")]
        ApiClient["services/api.js<br/>Axios + interceptor JWT"]

        Pages --> AuthCtx
        Pages --> UseCat
        Pages --> ApiClient
        AuthCtx --> LS
        UseCat --> LS
    end

    subgraph BE["Backend (Node + Express)"]
        Routes["Routes<br/>/auth · /transactions · /categories"]
        MW["authMiddleware<br/>(JWT)"]
        Ctrls["Controllers<br/>Auth · Transaction · Category"]
        PdfSvc["pdfService<br/>(PDFKit)"]
        Models["Models Sequelize<br/>User · Transaction · Category"]

        Routes --> MW
        MW --> Ctrls
        Ctrls --> Models
        Ctrls -.->|export PDF| PdfSvc
    end

    DB[("PostgreSQL")]
    Docker["docker-compose"]

    Browser --> Pages
    ApiClient -->|HTTP + Bearer JWT| Routes
    Models --> DB
    Docker -.->|orquestra| DB
```

## 📌 Histórias de Usuário

### Autenticação
- Como um usuário, quero **fazer login no sistema** para acessar minhas finanças pessoais.

### Transações
- Como um usuário, quero **cadastrar uma transação** para registrar meus ganhos e gastos.
- Como um usuário, quero **editar uma transação** para corrigir informações incorretas.
- Como um usuário, quero **remover uma transação** para excluir registros indesejados.
- Como um usuário, quero **visualizar o histórico de transações** para acompanhar minhas movimentações financeiras.

### Filtros e Organização
- Como um usuário, quero **filtrar transações por mês, valor ou categoria** para encontrar informações específicas.
- Como um usuário, quero **categorizar minhas transações** para organizar melhor minhas finanças.
- Como um usuário, quero **cadastrar novas categorias** para personalizar a organização dos meus dados.

### Dashboard
- Como um usuário, quero **visualizar um dashboard financeiro** para ter uma visão geral das minhas finanças.
- Como um usuário, quero ver **o total de gastos** para controlar minhas despesas.
- Como um usuário, quero ver **o total de recebimentos** para acompanhar minha renda.
- Como um usuário, quero visualizar **gráficos (pizza e linha do tempo)** para entender melhor meus hábitos financeiros.

### Exportação
- Como um usuário, quero **exportar minhas transações em PDF** para compartilhar ou guardar meus dados.
