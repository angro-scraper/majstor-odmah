# Balkan.works Codebase Structure

## Purpose

Define the canonical organization of the Balkan.works source code so a small team can build quickly now and multiple teams can extend modules safely later.

## Principle

Organize code around product capabilities and clear boundaries, not only technologies. A module owns its API contract, validation, business logic, persistence boundary, tests and documentation. UI renders state and invokes application services; it does not contain business rules or direct database access.

## Current monorepo root

The repository foundation is currently organized as:

```text
balkanworks/
├── apps/              # Web, mobile and admin application shells
├── services/          # API and future bounded platform services
├── packages/          # Shared UI, database, config, types and utilities
├── infrastructure/    # Docker and deployment/operations configuration
├── docs/              # Product, architecture, security and operations documentation
├── package.json
├── turbo.json
├── tsconfig.json
└── .env.example
```

`docs/` is the implemented documentation location. A separate `documentation/` root is not created because it would duplicate the source of truth; future categorized documentation can be introduced inside `docs/` without breaking links.

## Applications

```text
apps/
├── web/               # Public/consumer web and SEO-ready views
├── mobile/            # React Native consumer application
└── admin/             # Operations, moderation and administration interface
```

Within an application, use feature-first organization:

```text
src/
├── components/        # App composition from shared UI components
├── features/
│   └── businesses/
│       ├── components/
│       ├── api/
│       ├── models/
│       ├── hooks/
│       └── tests/
├── hooks/
├── services/          # API-client wiring; no domain policy
├── state/             # Client-only state
├── styles/
└── utils/
```

The mobile app follows the same feature ownership while retaining `screens/`, `navigation/`, `storage/` and `notifications/` for platform-specific concerns. The admin app groups operational features such as dashboard, users, businesses, moderation, analytics and settings behind role permissions.

## Backend

```text
services/api/src/
├── common/            # Shared guards, filters, response helpers and cross-cutting policy
├── config/            # Validated runtime configuration
├── database/          # Prisma integration and database infrastructure
├── modules/           # Product/domain modules
│   ├── auth/
│   ├── users/
│   ├── businesses/
│   ├── locations/
│   ├── offers/
│   ├── search/
│   ├── notifications/
│   ├── analytics/
│   ├── admin/
│   ├── ai/
│   └── payments/
└── main.ts / app.module.ts
```

Some future module folders are planned and feature-flagged rather than fully implemented. The current API foundation must not be represented as a completed production implementation until dependencies, migrations, tests and deployment have been run and verified.

### Module standard

```text
modules/<capability>/
├── controllers/       # Transport only: request, DTO validation, response
├── services/          # Domain/business rules and permitted module collaboration
├── repositories/      # Persistence interface/implementation
├── entities/          # Domain models where needed
├── dto/               # Input/output boundary contracts
├── interfaces/        # Explicit module contracts
├── policies/          # Resource/permission rules where appropriate
├── events/            # Domain events; no direct cross-module table coupling
├── tests/
└── <capability>.module.ts
```

Controllers do not contain business logic or direct database queries. Services do not leak infrastructure details. Repositories are the persistence boundary. Inter-module collaboration uses public service interfaces, API contracts or events — never a module reaching into another module's private tables.

## Database package

```text
packages/database/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/    # Generated and reviewed migrations
│   └── seed/          # Safe development/test seed data
├── src/
└── tests/
```

The schema is versioned with the code. Every data change has a migration, test/validation path, rollback consideration and documentation update. Backups are operational artifacts managed through infrastructure/provider procedures, not committed database dumps.

## Shared packages

```text
packages/
├── ui/                # Design tokens and reusable components
├── database/          # Prisma schema/client integration
├── config/            # Shared, typed configuration contracts
├── types/             # Public API/domain types with stable ownership
├── utils/             # Small stateless shared utilities
└── api-client/        # Future typed client generated/maintained from OpenAPI
```

Shared packages must remain narrow. Feature-specific code belongs to its owning application or backend module; a package is created only when at least two consumers need a stable shared contract.

## Infrastructure and tools

```text
infrastructure/
├── docker/
├── deployment/
├── monitoring/
└── security/

tools/                 # Add only for versioned developer/CI utilities
tests/                 # Cross-application end-to-end suites when introduced
```

Infrastructure configuration uses environment variables and secret-management references, never credentials in the repository. Scripts are deterministic, documented and safe for their target environment.

## Documentation organization

Keep `docs/` searchable and modular. As it grows, group new material under `architecture/`, `api/`, `product/`, `security/` and `operations/`; preserve stable README links and avoid duplicate source-of-truth documents. Each code module links to its feature/API/testing documentation where material.

## Development, Git and review rules

- One capability/change per focused branch and intentional commit.
- Main remains releasable; protected review/CI policy is enabled when team workflow is ready.
- Each new feature includes module code, migration if applicable, tests, telemetry/monitoring consideration and documentation.
- Run lint/type/test/build/security checks appropriate to the changed scope before merge.
- Never commit passwords, API keys, private tokens, database dumps or user data.

## Testing layout

Module tests live close to the module for unit/integration coverage. Cross-module API tests live in `services/api` test structure; application component/feature tests stay with the application; end-to-end flows can live in top-level `tests/`. The Test Case Library is the quality specification that implementation tests trace back to.

## Microservice readiness

The starting architecture is a modular monolith. Clear module contracts, events, repository boundaries, configuration isolation and tenant/resource authorization allow a capability to become an independent service only when traffic, team ownership or reliability evidence justifies it. Do not split services merely to mirror folders.

## Final vision

The codebase should make the correct path easy: one module owns one capability, shared contracts remain small, sensitive boundaries are explicit and each addition leaves Balkan.works easier to understand and extend.
