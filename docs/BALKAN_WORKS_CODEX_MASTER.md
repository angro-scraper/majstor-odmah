# Balkan.works — Complete Codex Build Package

## Role and product

Build Balkan.works as a production-oriented, directory-first local platform. The first outcome is simple: a person finds a trusted local business quickly, and that business receives a measurable customer contact.

## MVP contract

| Customer | Business owner | Admin |
| --- | --- | --- |
| registration/login, profile, search, business detail, contact, favorites and eligible reviews | business account, profile, services, basic activity insight and verification request | business review, verification, review moderation and user controls |

The MVP excludes marketplace payments, autonomous AI, complex chat and international expansion. These are future modules, not hidden MVP scope.

## Technical standard

- Next.js, React and TypeScript for web.
- NestJS, Node.js and TypeScript for the API.
- PostgreSQL and Prisma for relational data/migrations.
- Docker/CI/CD/cloud configuration only after a verified local/staging build.
- Modular monolith first; extract services only with measured need.

## Implementation order

1. Workspace, environment and database migration path.
2. Authentication, sessions, roles and profile data.
3. Business, category, location, service and media models.
4. Public search and business details.
5. Contact tracking, favorites, reviews and verification.
6. Business dashboard and admin moderation.
7. Event analytics, testing, security review and controlled city pilot.

## Development rules

- Keep business logic in services, never in frontend components or controllers.
- Require validation, authentication and resource-level authorization for every non-public API action.
- Change database structure through reviewed Prisma migrations only.
- Document API contracts, error behavior, feature flags and event definitions.
- Keep secrets out of source code; use environment/secret management.
- Never claim a feature is deployed or production-ready without a tested build, migration and release evidence.

## Current implementation status

The repository contains the directory-first Prisma model, JWT/auth foundation, user profile API, business CRUD/services/contact events, search, moderated reviews, admin moderation endpoints and a responsive web discovery interface. Dependencies are not installed in this workspace and database migrations are not yet generated or applied; install/validate before operating the service.

## Final command

Prioritize functionality, stability, simplicity and scalability — in that order. Build a real foundation for local discovery, then extend it only when users and businesses prove the next need.
