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

Documentação preliminar do sistema em UML (Mermaid). Versão estendida e legendada em [`DIAGRAMAS_UML.md`](./DIAGRAMAS_UML.md).

### 1. Casos de Uso

Funcionalidades do ponto de vista do usuário. Casos em amarelo (categorias) são **client-side apenas** — vivem em `localStorage`, sem persistência no backend.

```mermaid
graph LR
    User((Usuário))

    User --> UC1[Cadastrar conta]
    User --> UC2[Fazer login]
    User --> UC3[Listar transações]
    User --> UC4[Cadastrar transação]
    User --> UC5[Editar transação]
    User --> UC6[Remover transação]
    User --> UC7[Filtrar por mês/categoria]
    User --> UC8[Cadastrar categoria]:::client
    User --> UC9[Categorizar transação]:::client
    User --> UC10[Ver dashboard com gráficos]
    User --> UC11[Exportar PDF]

    UC3 -.->|include| UC2
    UC4 -.->|include| UC2
    UC5 -.->|include| UC2
    UC6 -.->|include| UC2
    UC7 -.->|include| UC3
    UC10 -.->|include| UC3
    UC11 -.->|include| UC3

    classDef client fill:#fff3cd,stroke:#e0a800,color:#333
```

### 2. Classes

Modelo de dados e principais classes por camada (Controller → Service → Model). `Category` é `<<frontend-only>>` (não há entidade no backend).

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
        <<frontend-only>>
        +String id
        +String name
    }

    class AuthController {
        +register(req, res)
        +login(req, res)
    }

    class TransactionController {
        +list(req, res)
        +create(req, res)
        +update(req, res)
        +remove(req, res)
    }

    class UserController {
        +profile(req, res)
    }

    class AuthService {
        +registerUser(data)
        +authenticate(email, password)
    }

    class TransactionService {
        +listByUser(userId)
        +create(data)
        +update(id, data)
        +remove(id)
    }

    class UserService {
        +findById(id)
    }

    class AuthMiddleware {
        +verifyJWT(req, res, next)
    }

    User "1" --> "0..*" Transaction : possui
    AuthController ..> AuthService
    TransactionController ..> TransactionService
    UserController ..> UserService
    AuthService ..> User
    TransactionService ..> Transaction
    UserService ..> User
    AuthMiddleware ..> User : valida JWT
```

### 3. Componentes / Arquitetura

Como os módulos se comunicam: frontend ↔ backend via HTTP + JWT; backend ↔ PostgreSQL via Sequelize.

```mermaid
graph LR
    Browser([Navegador])

    subgraph FE["Frontend — React + Vite"]
        Pages["Pages<br/>Login · Dashboard<br/>VisaoGeral · Categories · Profile"]
        AuthCtx["AuthContext<br/>useAuth"]
        UseCat["useCategories"]
        LS[("localStorage<br/>token + categories")]
        ApiClient["services/api.js<br/>Axios + interceptor JWT"]

        Pages --> AuthCtx
        Pages --> UseCat
        Pages --> ApiClient
        AuthCtx --> LS
        UseCat --> LS
    end

    subgraph BE["Backend — Node + Express"]
        Routes["Routes<br/>/auth · /users · /transactions"]
        MW["authMiddleware<br/>verifica JWT"]
        Ctrls["Controllers<br/>Auth · User · Transaction"]
        Svcs["Services<br/>Auth · User · Transaction"]
        Models["Models Sequelize<br/>User · Transaction"]

        Routes --> MW
        MW --> Ctrls
        Ctrls --> Svcs
        Svcs --> Models
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
