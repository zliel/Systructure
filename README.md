# Systructure

A free, open-source system architecture visualization tool that makes designing microservices diagrams as intuitive as whiteboarding, but with the precision of code.

![Status](https://img.shields.io/badge/status-early%20development-yellow.svg)

## Features

- **Visual Flow Editor** — Drag-and-drop interface for creating architecture diagrams with custom node types (Services, Databases, Gateways, Message Queues)
- **Real-time Collaboration** — Project-based organization with role-based access control (Owner, Editor, Viewer)
- **GraphQL API** — Modern, type-safe API for all operations
- **JWT Authentication** — Secure user authentication with access and refresh tokens
- **Dark Mode** — Beautiful, accessible UI built with shadcn/ui components

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and builds
- **React Flow** (`@xyflow/react`) for node-based diagrams
- **Apollo Client** for GraphQL
- **shadcn/ui** + Tailwind CSS for styling
- **React Router** for navigation
- **Zod** + React Hook Form for validation

### Backend
- **Spring Boot 4** with Java 25
- **Spring GraphQL** for API
- **Spring Security** with JWT (jjwt)
- **Spring Data JPA** with PostgreSQL
- **Lombok** for boilerplate reduction

### Infrastructure
- **PostgreSQL 16** for data persistence
- **Docker Compose** for local development

## 🚀 Getting Started

### Prerequisites

- Java 25+
- Node.js 20+
- PostgreSQL 16+ (or Docker)
- Gradle 8+

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/systructure.git
cd systructure
```

### 2. Start the Database

Using Docker (recommended):

```bash
docker compose up -d postgres
```

Or configure a local PostgreSQL:
- Database: `systructure`
- User: `postgres`
- Password: `password`

### 3. Run the Backend

```bash
cd backend
./gradlew bootRun
```

The GraphQL endpoint will be available at `http://localhost:8080/graphql`.  
GraphiQL playground: `http://localhost:8080/graphiql`

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
systructure/
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/systructure/
│   │   ├── controller/      # GraphQL resolvers
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data access
│   │   ├── service/         # Business logic
│   │   ├── security/        # JWT authentication
│   │   └── dto/             # Data transfer objects
│   └── src/main/resources/
│       └── graphql/         # GraphQL schema
├── frontend/                # React application
│   └── src/
│       ├── components/      # UI components
│       ├── pages/           # Route pages
│       ├── layouts/         # Page layouts
│       ├── contexts/        # React contexts
│       └── lib/             # Utilities
└── docker-compose.yml       # Development services
```

## 🔧 Configuration

### Backend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `password` | PostgreSQL password |
| `JWT_SECRET` | (dev key) | JWT signing secret (256+ bits for production) |

### Frontend Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
VITE_GRAPHQL_URL=http://localhost:8080/graphql
```

## 🧪 Running Tests

### Backend

```bash
cd backend
./gradlew test
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

## 📊 GraphQL Schema

Key types available in the API:

- **User** — User accounts with roles (Admin, User)
- **Project** — Architecture projects with visibility settings
- **ProjectMember** — Project access with roles (Owner, Editor, Viewer)
- **Node** — Architecture components (Service, Database, Gateway, Queue)
- **Edge** — Connections between nodes

See the full schema at [`backend/src/main/resources/graphql/schema.graphqls`](./backend/src/main/resources/graphql/schema.graphqls)

## 🤝 Contributing

We're in early development and welcome contributions! Here's how you can help:

1. **Report bugs** — Open an issue with steps to reproduce
2. **Suggest features** — Share ideas in GitHub Discussions
3. **Submit PRs** — Fork, branch, and submit a pull request

## 🔗 Links

- [GitHub Repository](https://github.com/systructure)
- [Documentation](https://docs.systructure.io) *(coming soon)*

