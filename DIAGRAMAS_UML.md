# Diagramas UML — Finanças Pessoais

Documentação preliminar do sistema em UML, em formato Mermaid (markdown). Cada diagrama responde uma pergunta diferente sobre o sistema:

| # | Diagrama | Pergunta que responde |
|---|----------|------------------------|
| 1 | Casos de Uso | O que o sistema faz, do ponto de vista do usuário? |
| 2 | Classes | Quais são as entidades e como elas se relacionam? |
| 3 | Componentes / Arquitetura | Como front, back e banco se conectam? |

> Os mesmos diagramas estão embutidos no `README.md` para visualização direta na home do repositório no GitHub.

---

## 1. Diagrama de Casos de Uso

Mostra as funcionalidades disponíveis para o usuário e dependências entre elas (`include`). Casos em amarelo são **client-side apenas** (vivem em `localStorage` no navegador, sem persistência no backend hoje).

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

**Legenda**:
- Setas contínuas: associação ator–caso de uso.
- Setas tracejadas `include`: o caso de origem depende do caso de destino (ex.: para listar transações é preciso estar logado).
- Amarelo: caso de uso ainda **não persistido no backend** — implementado apenas no frontend via `localStorage`.

---

## 2. Diagrama de Classes

Modelo de dados e principais classes da aplicação organizadas por camada (Controller → Service → Model). `Category` aparece como `<<frontend-only>>` porque não há entidade equivalente no backend.

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

**Legenda**:
- `1 — 0..*`: relacionamento de cardinalidade (um usuário possui várias transações).
- Setas tracejadas (`..>`): dependência (uma classe usa outra).
- `<<frontend-only>>`: estereótipo indicando que a classe vive apenas no cliente.

---

## 3. Diagrama de Componentes / Arquitetura

Mostra os módulos do sistema e como eles se comunicam. O frontend conversa com o backend via HTTP + JWT; o backend persiste em PostgreSQL via Sequelize; categorias e token ficam em `localStorage` do navegador.

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

**Legenda**:
- Caixas com cantos retos: componentes de software.
- Cilindros: armazenamento (banco ou `localStorage`).
- Setas contínuas: fluxo de chamada/dependência.
- Setas tracejadas: orquestração de infraestrutura.
- O JWT é injetado automaticamente em todas as requisições autenticadas pelo interceptor do Axios em `frontend/src/services/api.js`.
