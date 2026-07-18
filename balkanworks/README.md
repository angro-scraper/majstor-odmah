# Balkan.works

Digitalna platforma za povezivanje ljudi i lokalnih biznisa. Balkan.works pomaže korisnicima da pronađu pouzdane firme, usluge i proizvode u svojoj blizini, dok firmama daje kanal za vidljivost, kontakte i buduću poslovnu inteligenciju.

This is the target TypeScript monorepo foundation. It is intentionally staged beside the existing live Core until a reviewed migration plan is approved; no production service or data is replaced by this scaffold.

## Vision

Build the leading digital infrastructure for the local economy of the Balkans: a trusted discovery network that evolves into an AI-assisted local-services platform.

## MVP goal

The first validated release enables a user to:

1. find a relevant business;
2. inspect its business profile;
3. contact the business;
4. leave a review after a valid interaction.

It also enables a business owner to create and maintain a profile, and gives the platform enough event data to measure discovery and successful connections.

## Technology stack

| Layer | Technology |
| --- | --- |
| Web frontend | Next.js, React and TypeScript |
| API backend | NestJS, Node.js and TypeScript |
| Primary database | PostgreSQL and Prisma ORM |
| Platform infrastructure | Docker, object-storage adapter, monitoring and CI/CD templates |

## Project source of truth

[BALKAN_WORKS_MASTER_DOCUMENT.md](docs/BALKAN_WORKS_MASTER_DOCUMENT.md) defines the project direction and document hierarchy. The Master Roadmap controls delivery priority; the MVP PRD controls MVP acceptance.

## Project structure

- `apps/` — mobile, consumer web and admin clients (frontend concerns)
- `services/api/` — NestJS modular API (backend concern)
- `packages/database/` — Prisma schema and database package
- `packages/` — shared UI, config, types and utilities
- `docs/` — product, technical and operating documentation
- `infrastructure/` — local Docker and deployment templates

This is the canonical equivalent of a `frontend/`, `backend/`, `database/`, `docs/`, `infrastructure/` layout. Do not create a parallel folder tree with duplicate application code.

## Setup

Requirements: Node.js 20+, pnpm 9+, PostgreSQL and Git. Docker is optional for the local container stack.

```bash
pnpm install
cp .env.example .env
# Start PostgreSQL, Redis and object storage, then create/apply the reviewed Prisma migration.
pnpm --filter @balkanworks/database prisma:migrate
pnpm --filter @balkanworks/database prisma:seed
pnpm dev
```

On Windows PowerShell, replace the copy command with `Copy-Item .env.example .env`. The seed creates local-only demo accounts and must run only against a disposable development database. Do not commit `.env` or development secrets.

For the local container stack, run `docker compose -f infrastructure/docker/docker-compose.yml up --build`. It defines PostgreSQL, Redis, MinIO, the NestJS API and the Next.js app. The initial Prisma migration must be created and applied before the API can use database-backed flows; development-only Docker secrets must never be used outside local development.

No secret belongs in source control. MVP flags keep Wallet, Marketplace and AI disabled by default.

## Development order

1. Foundation: repository, environment, database and authentication.
2. Business network: businesses, categories, locations and business profiles.
3. Discovery: search and filters.
4. Trust: reviews, verification and moderation.
5. Measurement: events, analytics and operational dashboards.

Every change follows `branch → develop → test → review → merge` and must preserve input validation, authorization, clear errors and documented API/database behavior.

## Future modules

AI Search, AI Assistant, Marketplace, Payments, mobile applications and regional expansion are planned extension points. They remain disabled or unimplemented until the core discovery loop is validated.

## Task board

The live first-batch status, evidence and next delivery group are in [BALKAN_WORKS_TASK_BOARD.md](docs/BALKAN_WORKS_TASK_BOARD.md).

The detailed 001–054 delivery register and current implementation status are in [BALKAN_WORKS_INITIAL_TASKS.md](docs/BALKAN_WORKS_INITIAL_TASKS.md).

## AI strategy

The planned AI layer is permissioned, grounded in approved platform data and controlled by the user or business owner. See [BALKAN_WORKS_AI_STRATEGY.md](docs/BALKAN_WORKS_AI_STRATEGY.md). Model keys and external integrations are intentionally not configured in this repository.

## Partnership strategy

Partner acquisition and future integrations follow [BALKAN_WORKS_PARTNERSHIP_STRATEGY.md](docs/BALKAN_WORKS_PARTNERSHIP_STRATEGY.md). Partner outreach, contracts and access credentials are never automated from source code.

## Team structure

The phased operating and hiring model is in [BALKAN_WORKS_TEAM_STRUCTURE.md](docs/BALKAN_WORKS_TEAM_STRUCTURE.md).

## Technology standard

The stack, security baseline and scaling decisions are in [BALKAN_WORKS_TECH_STACK.md](docs/BALKAN_WORKS_TECH_STACK.md).

## Product module map

The Core-to-module model and feature-flag lifecycle are in [BALKAN_WORKS_PRODUCT_MODULE_MAP.md](docs/BALKAN_WORKS_PRODUCT_MODULE_MAP.md).

## Data strategy

Event governance, analytics boundaries and privacy principles are in [BALKAN_WORKS_DATA_STRATEGY.md](docs/BALKAN_WORKS_DATA_STRATEGY.md).

## City expansion

The city-by-city network and launch gates are in [BALKAN_WORKS_LOCAL_CITY_EXPANSION_PLAN.md](docs/BALKAN_WORKS_LOCAL_CITY_EXPANSION_PLAN.md).

## Design language

The platform-wide visual and component rules are in [BALKAN_WORKS_DESIGN_LANGUAGE.md](docs/BALKAN_WORKS_DESIGN_LANGUAGE.md).

## User experience

The canonical consumer and business journey is in [BALKAN_WORKS_USER_EXPERIENCE_FLOW.md](docs/BALKAN_WORKS_USER_EXPERIENCE_FLOW.md).

The detailed consumer and business value, trust and referral journeys are in [BALKAN_WORKS_CUSTOMER_JOURNEY_MAP.md](docs/BALKAN_WORKS_CUSTOMER_JOURNEY_MAP.md).

The implementation-level MVP flows for customers, business owners and admins are in [BALKAN_WORKS_USER_FLOWS.md](docs/BALKAN_WORKS_USER_FLOWS.md).

## Build instructions

The compact product identity, implementation priorities, MVP boundaries and decision rules are in [BALKAN_WORKS_CODEX_PROJECT_CONTEXT.md](docs/BALKAN_WORKS_CODEX_PROJECT_CONTEXT.md).

The implementation order and non-negotiable coding rules are in [BALKAN_WORKS_CODEX_BUILD_INSTRUCTIONS.md](docs/BALKAN_WORKS_CODEX_BUILD_INSTRUCTIONS.md).

The consolidated implementation brief and current delivery boundary are in [BALKAN_WORKS_CODEX_MASTER.md](docs/BALKAN_WORKS_CODEX_MASTER.md).

The next-cycle implementation order, quality gates and verified handoff rules are in [BALKAN_WORKS_CODEX_START_PROMPT.md](docs/BALKAN_WORKS_CODEX_START_PROMPT.md).

The mandatory engineering, review and release rules for AI-assisted work are in [BALKAN_WORKS_CODEX_AUTOMATION_RULES.md](docs/BALKAN_WORKS_CODEX_AUTOMATION_RULES.md).

## Security and privacy

Platform security, tenant isolation and privacy controls are governed by [BALKAN_WORKS_SECURITY_AND_PRIVACY.md](docs/BALKAN_WORKS_SECURITY_AND_PRIVACY.md).

## Monetization

The phased revenue model and consumer/business guardrails are in [BALKAN_WORKS_MONETIZATION_MODEL.md](docs/BALKAN_WORKS_MONETIZATION_MODEL.md).

## Launch plan

The Foundation-to-pilot-to-public launch operating plan is in [BALKAN_WORKS_LAUNCH_PLAN.md](docs/BALKAN_WORKS_LAUNCH_PLAN.md).

## Investor narrative

The evidence-first investor narrative draft is in [BALKAN_WORKS_INVESTOR_READY.md](docs/BALKAN_WORKS_INVESTOR_READY.md).

## Ten-year vision

The long-horizon strategic direction is in [BALKAN_WORKS_10_YEAR_VISION.md](docs/BALKAN_WORKS_10_YEAR_VISION.md).

## Master roadmap

The single source of prioritization across phases is [BALKAN_WORKS_MASTER_ROADMAP.md](docs/BALKAN_WORKS_MASTER_ROADMAP.md).

## Final system blueprint

The high-level map of the complete ecosystem is [BALKAN_WORKS_FINAL_SYSTEM_BLUEPRINT.md](docs/BALKAN_WORKS_FINAL_SYSTEM_BLUEPRINT.md).

## Core database

The MVP data model and migration rules are in [BALKAN_WORKS_MVP_DATABASE_SCHEMA.md](docs/BALKAN_WORKS_MVP_DATABASE_SCHEMA.md). The executable schema is in `packages/database/prisma/schema.prisma`.

The Core-to-future database domain map is in [BALKAN_WORKS_DATABASE_SCHEMA.md](docs/BALKAN_WORKS_DATABASE_SCHEMA.md).

The production-target mapping, migration gates and future data-model boundaries are in [BALKAN_WORKS_DATABASE_SCHEMA_FINAL.md](docs/BALKAN_WORKS_DATABASE_SCHEMA_FINAL.md).

## Master prompt

The preserved architect/developer directive is in [BALKAN_WORKS_CODEX_MASTER_PROMPT.md](docs/BALKAN_WORKS_CODEX_MASTER_PROMPT.md).

## API contract

The versioned REST response, security and compatibility contract is in [BALKAN_WORKS_API_CONTRACT.md](docs/BALKAN_WORKS_API_CONTRACT.md).

The endpoint/resource catalog is in [BALKAN_WORKS_API_SPECIFICATION.md](docs/BALKAN_WORKS_API_SPECIFICATION.md).

## Deployment architecture

Environment, release, monitoring and scale rules are in [BALKAN_WORKS_DEPLOYMENT_ARCHITECTURE.md](docs/BALKAN_WORKS_DEPLOYMENT_ARCHITECTURE.md).

## Testing

The quality and release testing standard is in [BALKAN_WORKS_TESTING_STRATEGY.md](docs/BALKAN_WORKS_TESTING_STRATEGY.md).

## Go-to-market

The one-city supply-first market-entry playbook is in [BALKAN_WORKS_GO_TO_MARKET_STRATEGY.md](docs/BALKAN_WORKS_GO_TO_MARKET_STRATEGY.md).

The city-to-regional expansion gates, localization and replication system are in [BALKAN_WORKS_EXPANSION_STRATEGY.md](docs/BALKAN_WORKS_EXPANSION_STRATEGY.md).

## MVP requirements

The MVP scope and acceptance criteria are in [BALKAN_WORKS_PRODUCT_REQUIREMENTS_DOCUMENT.md](docs/BALKAN_WORKS_PRODUCT_REQUIREMENTS_DOCUMENT.md).

## UI/UX system

The interaction, navigation and component-state standard is in [BALKAN_WORKS_UI_UX_SYSTEM.md](docs/BALKAN_WORKS_UI_UX_SYSTEM.md).

The visual foundation, reusable component rules, responsive behavior and accessibility baseline are in [BALKAN_WORKS_UI_DESIGN_SYSTEM.md](docs/BALKAN_WORKS_UI_DESIGN_SYSTEM.md).

The implemented Super App route map and reusable component inventory are in [BALKAN_WORKS_SUPER_APP_WIREFRAMES.md](docs/BALKAN_WORKS_SUPER_APP_WIREFRAMES.md).

The shared visual token contract, dark-mode behavior and component-state baseline are in [BALKAN_WORKS_DESIGN_TOKENS.md](docs/BALKAN_WORKS_DESIGN_TOKENS.md).

## DevOps operations

The CI/CD and operational reliability model is in [BALKAN_WORKS_DEVOPS_INFRASTRUCTURE.md](docs/BALKAN_WORKS_DEVOPS_INFRASTRUCTURE.md).

Local Docker development uses `infrastructure/docker/docker-compose.yml`. It starts PostgreSQL, Redis, MinIO, the NestJS API and the Next.js web app. The API applies committed Prisma migrations before starting; provide non-default secrets through the environment before any shared or production deployment.

## Backend implementation

The ordered NestJS Core implementation plan is in [BALKAN_WORKS_BACKEND_IMPLEMENTATION_PLAN.md](docs/BALKAN_WORKS_BACKEND_IMPLEMENTATION_PLAN.md).

## Frontend implementation

The mobile/web/business/admin delivery plan is in [BALKAN_WORKS_FRONTEND_IMPLEMENTATION_PLAN.md](docs/BALKAN_WORKS_FRONTEND_IMPLEMENTATION_PLAN.md).

## Mobile application

The React Native product and release specification is in [BALKAN_WORKS_MOBILE_APP_SPEC.md](docs/BALKAN_WORKS_MOBILE_APP_SPEC.md).

## Admin panel

The control, moderation and administrative RBAC requirements are in [BALKAN_WORKS_ADMIN_PANEL_SPEC.md](docs/BALKAN_WORKS_ADMIN_PANEL_SPEC.md).

## Brand guidelines

The voice, positioning and visual communication rules are in [BALKAN_WORKS_BRAND_GUIDELINES.md](docs/BALKAN_WORKS_BRAND_GUIDELINES.md).

## Legal framework

The product/legal readiness checklist is in [BALKAN_WORKS_LEGAL_FRAMEWORK.md](docs/BALKAN_WORKS_LEGAL_FRAMEWORK.md); qualified legal review is required before launch.

## Risk management

The risk register, early-warning metrics and crisis response process are in [BALKAN_WORKS_RISK_MANAGEMENT.md](docs/BALKAN_WORKS_RISK_MANAGEMENT.md).

## Growth loops

The measurable, local-network growth model is in [BALKAN_WORKS_GROWTH_LOOPS.md](docs/BALKAN_WORKS_GROWTH_LOOPS.md).

## Business onboarding

The business activation, verification, first-value and value-led upgrade flow is in [BALKAN_WORKS_BUSINESS_ONBOARDING_SYSTEM.md](docs/BALKAN_WORKS_BUSINESS_ONBOARDING_SYSTEM.md).

## AI product roadmap

The governed progression from AI search to permissioned assistants and future agents is in [BALKAN_WORKS_AI_PRODUCT_ROADMAP.md](docs/BALKAN_WORKS_AI_PRODUCT_ROADMAP.md).

The time-based AI capability roadmap from data quality through constrained agents is in [BALKAN_WORKS_AI_ROADMAP.md](docs/BALKAN_WORKS_AI_ROADMAP.md).

## API documentation

The REST contract, versioning, security requirements, observability and expansion path are in [BALKAN_WORKS_API_DOCUMENTATION.md](docs/BALKAN_WORKS_API_DOCUMENTATION.md).

The v1 route contract, implementation boundary and feature-gated API plan are in [BALKAN_WORKS_API_SPEC.md](docs/BALKAN_WORKS_API_SPEC.md).

## Sales playbook

The ethical, measurable local-business sales motion is in [BALKAN_WORKS_SALES_PLAYBOOK.md](docs/BALKAN_WORKS_SALES_PLAYBOOK.md).

## Data architecture

The operational, event, analytics and future governed-AI data layers are in [BALKAN_WORKS_DATA_ARCHITECTURE.md](docs/BALKAN_WORKS_DATA_ARCHITECTURE.md).

The database-layer architecture linking operational models, search, trust, analytics and governed AI knowledge is in [BALKAN_WORKS_DATABASE_ARCHITECTURE.md](docs/BALKAN_WORKS_DATABASE_ARCHITECTURE.md).

## Support system

The consumer, business and partner support model is in [BALKAN_WORKS_SUPPORT_SYSTEM.md](docs/BALKAN_WORKS_SUPPORT_SYSTEM.md).

## Security operations

The operational security, incident, recovery and production-verification framework is in [BALKAN_WORKS_SECURITY_OPERATIONS.md](docs/BALKAN_WORKS_SECURITY_OPERATIONS.md).

## Platform operations

The platform-level onboarding, verification, quality, moderation, support, monitoring and scaling standard is in [BALKAN_WORKS_PLATFORM_OPERATIONS_SYSTEM.md](docs/BALKAN_WORKS_PLATFORM_OPERATIONS_SYSTEM.md).

## Financial model

The cost, revenue, unit-economics, scenario and financial-control framework is in [BALKAN_WORKS_FINANCIAL_MODEL.md](docs/BALKAN_WORKS_FINANCIAL_MODEL.md).

## AI technical architecture

The gateway, retrieval, model lifecycle, recommendation and future agent architecture is in [BALKAN_WORKS_AI_TECHNICAL_ARCHITECTURE.md](docs/BALKAN_WORKS_AI_TECHNICAL_ARCHITECTURE.md).

The implementation boundary for intent, semantic discovery, ranking, assistants and governed AI endpoints is in [BALKAN_WORKS_AI_ARCHITECTURE.md](docs/BALKAN_WORKS_AI_ARCHITECTURE.md).

## Test case library

The reusable product, API, security, performance and UAT test cases are in [BALKAN_WORKS_TEST_CASE_LIBRARY.md](docs/BALKAN_WORKS_TEST_CASE_LIBRARY.md).

## Investor data room

The controlled due-diligence structure, evidence pack and sharing protocol are in [BALKAN_WORKS_INVESTOR_DATA_ROOM.md](docs/BALKAN_WORKS_INVESTOR_DATA_ROOM.md).

The milestone-led capital strategy, investor evidence and use-of-funds discipline are in [BALKAN_WORKS_FUNDRAISING_STRATEGY.md](docs/BALKAN_WORKS_FUNDRAISING_STRATEGY.md).

## First 180 days

The outcome-led MVP, pilot, validation and scale-readiness plan is in [BALKAN_WORKS_FIRST_180_DAYS_PLAN.md](docs/BALKAN_WORKS_FIRST_180_DAYS_PLAN.md).

## Monetization and pricing

The phased package, pricing, revenue and commercial-safeguard strategy is in [BALKAN_WORKS_MONETIZATION_PRICING.md](docs/BALKAN_WORKS_MONETIZATION_PRICING.md).

## Codebase structure

The canonical monorepo, application, module and shared-package organization is in [BALKAN_WORKS_CODEBASE_STRUCTURE.md](docs/BALKAN_WORKS_CODEBASE_STRUCTURE.md).

The implementation-facing root, frontend, backend, database, ownership and naming standard is in [BALKAN_WORKS_PROJECT_STRUCTURE.md](docs/BALKAN_WORKS_PROJECT_STRUCTURE.md).

## Security and privacy framework

The security-by-design, privacy, IAM, AI and release-control standards are in [BALKAN_WORKS_SECURITY_PRIVACY_FRAMEWORK.md](docs/BALKAN_WORKS_SECURITY_PRIVACY_FRAMEWORK.md).

The concise prevent–detect–respond–recover operating model is in [BALKAN_WORKS_SECURITY_FRAMEWORK.md](docs/BALKAN_WORKS_SECURITY_FRAMEWORK.md).

## Competitive analysis

The category-level positioning, moat, risks and research agenda are in [BALKAN_WORKS_COMPETITIVE_ANALYSIS.md](docs/BALKAN_WORKS_COMPETITIVE_ANALYSIS.md).

The execution-oriented moat, competitive response and advantage metrics are in [BALKAN_WORKS_COMPETITIVE_STRATEGY.md](docs/BALKAN_WORKS_COMPETITIVE_STRATEGY.md).

## Module roadmap

The dependency-led sequencing of Core, engagement, business, transaction and intelligence modules is in [BALKAN_WORKS_MODULE_ROADMAP.md](docs/BALKAN_WORKS_MODULE_ROADMAP.md).

The time-oriented evolution from local discovery through marketplace and AI is in [BALKAN_WORKS_PRODUCT_ROADMAP.md](docs/BALKAN_WORKS_PRODUCT_ROADMAP.md).

## Execution plan

The operating plan from foundation through MVP, pilot, validation and scale is in [BALKAN_WORKS_EXECUTION_PLAN.md](docs/BALKAN_WORKS_EXECUTION_PLAN.md).

## Founder playbook

The founder decision, operating rhythm and evidence-first leadership system is in [BALKAN_WORKS_FOUNDER_PLAYBOOK.md](docs/BALKAN_WORKS_FOUNDER_PLAYBOOK.md).

## Execution roadmap

The concise phase sequence from MVP through private beta, launch, growth, transactions and AI is in [BALKAN_WORKS_EXECUTION_ROADMAP.md](docs/BALKAN_WORKS_EXECUTION_ROADMAP.md).

## System design

The unified modular-monolith technical design and scaling path is in [BALKAN_WORKS_SYSTEM_DESIGN.md](docs/BALKAN_WORKS_SYSTEM_DESIGN.md).

The system-level application, API, data, infrastructure and AI-layer overview is in [BALKAN_WORKS_SYSTEM_ARCHITECTURE.md](docs/BALKAN_WORKS_SYSTEM_ARCHITECTURE.md).

## First 100 businesses

The one-city field plan for acquiring and activating the first quality business network is in [BALKAN_WORKS_FIRST_100_BUSINESSES_PLAN.md](docs/BALKAN_WORKS_FIRST_100_BUSINESSES_PLAN.md).

## First 10,000 users

The one-city activation, retention, content, referral and partnership plan is in [BALKAN_WORKS_FIRST_10K_USERS_PLAN.md](docs/BALKAN_WORKS_FIRST_10K_USERS_PLAN.md).

## Investor pitch deck

The evidence-first 15-slide investor narrative is in [BALKAN_WORKS_PITCH_DECK.md](docs/BALKAN_WORKS_PITCH_DECK.md).

## KPI dashboard

The North Star, funnel, business-health, revenue and decision-metric definitions are in [BALKAN_WORKS_KPI_DASHBOARD.md](docs/BALKAN_WORKS_KPI_DASHBOARD.md).

The event contract, KPI tree, dashboards and weekly analytics operating rhythm are in [BALKAN_WORKS_METRICS_AND_ANALYTICS.md](docs/BALKAN_WORKS_METRICS_AND_ANALYTICS.md).

## AI and data strategy

The data foundation, AI phases, quality evaluation and governance strategy is in [BALKAN_WORKS_AI_DATA_STRATEGY.md](docs/BALKAN_WORKS_AI_DATA_STRATEGY.md).

## Growth engine

The city-by-city operating system for local supply, content, partners, community and referrals is in [BALKAN_WORKS_GROWTH_ENGINE.md](docs/BALKAN_WORKS_GROWTH_ENGINE.md).

## Operating system

The company-wide daily, weekly, monthly and quarterly decision/execution cadence is in [BALKAN_WORKS_OPERATING_SYSTEM.md](docs/BALKAN_WORKS_OPERATING_SYSTEM.md).

## Master plan

The executive synthesis of vision, phases, GTM, economics, team and North Star is in [BALKAN_WORKS_MASTER_PLAN.md](docs/BALKAN_WORKS_MASTER_PLAN.md).

## Implementation package

The documentation taxonomy, workflow, project-management system and release checklist are in [BALKAN_WORKS_IMPLEMENTATION_PACKAGE.md](docs/BALKAN_WORKS_IMPLEMENTATION_PACKAGE.md).

## Feature backlog

The prioritized P0–P3 feature register and honest implementation status model are in [BALKAN_WORKS_FEATURE_BACKLOG.md](docs/BALKAN_WORKS_FEATURE_BACKLOG.md).

## MVP specification

The canonical V1 scope, flows, data/API direction, launch gate and non-goals are in [BALKAN_WORKS_MVP_SPECIFICATION.md](docs/BALKAN_WORKS_MVP_SPECIFICATION.md).

## Investment pitch

The concise evidence-first investment narrative is in [BALKAN_WORKS_INVESTMENT_PITCH.md](docs/BALKAN_WORKS_INVESTMENT_PITCH.md).

## Master documentation index

The central reading order, source-of-truth hierarchy and live document map are in [BALKAN_WORKS_MASTER_DOCUMENT_INDEX.md](docs/BALKAN_WORKS_MASTER_DOCUMENT_INDEX.md).

## Investor deck structure

The evidence-first 20-slide structure for investors, partners and institutions is in [BALKAN_WORKS_INVESTOR_DECK_STRUCTURE.md](docs/BALKAN_WORKS_INVESTOR_DECK_STRUCTURE.md).

## Master implementation order

The exact phased build order and release gates for the platform are in [MASTER_IMPLEMENTATION_ORDER.md](docs/MASTER_IMPLEMENTATION_ORDER.md).

## Team roles

Role-level responsibilities and hiring sequence are in [BALKAN_WORKS_TEAM_ROLES.md](docs/BALKAN_WORKS_TEAM_ROLES.md).

The phase-based hiring, leadership and regional organization plan is in [BALKAN_WORKS_TEAM_BUILDING_PLAN.md](docs/BALKAN_WORKS_TEAM_BUILDING_PLAN.md).

## Analytics

Event taxonomy, dashboards and experimentation rules are in [BALKAN_WORKS_ANALYTICS_DATA_STRATEGY.md](docs/BALKAN_WORKS_ANALYTICS_DATA_STRATEGY.md).
