# Balkan.works Development Rules

## Core principle

Balkan.works is a platform built for 5–10 years, millions of users, many countries and independent modules. Prefer the scalable architecture when a shortcut would create future debt.

## General rules

1. Every capability belongs to a module.
2. Business logic never lives in controllers, frontend components or raw database-query files.
3. Modules are independent and communicate through documented APIs or event contracts, never hidden direct database coupling.
4. No module, schema or existing function is replaced, deleted or duplicated without an approved migration/design review.

## Target backend standard

The long-term backend target is NestJS with TypeScript, PostgreSQL and Prisma or TypeORM. Every module follows:

```text
module-name/
  controllers/
  services/
  repositories/
  entities/
  dto/
  interfaces/
  tests/
  module.ts
```

Controllers receive requests, validate input and call services. Services own business rules and controlled module communication. Repositories own persistence. No controller directly accesses the database.

## Data and API

- Database: snake_case; code: camelCase; classes: PascalCase.
- Every table uses UUID, `created_at`, `updated_at` and planned `deleted_at` soft-delete support.
- Every endpoint has OpenAPI documentation, validation, permission check, safe error handling and a versioned response envelope.
- Error responses use stable codes such as `USER_NOT_FOUND`, `INVALID_PERMISSION` and `BUSINESS_NOT_VERIFIED`; never vague server messages.

## Frontend

The target clients are React Native and Next.js. Shared Design System components (Button, Card, Modal, Input, Avatar, Badge, Navbar, Sidebar, Search, MapCard, OfferCard and BusinessCard) are reused across modules. React Query owns server state; Zustand or Redux owns global state.

## Security

JWT, refresh tokens, encryption, rate limiting, server-side validation, permissions and audit logs are mandatory. Passwords are never stored in plain text; frontend validation is never trusted alone; private data is protected in transit and at rest.

## Testing and review

Every module has unit tests for services/business rules, integration tests for API/database behavior and E2E tests for key journeys. Significant changes require review, tests and a security check.

## Git and commits

Preferred branches: `main`, `develop`, `feature/module-name`, `bugfix/name`.

Use conventional intent: `feat:`, `fix:`, `docs:`. Every change updates architecture, database and API documentation where relevant.

## AI coding constraints

Before coding, read the existing architecture and use its modules/naming. Add tests and documentation. Never create a replacement architecture without approval, change the database without migration, duplicate code, or remove existing behavior.

## Feature workflow

1. Create `FEATURE_NAME.md`.
2. Define goal, user, database changes, API changes and UI changes.
3. Implement.
4. Test.
5. Deploy.

## Performance, logs and monitoring

Design for 1M users, 100k businesses and millions of offers with pagination, indexes, caching and queues. Important user, payment, error and security events are logged. Error tracking, uptime monitoring and performance metrics are required platform services.
