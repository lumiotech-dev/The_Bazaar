# The Bazaar - Multi-Tenant E-Commerce Platform

A comprehensive, enterprise-grade multi-tenant e-commerce platform built with modern web technologies.

## 📋 Project Overview

The Bazaar consists of three main applications:

1. **Main App (Customer-Facing)** - 66 pages
   - Product catalog with search and filtering
   - Shopping cart and checkout
   - Order tracking and management
   - User profiles and wishlists
   - Reviews and ratings

2. **Vendor Portal** - 54 pages
   - Vendor registration and KYC
   - Product management
   - Order fulfillment
   - Financial dashboard and payouts
   - Analytics and insights

3. **Admin Portal** - 61 pages
   - Platform dashboard
   - Vendor management and approval
   - Order monitoring
   - Commission tracking
   - Staff management
   - Audit logs and security

## 🏗️ Architecture

### Monorepo Structure

```
the-bazaar-mono/
├── apps/
│   ├── main-app/              # Next.js 15 (Customer-facing)
│   ├── vendor-portal/         # Next.js 15 (Vendor dashboard)
│   ├── admin-portal/          # Next.js 15 (Admin console)
│   └── api-service/           # Fastify backend
├── libs/
│   ├── ui/                    # Design system & components (67 components)
│   ├── types/                 # Shared TypeScript types
│   ├── domains/               # Domain-specific business logic
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # Shared utility functions
├── packages/
│   └── config/                # Shared ESLint, Prettier configs
└── docs/                      # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 18.3
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui (67 components)
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query
- **Forms:** React Hook Form + Zod

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Fastify 4
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Drizzle ORM
- **Authentication:** Supabase Auth (JWT)
- **Storage:** Supabase Storage
- **Realtime:** Supabase Realtime
- **Background Jobs:** BullMQ + Redis

### Infrastructure
- **Package Manager:** pnpm
- **Monorepo Tool:** pnpm workspaces
- **Build Tool:** Vite (for libs), Next.js (for apps)
- **Testing:** Vitest
- **Linting:** ESLint
- **Formatting:** Prettier

### Payments
- **Stripe** - International payments
- **M-Pesa** - Mobile money (Kenya)
- **Pesapal** - Regional payments

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 14+
- Redis 7+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd the-bazaar-mono
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database:
```bash
pnpm db:push
```

5. Start development servers:
```bash
pnpm dev
```

This will start all applications in parallel:
- Main App: http://localhost:3001
- Vendor Portal: http://localhost:3002
- Admin Portal: http://localhost:3003
- API Service: http://localhost:3000

## 📦 Available Scripts

### Root Level

```bash
# Development
pnpm dev              # Start all apps in parallel

# Building
pnpm build            # Build all packages

# Testing
pnpm test             # Run all tests

# Linting & Formatting
pnpm lint             # Lint all packages
pnpm format           # Format all files
pnpm format:check     # Check formatting without changes

# Database
pnpm db:push          # Push database schema
pnpm db:migrate       # Run migrations

# Cleanup
pnpm clean            # Remove node_modules and build artifacts
```

### Individual Workspace

```bash
# Run script in specific workspace
pnpm --filter @bazaar/main-app dev
pnpm --filter @bazaar/vendor-portal build
pnpm --filter @bazaar/api-service test
```

## 📁 Workspace Packages

### Apps

- **@bazaar/main-app** - Customer-facing e-commerce application
- **@bazaar/vendor-portal** - Vendor management dashboard
- **@bazaar/admin-portal** - Admin console
- **@bazaar/api-service** - Fastify backend API

### Libraries

- **@bazaar/ui** - Design system with 67 reusable components
- **@bazaar/types** - Shared TypeScript type definitions
- **@bazaar/domains** - Domain-specific business logic
- **@bazaar/hooks** - Custom React hooks
- **@bazaar/utils** - Utility functions

### Packages

- **@bazaar/config** - Shared configuration (ESLint, Prettier)

## 🎨 Design System

The design system is built on a **Netflix-inspired dark theme** with professional components:

- **Primary Color:** Netflix Red (#E50914)
- **Background:** Black (#141414)
- **Typography:** Inter font family
- **Components:** 67 pre-built shadcn/ui components
- **Responsive:** Mobile-first approach with Tailwind breakpoints

See [Visual Design System](./Authoritative%20Docs/Visual_Design_System.md) for complete specifications.

## 📚 Documentation

- [UI/UX Visuals Plan](./Authoritative Docs/UI_UX_Visuals_Plan.md) - Design specifications for all 3 apps
- [Build Implementation Plan](./Authoritative Docs/Build_Implementation_Plan.md) - Detailed implementation guide
- [Tech Stack Specification](./Authoritative%20Docs/1_The_Bazaar_Tech_Stack_Specification.txt) - Technology choices
- [API Documentation](./docs/API.md) - API endpoints and specifications
- [Database Schema](./docs/DATABASE.md) - Database design and relationships

## 🔐 Security

- **Authentication:** Supabase Auth with JWT tokens
- **Authorization:** Row Level Security (RLS) policies
- **Data Encryption:** TLS for all communications
- **Rate Limiting:** API rate limiting on all endpoints
- **Input Validation:** Zod schemas for all inputs
- **CORS:** Configured for all three applications

## 🧪 Testing

- **Unit Tests:** Vitest
- **Integration Tests:** Vitest + Supertest
- **E2E Tests:** Playwright (optional)
- **Coverage:** Aim for 80%+ coverage

## 📊 Database

PostgreSQL with Supabase provides:
- 10+ tables with proper relationships
- Row Level Security (RLS) for multi-role access
- Real-time subscriptions
- Built-in authentication
- File storage with signed URLs

## 🚢 Deployment

### Staging
```bash
pnpm build
# Deploy to staging environment
```

### Production
```bash
pnpm build
# Deploy to production environment
```

See deployment documentation for detailed instructions.

## 📝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `pnpm test`
4. Format code: `pnpm format`
5. Commit: `git commit -am 'Add your feature'`
6. Push: `git push origin feature/your-feature`
7. Create a Pull Request

## 📄 License

MIT

## 👥 Team

Built with ❤️ by the Bazaar team.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the team.

---

**Last Updated:** November 2024
**Version:** 1.0.0-alpha
