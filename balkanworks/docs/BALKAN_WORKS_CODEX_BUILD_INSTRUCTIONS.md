# Balkan.works Codex Build Instructions

## Role and outcome

Build Balkan.works as a modular, security-first regional platform — not as isolated screens or disconnected applications. Each feature belongs to a documented module, uses Core services and is safe to activate gradually.

## Canonical repository

The active repository root is `balkanworks/`. Do not create a second parallel `balkan-works/` tree. The existing layout is the canonical implementation of these domains:

- `apps/`: mobile, web and admin clients;
- `services/api/`: NestJS REST API and domain modules;
- `packages/`: UI, database, config, types and utils;
- `infrastructure/`: Docker, deployment and monitoring templates;
- `docs/`: architecture, API, product and operating documentation.

## Technology and core rules

Use TypeScript, React Native, Next.js, NestJS, PostgreSQL/Prisma, Redis and object-storage adapters. API paths are versioned under `/api/v1`. No secrets are committed. Controllers validate and delegate; services own business logic; repositories/database packages own persistence.

## MVP module order

1. Repository, environment and database migration safety.
2. Authentication: registration, login, hashed passwords, refresh sessions and role assignments.
3. Users: profile, preferences, location and privacy settings.
4. Businesses: ownership, category, location, verification and approval flow.
5. Offers/Categories/Favorites: creation, publication, save and expiry.
6. Search: PostgreSQL-backed discovery, prepared for semantic search.
7. Notifications and analytics events.
8. Mobile, business dashboard and admin flows.
9. AI Gateway behind feature flags and human approval rules.

Future Save Food, Opsnestone, Digital Flyers, Stock Radar, Wallet, Marketplace and AI agents extend Core through contracts and flags; they do not require Core to be rebuilt.

## Required module standard

Every module has a controller, service, persistence model/repository, DTO validation, permissions, tests, analytics events and documentation. It must answer: what problem it solves, which roles use it, data created/retained, feature flag, API contract and rollback behavior.

## Security and reliability

- Hash passwords; use short-lived JWT access tokens and revocable refresh sessions.
- Enforce RBAC, input validation, rate limits, audit logs and least privilege.
- Add indexes, relations, constraints, timestamps and soft-delete only where the data policy requires it.
- Test services, API validation and key user flows before deploy.
- Do not put business logic in UI/controllers or hardcode secrets/configuration.

## Feature flags

All modules support `development`, `hidden`, `beta` and `active` visibility. Flags can be scoped by environment, country, role, partner and pilot cohort. Disabled modules are not presented as available functionality.

## Required documentation

Keep README, architecture, database, API, deployment, product/module and operations documentation current with each change. The strategy documents in this directory are implementation constraints, not decorative material.

## Final directive

Prioritize a working, testable MVP and a durable Core. Build for millions through clean contracts, measured scaling and secure defaults — never by adding unvalidated complexity early.
