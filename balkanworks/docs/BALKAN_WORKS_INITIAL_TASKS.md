# Balkan.works Initial Development Tasks

## Purpose

This is the first delivery-cycle register from project foundation to a functional MVP. It keeps the intended order while recording the current repository evidence honestly.

## Status legend

- **DONE** — implementation and its local source artifacts exist.
- **REVIEW** — code/configuration exists but needs runtime, database or end-to-end verification.
- **PARTIAL** — only part of the task exists; the remaining scope is stated.
- **BACKLOG** — not yet implemented.

## Delivery order

`Foundation → database → backend → frontend → testing → deployment`

The canonical folders are `apps/`, `services/`, `packages/`, `docs/` and `infrastructure/`. They fulfil the intended frontend, backend, database, documentation and infrastructure boundaries without a duplicate directory tree.

## Phase 1 — Project foundation

| ID | Task | Status | Current evidence / next action |
| --- | --- | --- | --- |
| 001 | Create repository | DONE | Git repository and active `main` exist. |
| 002 | Create project structure | DONE | Canonical monorepo structure is documented and present. |
| 003 | Configure Git workflow | PARTIAL | `main` is active; branch/review policy is documented. Adopt `develop` only if the team chooses a permanent GitFlow workflow. |
| 004 | Add README and structure documentation | DONE | Root README and Project Structure documents exist. |

## Phase 2 — Database setup

| ID | Task | Status | Current evidence / next action |
| --- | --- | --- | --- |
| 005 | PostgreSQL environment | REVIEW | Local Docker Compose defines PostgreSQL; runtime Docker validation has not run in this environment. |
| 006 | Connect Prisma ORM | DONE | `@balkanworks/database` contains Prisma client configuration. |
| 007 | Add `schema.prisma` | DONE | PostgreSQL schema includes core MVP models, relations and indexes. |
| 008 | Create first migration | REVIEW | Baseline SQL migration was generated from the validated Prisma schema; apply it against a disposable PostgreSQL database and inspect migration history. |
| 009 | Add seed data | REVIEW | Idempotent roles, locations, categories, development users and demo businesses are ready in `prisma/seed.js`; run after migration. |

## Phase 3 — Backend foundation

| ID | Task | Status | Current evidence / next action |
| --- | --- | --- | --- |
| 010 | Create NestJS project | DONE | NestJS API application exists under `services/api`. |
| 011 | TypeScript, environment and Prisma connection | REVIEW | TypeScript and environment configuration exist; connection needs the first migrated database. |
| 012 | Global error handler | DONE | Global Nest exception filter now returns a safe consistent error envelope and logs server failures. |
| 013 | API documentation | PARTIAL | Versioned API specifications exist; interactive OpenAPI generation is not configured. |

## Phase 4 — Authentication

| ID | Task | Status | Current evidence / next action |
| --- | --- | --- | --- |
| 014 | User model integration | DONE | User, Profile, session and role schema relationships exist. |
| 015 | Register endpoint | REVIEW | `POST /api/v1/auth/register` is implemented; verify against migrated PostgreSQL. |
| 016 | Login endpoint | REVIEW | `POST /api/v1/auth/login` is implemented; verify token/session behavior. |
| 017 | Password hashing | DONE | Auth implementation uses bcrypt. |
| 018 | Role permissions | PARTIAL | RBAC schema and guards exist; seed roles and permission tests remain. |

## Phase 5 — Business module

| ID | Task | Status | Current evidence / next action |
| --- | --- | --- | --- |
| 019 | Create business module | DONE | NestJS Businesses module exists. |
| 020 | Create business | REVIEW | Protected create endpoint and DTO exist; verify persistence. |
| 021 | Get business | REVIEW | Public verified-business detail endpoint exists; verify against data. |
| 022 | Update business | REVIEW | Ownership-protected update endpoint exists; verify authorization and persistence. |
| 023 | Validate business data | DONE | DTO validation and global validation pipe exist. |

## Phase 6 — Search system

| ID | Task | Status | Current evidence / next action |
| --- | --- | --- | --- |
| 024 | Create search endpoint | REVIEW | `GET /api/v1/search` is implemented; needs migrated data. |
| 025 | Query/category/location filters | REVIEW | Query, category and city filters are implemented; verify result quality. |
| 026 | Optimize database queries | PARTIAL | Schema indexes and bounded results exist; validate with realistic data and query plans. |

## Phase 7 — Reviews system

| ID | Task | Status | Current evidence / next action |
| --- | --- | --- | --- |
| 027 | Create Review module | DONE | NestJS Reviews module exists. |
| 028 | Create review | REVIEW | Authenticated creation requires a prior contact event; verify against database. |
| 029 | Get reviews | REVIEW | Business review listing endpoint exists; verify status filtering and aggregates. |
| 030 | Add moderation | PARTIAL | Admin review-status actions exist; reports and moderation UI remain. |

## Phase 8–11 — Frontend, customer, business and admin apps

| IDs | Scope | Status | Current evidence / next action |
| --- | --- | --- | --- |
| 031 | Next.js project | DONE | `apps/web` Next.js app exists. |
| 032 | Tailwind, UI components and routing | BACKLOG | Current web app has basic CSS and a demo page; add Tailwind and shared UI primitives deliberately. |
| 033–034 | Layout and Home | PARTIAL | Root layout and discovery demo exist; connect to API and replace demo data. |
| 035–040 | Search, results, profile, contact, favorites, reviews UI | BACKLOG | Backend foundations exist; build real user-facing routes and states. |
| 041–043 | Business onboarding, edit profile, analytics dashboard | BACKLOG | Build after customer discovery routes are connected. |
| 044–047 | Admin login, moderation, user management, reports | PARTIAL | Admin API actions exist; dedicated admin UI, reports and full workflow remain. |

## Phase 12–14 — Analytics, testing and deployment

| IDs | Scope | Status | Current evidence / next action |
| --- | --- | --- | --- |
| 048 | Event tracking | PARTIAL | Search, view and contact-related persistence exists; standard event contract and coverage remain. |
| 049 | Basic dashboard | PARTIAL | Admin overview API exists; dashboard UI and validated metrics remain. |
| 050 | Test auth, permissions, API and UI flows | BACKLOG | Add unit, integration and end-to-end suites after dependencies and database are available. |
| 051 | Docker setup | REVIEW | Compose and API/web Dockerfiles exist; application builds pass, but Docker CLI is unavailable in this workspace for a build/run check. |
| 052 | CI/CD pipeline | BACKLOG | Add after tests and migration verification exist. |
| 053 | Production environment | BACKLOG | Requires hosting, secrets, backup and release authority. |
| 054 | Monitoring | BACKLOG | Define error, uptime and business-event observability before production. |

## MVP definition of done

The MVP is complete only when a real environment verifies:

- user registration and login;
- business search and profile viewing;
- business profile creation and management;
- customer contact and review flow;
- admin content control;
- measurable core activity;
- security, permissions, tests and a reproducible deployment path.

## Immediate next batch

1. Task 008: initial reviewed Prisma migration.
2. Task 009: idempotent seed data and role bootstrap.
3. Tasks 015–016/020–022/024–025/028–029: database-backed API verification.
4. Task 012: standard error envelope and exception handling.
5. Task 050: focused automated tests for the completed backend flows.

AI search, recommendations, marketplace, payments, mobile applications and regional expansion start only after the core MVP loop is proven.
