# Balkan.works System Design

## Purpose

Define the technical design that supports a stable MVP, maintainable modular development, fast delivery of new capabilities and evidence-led scaling.

## Architecture principle

Begin with a modular monolith: one deployable core with clear domain boundaries and contracts. Extract an independent service only when traffic, ownership, reliability or scaling evidence makes the added operational complexity worthwhile.

`Users → Web/Mobile/Admin → versioned API → modular application layer → PostgreSQL/data services → analytics and future AI`

## Application architecture

### Frontend

The web application provides public discovery, business profiles and web dashboards. The mobile application provides consumer-local discovery and later native capabilities. The admin application provides permissioned operations.

The selected foundation is TypeScript with Next.js for web/admin and React Native for mobile, using the shared UI/design package, typed API client, server-state management and accessible responsive components. Flutter is not added in parallel because React Native is the selected mobile stack; a second mobile stack would duplicate product and maintenance work.

Frontend responsibilities are presentation, local interaction state, accessible error/loading behavior and API consumption. Business policy, authorization and direct database access stay on the server.

### Backend

Node.js, NestJS and TypeScript provide the modular API application. Core domains are authentication, users, businesses, locations/categories, offers, favorites/reviews, search, notifications, analytics, administration, feature flags and future AI/payments adapters.

Each domain owns controller/DTO validation, service business rules, repository/persistence boundary, permissions, events, tests and documentation. Cross-domain interactions use contracts/events, not direct access to another module's private persistence implementation.

## Identity and access

Balkan ID provides registration, login, password recovery/email verification when released, secure password hashing, short-lived JWT access tokens and session/refresh control. Authorization combines role and resource/tenant checks: User/Customer, Business Owner/Member, Moderator, Admin, Super Admin and narrowly scoped system jobs. Privileged accounts require stronger controls such as MFA before production use.

## Data and storage

PostgreSQL is the transactional source of truth, modeled through Prisma and versioned migrations. It contains users/profiles, businesses/memberships, locations/categories, offers, favorites, reviews, notifications, sessions, audit data and governed events. Data changes require migrations, validation, indexes, backup/restore consideration and documentation.

Object storage is the future boundary for logos, images, flyers and documents. It requires authorized uploads, file type/size validation, safe object naming, scanning/processing policy and controlled public access. No credentials or production file URLs are hardcoded in clients.

## Discovery, cache and asynchronous work

MVP discovery uses indexed PostgreSQL filtering/full-text search with country/city/category/status constraints. At scale, a dedicated OpenSearch/Elasticsearch-style search index can be introduced behind a Search module contract. Semantic retrieval belongs to the governed AI layer, not a client-side shortcut.

Redis is planned for rate limiting, short-lived caching, sessions where appropriate and queue coordination. Background jobs deliver notifications, build analytics aggregates, process safe media work and later perform AI work. Jobs are idempotent, observable, retried safely and do not block core transactional flows.

## API design

All clients use `/api/v1` REST namespaces and the standard response/error envelope. API endpoints enforce validation, authentication, resource authorization, rate limits, pagination/filtering/sorting where needed, structured errors, correlation IDs and audit logging for material actions. OpenAPI/Swagger is the contract for released endpoints; future GraphQL/WebSockets are additive interfaces behind the same permissions and gateway controls.

## Notifications and events

The notification module supports in-app first, with email/push adapters later. Events such as registration, business approval, new offer and moderation outcome create notifications only after recipient preference, consent, feature flag and rate/frequency rules are evaluated.

The analytics pipeline is separate from transactional state:

`User/business action → validated event → governed processing → aggregate/dashboard → permitted AI/recommendation use`

Events use minimal, purpose-limited metadata and do not become a shadow database of personal data.

## Administration and observability

The admin panel is a role-limited command center for users, businesses, approvals, reports, moderation, categories/locations, feature flags and platform analytics. Every privileged action has an audit trail. The system monitors API availability/latency/error rate, worker/queue health, database connections/queries, cache behavior, security events and business/product signals.

Logs are structured, correlation-aware and privacy-minimized. Alerting routes to named owners; dashboards label metric source/freshness and do not expose cross-tenant confidential data.

## Security and privacy by design

Use TLS in transit, verified encryption/access controls at rest, secret-management references, least-privilege infrastructure/database roles, validation, rate limiting, output minimization, tenant isolation, audit logs and tested backups. Privacy controls include minimal collection, explicit purpose, account/preferences management and documented retention/deletion handling. Full requirements live in the Security & Privacy Framework and Security Operations documents.

## Delivery, testing and deployment

The delivery path is:

`Focused change → review → unit/integration/API/UI/security checks → build → controlled deploy → health monitoring → rollback readiness`

Environments are development, staging and production. Docker supports reproducible local/service environments. Production deployment needs environment-managed secrets, migrations applied through a controlled path, health checks, backups/restore evidence, monitoring, alerting and rollback procedures. The current repository foundation is not a production-ready deployment claim until those checks run successfully.

## Scaling path

| Stage | Design approach |
| --- | --- |
| MVP | Single modular API, managed PostgreSQL, object storage boundary, basic monitoring |
| Growth | Redis/queues, read/search optimization, multiple instances/load balancing and stronger operations |
| Regional scale | Country-aware configuration, dedicated search/analytics/notification workloads and selective service extraction |
| Platform scale | Independent services only for proven bounded domains such as search, analytics, notifications, payments or recommendations |

## AI evolution

AI grows through the AI Gateway: grounded search, transparent recommendations, user assistant, business assistance and finally permissioned agents. Retrieval, model/version evaluation, privacy, access controls, cost limits, human confirmation and auditability are prerequisites. Models are interchangeable providers; no module connects directly to a provider.

## Success criteria

The system is successful when core flows are fast enough for useful local discovery, secure enough for trust, stable/observable enough for operations, modular enough for sustained development and scalable through measured changes rather than premature distribution.

## Final design principle

Build the smallest system that solves a real local problem well, while keeping the boundaries, data contracts and operations needed for Balkan.works to grow responsibly.
