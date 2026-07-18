# Balkan.works technology standard

## Current production baseline

- **Web:** Next.js + React + TypeScript.
- **API:** NestJS modular monolith with REST under `/api/v1`.
- **Data:** PostgreSQL + Prisma migrations.
- **Local infrastructure:** Docker Compose with PostgreSQL, Redis and S3-compatible MinIO.
- **Hosting:** Render Starter services with automatic deploys from `main`.
- **Security:** JWT access/refresh tokens, RBAC, input validation, audit logs and encrypted transport through the host.

## Intentional boundaries

The product remains a modular monolith until operational evidence justifies extraction. Search, notifications, analytics and AI are module boundaries today, not premature microservices.

Payments, wallet, partner API access and marketplace transactions are feature-flagged and default to off. They require separate commercial, legal and security readiness before activation.

## Delivery controls

- `GET /api/v1/features` exposes the current public feature configuration.
- Environment variables are the single source of truth for flags.
- GitHub Actions builds the database package, API and web app, and runs API tests on pushes and pull requests.
- Every production database change is a reviewed Prisma migration and Render executes migrations before API startup.
