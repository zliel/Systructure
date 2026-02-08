# Systructure Backend

Spring Boot GraphQL API for the Systructure architecture visualization tool.

## Tech Stack

- **Spring Boot 4** with Java 25
- **Spring GraphQL** for API
- **Spring Security** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **Lombok** for boilerplate reduction

## Getting Started

### Prerequisites

- Java 25+
- PostgreSQL 16+ (or Docker)
- Gradle 8+

### Database Setup

Using Docker:

```bash
docker compose up -d postgres
```

Or create a PostgreSQL database named `systructure`.

### Run

```bash
./gradlew bootRun
```

- GraphQL endpoint: `http://localhost:8080/graphql`
- GraphiQL playground: `http://localhost:8080/graphiql`

### Test

```bash
./gradlew test
```

## Project Structure

```
src/main/java/com/systructure/
├── controller/      # GraphQL resolvers
├── model/           # JPA entities
├── repository/      # Data access layer
├── service/         # Business logic
├── security/        # JWT authentication
├── dto/             # Request/response DTOs
├── config/          # App configuration
└── exception/       # Custom exceptions
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USERNAME` | `postgres` | Database username |
| `DB_PASSWORD` | `password` | Database password |
| `JWT_SECRET` | (dev key) | JWT signing key (256+ bits for production) |

### application.properties

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/systructure
spring.graphql.graphiql.enabled=true
jwt.access-token-expiration-ms=900000     # 15 minutes
jwt.refresh-token-expiration-ms=604800000 # 7 days
```

## GraphQL Schema

Located at `src/main/resources/graphql/schema.graphqls`

### Key Types

- **User** — User accounts with roles (ADMIN, USER)
- **Project** — Architecture projects with public/private visibility
- **ProjectMember** — Access control (OWNER, EDITOR, VIEWER)
- **Node** — Diagram nodes (SERVICE, DATABASE, GATEWAY, QUEUE)
- **Edge** — Connections between nodes

### Example Queries

```graphql
# Get project with nodes
query {
  projectById(id: "uuid") {
    name
    nodes { id name type xPos yPos }
    edges { id sourceNode { id } targetNode { id } }
  }
}

# Create a node
mutation {
  createNode(newNodeData: {
    name: "API Gateway"
    type: GATEWAY
    projectId: "uuid"
    xPos: 100
    yPos: 200
  }) {
    id
    name
  }
}
```

## Authentication

JWT-based authentication with access and refresh tokens.

### Endpoints (REST)

- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Get tokens
- `POST /api/auth/refresh` — Refresh access token
- `POST /api/auth/logout` — Invalidate refresh token

