# Balkan.works Project Structure

## Purpose

This is the code-organization standard for Balkan.works. Its purpose is fast delivery, maintainability, clear ownership and future scale without duplicating the existing monorepo.

## Canonical root structure

```text
balkanworks/
├── apps/                 # user-facing applications
│   ├── web/              # Next.js customer web experience
│   ├── admin/            # future/admin application boundary
│   └── mobile/           # future mobile application boundary
├── services/
│   └── api/              # NestJS backend
├── packages/
│   ├── database/         # Prisma schema, migrations and database package
│   ├── ui/               # shared UI primitives
│   ├── types/            # shared contracts
│   ├── config/           # shared configuration
│   └── utils/            # shared utilities
├── docs/
├── infrastructure/
│   └── docker/
├── scripts/              # created only for reusable project automation
└── README.md
```

`apps/web`, `services/api` and `packages/database` are the canonical frontend, backend and database areas. Do not create duplicate `frontend/`, `backend/` or `database/` roots unless the repository architecture is deliberately migrated through an approved decision record.

## Frontend structure

`apps/web` uses Next.js, React and TypeScript. As the application grows, organize it around product features rather than one technology-only folder:

```text
apps/web/
├── app/                  # routes, layouts and page-level composition
├── components/           # reusable UI components
├── features/             # auth, search, businesses, reviews, favorites
├── hooks/                # reusable React behavior
├── services/             # typed API communication
├── store/                # client state only when needed
├── types/                # app-specific types
├── utils/
├── styles/
└── public/
```

Components have one responsibility and use PascalCase names, for example `BusinessCard.tsx`. Functions use camelCase. Product rules and API calls do not live in page components when a feature module can own them.

## Backend structure

`services/api` uses NestJS and TypeScript:

```text
services/api/src/
├── common/               # shared guards, decorators and cross-cutting concerns
├── modules/
│   ├── auth/
│   ├── users/
│   ├── businesses/
│   ├── categories/
│   ├── search/
│   ├── reviews/
│   ├── analytics/
│   └── admin/
├── config/               # typed configuration when required
├── database/             # API-specific database integration only
└── main.ts
```

Each domain module contains its module definition, controller, service, DTOs, validation and tests. Controllers manage HTTP concerns; services own business logic; the database package owns Prisma schema and database-client behavior. Do not mix business rules into controllers or UI.

## Database structure

```text
packages/database/
├── prisma/
│   ├── schema.prisma
│   └── migrations/       # generated and reviewed migration history
├── src/
│   └── index.ts
└── package.json
```

Database fields use mapped `snake_case` names where that is the persistence convention, while TypeScript models remain idiomatic camelCase. Every schema change is a reviewed migration, tested against a non-production database before deployment. Seeds are idempotent and belong beside the database package.

## Documentation and infrastructure

Documentation remains in `docs/`, organized by subject through stable filenames until a nested taxonomy materially improves navigation. Infrastructure contains Docker, deployment, cloud and monitoring templates. Environment values and secrets never belong in either source directory.

## Ownership and quality

Every material module has an accountable owner, documentation, tests and measurable behavior. New work must answer: which domain owns it, which users/roles use it, which data it creates, which API contract it exposes, how it is tested and how it can be safely rolled back.

## Future readiness

This organization supports mobile clients, AI services, marketplace capabilities, multiple countries and multiple languages by keeping Core domains clear. Those capabilities are added through explicit modules and contracts — not by pre-building unused infrastructure.
