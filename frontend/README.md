# Systructure Frontend

React-based web application for the Systructure architecture visualization tool.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for development and builds
- **React Flow** (`@xyflow/react`) for diagram editor
- **Apollo Client** for GraphQL
- **shadcn/ui** + Tailwind CSS v4
- **React Router** for navigation
- **Zod** + React Hook Form for validation

## Getting Started

### Prerequisites

- Node.js 20+
- Backend running on `http://localhost:8080`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:5173`

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui primitives
│   ├── flow/        # React Flow nodes/edges
│   └── landing/     # Landing page sections
├── pages/           # Route pages
├── layouts/         # Page layouts (Dashboard, Editor)
├── contexts/        # React contexts (Auth)
├── hooks/           # Custom hooks
├── lib/             # Utility functions
├── queries.ts       # GraphQL queries/mutations
└── types.ts         # TypeScript types
```

## Environment Variables

Create `.env.local`:

```bash
VITE_GRAPHQL_URL=http://localhost:8080/graphql
```

## Key Features

- **Flow Editor** — Drag-and-drop architecture diagrams with custom node types
- **Authentication** — Login/signup with JWT tokens stored in localStorage
- **Project Dashboard** — Manage multiple architecture projects
- **Error Boundaries** — Graceful error handling throughout the app
