# Balkan.works Backend Implementation Plan

## Principle

Build a modular monolith with clear module boundaries. Controllers accept/validate requests, services own business rules, the database package/repositories own persistence and modules communicate through explicit contracts/events.

## Layering

`API controller → application service → domain/business rules → repository/data access → PostgreSQL`

No business rule belongs in controllers, UI or ad-hoc database queries. Each module owns its DTOs, permissions, tests, documentation and analytics events.

## Core implementation order

1. **Foundation:** NestJS app, config/secrets, Prisma, migrations, structured responses/errors and health checks.
2. **Auth:** registration, login, logout/refresh, password hashing, session revocation, RBAC and audit events.
3. **Users:** current profile, preferences, location and security/privacy settings.
4. **Businesses:** ownership/membership, profile, categories, locations, status/review and verification.
5. **Offers:** create/update/publish/archive, expiry, media references, favorite interactions and moderation state.
6. **Search:** PostgreSQL text/category/city filtering, pagination and geographic extension points.
7. **Platform services:** analytics events, notifications, admin moderation and operational reporting.
8. **Advanced modules:** AI Gateway, payments, Marketplace and background workers only after Core prerequisites are complete.

## Module responsibilities

| Module | Responsibility |
| --- | --- |
| Auth | Identity, sessions, password/token security and roles |
| Users | Profile, preferences and account settings |
| Businesses | Tenant ownership, profile, members, locations and approval |
| Offers | Offer lifecycle, publication, expiry and interaction |
| Search | Discovery/filtering/location queries, semantic-search readiness |
| Analytics | Validated event tracking and aggregate reporting |
| Notifications | In-app/email/push adapters and delivery state |
| Admin | Users, businesses, content moderation and security operations |
| AI | Permissioned gateway, recommendations/chat/analysis behind flags |

## Data and security

Prisma migrations are reviewed, tested and promoted through environments. Tables use UUIDs, timestamps, constraints/indexes and status fields where appropriate. Authorization derives tenant/actor identity from the session, never client input. API protections include validation, rate limiting, logging, safe errors, audit trails and least privilege.

## Storage, cache and workers

Object storage adapters provide secure media upload, content-type/size validation, private defaults and later image processing. Redis supports cache/rate limits and eligible session/queue concerns; PostgreSQL remains the source of truth. Background jobs handle notifications, event processing, reports and approved AI tasks with retry/idempotency/observability rules.

## Quality gates

Each module requires unit tests for service rules, API/integration tests for permissions/validation/persistence and E2E coverage for critical flows. Monitor server health, API latency/error rate, queue/cache state, database health and business outcome signals.

## Scaling path

Start with one well-observed Core API. Add cache, workers, replicas and targeted service extraction only for demonstrated load, isolation, reliability or regulatory boundaries. Do not decompose into microservices before teams and operations can support them.
