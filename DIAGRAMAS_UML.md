# Diagramas UML — Finanças Pessoais

Documentação preliminar do sistema em UML, em formato Mermaid (markdown). Cada diagrama responde uma pergunta diferente sobre o sistema:

| # | Diagrama | Pergunta que responde |
|---|----------|------------------------|
| 1 | Casos de Uso | O que o sistema faz, do ponto de vista do usuário? |
| 2 | Classes | Quais são as entidades e como elas se relacionam? |
| 3 | Componentes / Arquitetura | Como front, back e banco se conectam? |

> Os mesmos diagramas estão embutidos no `README.md` para visualização direta na home do repositório no GitHub. PNGs renderizados em `docs/uml/`.

---

## 1. Diagrama de Casos de Uso

Mostra as funcionalidades disponíveis para o usuário e dependências entre elas (`include`). As categorias são persistidas no backend (`/api/categories`) e podem ser vinculadas às transações por `categoryId`.

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
    User --> UC11[Categorizar transação]
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
```

**Legenda**:
- Setas contínuas: associação ator–caso de uso.
- Setas tracejadas `include`: o caso de origem depende do caso de destino (ex.: para listar transações é preciso estar logado).
- Categorizar transação usa a relação persistida `Transaction.categoryId -> Category.id`.

---

## 2. Diagrama de Classes

Modelo de dados e principais classes do backend. Após a refatoração do main, **não há mais camada de Services geral**: controllers chamam os Models do Sequelize diretamente. O único service remanescente é o `PdfService`, dedicado à geração do relatório em PDF.

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
        +Integer categoryId
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
        +remove(req, res, next)
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
    Category "1" --> "0..*" Transaction : classifica
    AuthController ..> User
    AuthController ..> JwtUtils
    AuthController ..> CryptoUtils
    TransactionController ..> Transaction
    TransactionController ..> PdfService
    CategoryController ..> Category
    AuthMiddleware ..> JwtUtils
```

**Legenda**:
- `1 — 0..*`: cardinalidade (um usuário possui várias transações/categorias, e uma categoria pode classificar várias transações).
- Setas tracejadas (`..>`): dependência (uma classe usa outra).
- Não há classes `*Service` para auth/user/transaction — esses controllers conversam com Sequelize diretamente.

---

## 3. Diagrama de Componentes / Arquitetura

Mostra os módulos do sistema e como eles se comunicam. O frontend conversa com o backend via HTTP + JWT; o backend persiste em PostgreSQL via Sequelize; o `pdfService` é invocado apenas pelo `TransactionController` no fluxo de exportação. `useCategories` busca e persiste categorias pela API (`/api/categories`); o `localStorage` fica restrito aos dados de sessão.

```mermaid
graph LR
    Browser([Navegador])

    subgraph FE["Frontend (React + Vite)"]
        Pages["Pages<br/>Login · Register · Dashboard<br/>VisaoGeral · Categories"]
        AuthCtx["AuthContext<br/>useAuth"]
        UseCat["useCategories<br/>(API /categories)"]
        LS[("localStorage<br/>token + user")]
        ApiClient["services/api.js<br/>Axios + interceptor JWT"]

        Pages --> AuthCtx
        Pages --> UseCat
        Pages --> ApiClient
        AuthCtx --> LS
        UseCat --> ApiClient
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

**Legenda**:
- Caixas com cantos retos: componentes de software.
- Cilindros: armazenamento (`PostgreSQL` para dados do domínio; `localStorage` só para sessão).
- Setas contínuas: fluxo de chamada/dependência.
- Setas tracejadas: orquestração de infraestrutura ou caminho secundário (geração de PDF).
- O JWT é injetado automaticamente em todas as requisições autenticadas pelo interceptor do Axios em `frontend/src/services/api.js`.
