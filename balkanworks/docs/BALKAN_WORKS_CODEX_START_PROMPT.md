# Balkan.works — Codex Start Prompt

## Role

Act as a senior full-stack engineer building a production-oriented, scalable Balkan.works foundation — not a throwaway prototype.

## Product objective

Balkan.works connects people with local businesses. The MVP end-to-end flow is:

```text
User registration → login → search business → business profile → contact → review
```

Customers find businesses, services, reputation and contact paths. Businesses create profiles, present services, receive customer interest and see permitted outcome signals.

## Required stack

- **Web:** Next.js, React and TypeScript; Tailwind may be introduced after its design tokens/build pipeline are installed and validated.
- **API:** NestJS, Node.js and TypeScript.
- **Data:** PostgreSQL and Prisma.
- **Operations:** Docker, Git, environment variables, migration/release controls.

## Required implementation order

1. Inspect the workspace, dependencies and current source of truth.
2. Create/update the implementation plan before structural changes.
3. Establish database models, indexes, migrations and configuration.
4. Implement NestJS foundation: configuration, validation, errors and auth guards.
5. Implement user profiles, business CRUD/services/media, public search, contacts, favorites and moderated reviews.
6. Implement business/admin surfaces and permitted analytics.
7. Build responsive web routes and shared components.
8. Add tests, run migrations/build in staging, then use controlled deployment procedures.

## Architecture rules

Use a modular monolith. Each backend domain has controller, service, DTO/validation and tests. Keep business logic out of controllers and UI. All non-public actions need JWT authentication and resource-level authorization. Role checks, audit logs, environment secrets and safe error handling are mandatory.

The canonical workspace uses `apps/`, `services/`, `packages/`, `infrastructure/` and `docs/`, rather than parallel unconnected frontend/backend folders. Prisma models cover identity, profiles, businesses, categories, locations, services, media, reviews, favorites, events, contacts, subscriptions and future AI embeddings.

## Required web surfaces

- Customer: `/`, search, business detail, favorites and profile.
- Business: dashboard, business profile editing and analytics.
- Admin: overview, businesses and moderation/reports.

The initial implementation should be mobile-first, clean, fast and professional. Shared button, input, card, navigation and modal primitives should be extracted as UI grows.

## Quality gates

- Test registration/login, profile update, business create/update/search and review create/display.
- Generate and review Prisma migrations; never change production data structures ad hoc.
- Run lint, unit/integration tests, web/API build and Prisma validation before release.
- Keep `DATABASE_URL`, JWT secrets and third-party credentials outside source control.
- Do not introduce microservices, marketplace payments, advanced AI or multi-country complexity before the directory-first MVP proves value.

## Current handoff state

The repository already contains the database model, auth foundation, user/business/search/favorites/reviews/admin API modules, responsive web discovery page and workspace configuration. The next execution gate is to install dependencies, start PostgreSQL, generate/review Prisma migrations, run tests/builds, then connect the web UI to the live API and seed admin roles/categories/cities.

## Completion handoff

When a release cycle is complete, report what changed, relevant files, verified commands/results, deployment status and the next safe action. Never claim migrations, tests or deployment succeeded without evidence.
