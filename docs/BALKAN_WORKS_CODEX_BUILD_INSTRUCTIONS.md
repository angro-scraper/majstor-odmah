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

## Delivery phases and product boundary

Work in the following sequence: **understand → plan → build → test → improve**. Deliver small, coherent batches and do not introduce future functionality before the preceding value loop is verified.

| Phase | Scope | Exit condition |
| --- | --- | --- |
| 1. Foundation | Repository, frontend/client app, backend/API, database connection and environment configuration | Project can be installed, configured and run locally with documented prerequisites |
| 2. Database | Users, profiles, businesses, categories, locations, reviews, favorites and events | Reviewed migrations, indexes, relations and validation support the MVP flows |
| 3. Backend | Auth, users, businesses, search, reviews and analytics modules | Versioned API contracts enforce validation, permissions and useful errors |
| 4. Frontend | Customer discovery, business dashboard and admin experiences | Each surface has a clear useful path, including loading, empty, error and success states |
| 5. Core flows | Customer and business workflows | A real user can complete the end-to-end MVP journey against a database |
| 6. Quality | Tests, monitoring readiness, security review and release evidence | MVP acceptance criteria are verified before production deployment |

The established monorepo maps the requested concerns as follows: `apps/web` and future client apps are frontend; `services/api` is backend; `packages/database` is database; `docs` and `infrastructure` retain their direct names. Do not duplicate this structure solely to use alternate folder names.

## MVP acceptance flows

Customer flow:

`Register → login → search → view business → contact → submit review`

Business flow:

`Register → create profile → add category, location, services and images → request verification → receive customer activity`

The MVP is not complete until these flows work with a real database and permissions. A static UI preview or an endpoint without verified persistence is not sufficient evidence.

## Required module standard

Every module has a controller, service, persistence model/repository, DTO validation, permissions, tests, analytics events and documentation. It must answer: what problem it solves, which roles use it, data created/retained, feature flag, API contract and rollback behavior.

## Security and reliability

- Hash passwords; use short-lived JWT access tokens and revocable refresh sessions.
- Enforce RBAC, input validation, rate limits, audit logs and least privilege.
- Add indexes, relations, constraints, timestamps and soft-delete only where the data policy requires it.
- Test services, API validation and key user flows before deploy.
- Do not put business logic in UI/controllers or hardcode secrets/configuration.

## Error handling and performance

Errors must provide a safe, clear response to the caller while producing actionable system logs without leaking secrets or personal data. Design for fast discovery: use bounded queries, appropriate database indexes, pagination where lists can grow, lightweight client bundles and cached/static assets when appropriate. Measure before adding infrastructure complexity.

## Feature flags

All modules support `development`, `hidden`, `beta` and `active` visibility. Flags can be scoped by environment, country, role, partner and pilot cohort. Disabled modules are not presented as available functionality.

## Required documentation

Keep README, architecture, database, API, deployment, product/module and operations documentation current with each change. The strategy documents in this directory are implementation constraints, not decorative material.

## MVP completion checklist

Before a controlled production release, verify:

- a user can find, inspect, contact and review a business;
- a business owner can create and maintain a profile;
- authentication, validation, authorization and secret handling are in place;
- database migrations, backup/recovery procedure and deployment path are documented and tested proportionately;
- events make core discovery and connection behavior measurable;
- AI search, recommendations, marketplace, payments, mobile expansion and regional rollout remain explicit future extension points unless separately implemented and enabled.

## Final directive

Prioritize a working, testable MVP and a durable Core. Build for millions through clean contracts, measured scaling and secure defaults — never by adding unvalidated complexity early.
