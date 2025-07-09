# Audit System

A comprehensive internal audit system built with modern technologies.

## Tech Stack

### Backend

- **NestJS** - Node.js framework for building scalable server-side applications
- **PostgreSQL** - Robust relational database
- **Prisma ORM** - Next-generation ORM for Node.js and TypeScript
- **JWT** - JSON Web Tokens for authentication
- **Swagger** - API documentation

### Frontend

- **React 18** - Modern React with hooks
- **Ant Design** - Enterprise-class UI design language
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **React Query** - Data fetching and caching
- **React Router** - Declarative routing

### Shared

- **TypeScript** - Type safety across the entire stack
- **Zod schemas** - Shared validation schemas
- **Monorepo** - Workspace management with npm workspaces

## Project Structure

```
audit-system/
├── packages/
│   └── shared/              # Shared types and utilities
│       ├── src/
│       │   └── index.ts     # Zod schemas and types
│       ├── package.json
│       └── tsconfig.json
├── apps/
│   ├── backend/             # NestJS API
│   │   ├── src/
│   │   │   ├── auth/        # Authentication module
│   │   │   ├── users/       # Users module
│   │   │   ├── audits/      # Audits module
│   │   │   ├── findings/    # Findings module
│   │   │   ├── evidence/    # Evidence module
│   │   │   ├── prisma/      # Database service
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/            # React application
│       ├── src/
│       │   ├── components/  # Reusable components
│       │   ├── contexts/    # React contexts
│       │   ├── pages/       # Page components
│       │   ├── lib/         # Utilities
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── package.json
└── README.md
```

## Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (ADMIN, AUDITOR, AUDITEE, VIEWER)
- Protected routes and API endpoints

### User Management

- User registration and login
- User profile management
- Role assignment and permissions

### Audit Management

- Create and manage audit projects
- Track audit status and progress
- Assign auditors and auditees
- Set priorities and deadlines

### Findings Management

- Record audit findings
- Risk assessment and categorization
- Management responses
- Evidence attachment

### Evidence Management

- File upload and storage
- Document management
- Evidence linking to findings

### Dashboard & Reporting

- Overview statistics
- Recent activities
- Status tracking
- Audit reports

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository and install dependencies:**

   ```bash
   npm install
   ```

2. **Set up the database:**

   ```bash
   # Create a PostgreSQL database
   createdb audit_system
   ```

3. **Configure environment variables:**

   ```bash
   # Copy the example environment file
   cp apps/backend/.env.example apps/backend/.env

   # Edit the .env file with your database connection string
   # DATABASE_URL="postgresql://username:password@localhost:5432/audit_system"
   ```

4. **Set up the database schema:**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed the database with initial data
   npm run db:seed
   ```

### Development

1. **Start both frontend and backend:**

   ```bash
   npm run dev
   ```

   Or start them separately:

   ```bash
   # Backend (http://localhost:3001)
   npm run dev:backend

   # Frontend (http://localhost:3000)
   npm run dev:frontend
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs
   - Database Studio: Run \`npm run db:studio\`

### Default Users

After seeding, you can login with these accounts:

- **Admin**: admin@audit.com / admin123
- **Auditor**: auditor@audit.com / auditor123
- **Auditee**: auditee@audit.com / auditee123

### Building for Production

```bash
# Build all applications
npm run build

# Build specific applications
npm run build:backend
npm run build:frontend
```

## Database Schema

The application uses the following main entities:

- **Users** - System users with different roles
- **Audits** - Audit projects and engagements
- **Findings** - Issues discovered during audits
- **Evidence** - Supporting documents and files

## API Documentation

The API is fully documented using Swagger/OpenAPI. After starting the backend, visit:
http://localhost:3001/api/docs

## Available Scripts

### Root Level

- \`npm run dev\` - Start both frontend and backend
- \`npm run build\` - Build all applications
- \`npm run lint\` - Lint all applications
- \`npm run test\` - Test all applications

### Backend Specific

- \`npm run dev:backend\` - Start backend in development mode
- \`npm run db:generate\` - Generate Prisma client
- \`npm run db:push\` - Push schema to database
- \`npm run db:migrate\` - Run database migrations
- \`npm run db:studio\` - Open Prisma Studio
- \`npm run db:seed\` - Seed database with initial data

### Frontend Specific

- \`npm run dev:frontend\` - Start frontend in development mode
- \`npm run build:frontend\` - Build frontend for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Commit your changes
6. Push to your branch
7. Create a Pull Request

## License

This project is licensed under the MIT License.
