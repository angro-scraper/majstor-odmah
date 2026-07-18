# Balkan.works Task Board

## Project status

**Status: starting development.**

Task states are `BACKLOG`, `IN PROGRESS`, `REVIEW` and `DONE`. A task is `DONE` only when its acceptance criteria are met and a proportionate verification step has succeeded.

## Current batch — Foundation and data model

| ID | Priority | Task | Status | Evidence |
| --- | --- | --- | --- | --- |
| BW-001 | Critical | Create project foundation | DONE | Modular monorepo: `apps/`, `services/`, `packages/database/`, `docs/`, `infrastructure/` |
| BW-002 | Critical | Git, README and base documentation | DONE | Repository, root README, root ignore rules and project documentation exist |
| BW-003 | High | Docker configuration | REVIEW | Compose now defines PostgreSQL, Redis, MinIO, API and web services; runtime build is pending dependency installation and local Docker validation |
| BW-010 | Critical | Prisma setup | DONE | Prisma package and executable PostgreSQL schema exist in `packages/database/prisma/schema.prisma` |
| BW-011 | Critical | Core models | DONE | User, Business, Category, Service and Review models plus their relations exist in the Prisma schema |

The requested `frontend/`, `backend/` and `database/` concerns are intentionally implemented as `apps/web`, `services/api` and `packages/database`, following the established monorepo architecture. No duplicate folder tree is created solely to satisfy naming.

## Next batch

1. **BW-012 — Migration system:** create and validate the first reviewed Prisma migration against a local PostgreSQL instance.
2. **BW-013 — Seed data:** add idempotent roles, an admin, a test user and demo businesses.
3. **BW-020 to BW-023 — Auth:** add endpoint-level automated tests, JWT protection verification and seeded role assignment.
4. **BW-030 / BW-031 — User experience:** verify profile API and favorites against the migrated database.
5. **BW-040 / BW-041 — Business platform:** validate create/edit/profile flows, including services, locations and images.

## MVP exit condition

The first MVP is ready for a controlled beta only when the complete loop is verified against a real local or staging database:

`Registration → Login → Search → Business profile → Contact → Review`

## Working rule

Work on one batch of one to five related tasks. After each batch, record what changed, what was tested, what remains blocked and the next highest-value tasks.
