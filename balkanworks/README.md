# Balkan.works Monorepo

Target TypeScript foundation for the Balkan.works platform. It is intentionally staged beside the existing live Core until a reviewed migration plan is approved; no production service or data is replaced by this scaffold.

## Project source of truth

[BALKAN_WORKS_MASTER_DOCUMENT.md](docs/BALKAN_WORKS_MASTER_DOCUMENT.md) defines the project direction and document hierarchy. The Master Roadmap controls delivery priority; the MVP PRD controls MVP acceptance.

## Layout

- `apps/` — mobile, consumer web and admin clients
- `services/api/` — NestJS modular API
- `packages/` — UI, database, config, types and utilities
- `infrastructure/` — local Docker and deployment templates

## Setup

Install Node.js 20+ and pnpm 9+, then run `pnpm install`, copy `.env.example` to `.env.local`, start PostgreSQL/Redis/Object Storage, run `pnpm --filter @balkanworks/database prisma:migrate`, then `pnpm dev`.

No secret belongs in source control. MVP flags keep Wallet, Marketplace and AI disabled by default.

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

## Build instructions

The implementation order and non-negotiable coding rules are in [BALKAN_WORKS_CODEX_BUILD_INSTRUCTIONS.md](docs/BALKAN_WORKS_CODEX_BUILD_INSTRUCTIONS.md).

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

## MVP requirements

The MVP scope and acceptance criteria are in [BALKAN_WORKS_PRODUCT_REQUIREMENTS_DOCUMENT.md](docs/BALKAN_WORKS_PRODUCT_REQUIREMENTS_DOCUMENT.md).

## UI/UX system

The interaction, navigation and component-state standard is in [BALKAN_WORKS_UI_UX_SYSTEM.md](docs/BALKAN_WORKS_UI_UX_SYSTEM.md).

## DevOps operations

The CI/CD and operational reliability model is in [BALKAN_WORKS_DEVOPS_INFRASTRUCTURE.md](docs/BALKAN_WORKS_DEVOPS_INFRASTRUCTURE.md).

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

## Growth loops

The measurable, local-network growth model is in [BALKAN_WORKS_GROWTH_LOOPS.md](docs/BALKAN_WORKS_GROWTH_LOOPS.md).

## Business onboarding

The business activation, verification, first-value and value-led upgrade flow is in [BALKAN_WORKS_BUSINESS_ONBOARDING_SYSTEM.md](docs/BALKAN_WORKS_BUSINESS_ONBOARDING_SYSTEM.md).

## AI product roadmap

The governed progression from AI search to permissioned assistants and future agents is in [BALKAN_WORKS_AI_PRODUCT_ROADMAP.md](docs/BALKAN_WORKS_AI_PRODUCT_ROADMAP.md).

## API documentation

The REST contract, versioning, security requirements, observability and expansion path are in [BALKAN_WORKS_API_DOCUMENTATION.md](docs/BALKAN_WORKS_API_DOCUMENTATION.md).

## Sales playbook

The ethical, measurable local-business sales motion is in [BALKAN_WORKS_SALES_PLAYBOOK.md](docs/BALKAN_WORKS_SALES_PLAYBOOK.md).

## Data architecture

The operational, event, analytics and future governed-AI data layers are in [BALKAN_WORKS_DATA_ARCHITECTURE.md](docs/BALKAN_WORKS_DATA_ARCHITECTURE.md).

## Support system

The consumer, business and partner support model is in [BALKAN_WORKS_SUPPORT_SYSTEM.md](docs/BALKAN_WORKS_SUPPORT_SYSTEM.md).

## Security operations

The operational security, incident, recovery and production-verification framework is in [BALKAN_WORKS_SECURITY_OPERATIONS.md](docs/BALKAN_WORKS_SECURITY_OPERATIONS.md).

## Financial model

The cost, revenue, unit-economics, scenario and financial-control framework is in [BALKAN_WORKS_FINANCIAL_MODEL.md](docs/BALKAN_WORKS_FINANCIAL_MODEL.md).

## AI technical architecture

The gateway, retrieval, model lifecycle, recommendation and future agent architecture is in [BALKAN_WORKS_AI_TECHNICAL_ARCHITECTURE.md](docs/BALKAN_WORKS_AI_TECHNICAL_ARCHITECTURE.md).

## Test case library

The reusable product, API, security, performance and UAT test cases are in [BALKAN_WORKS_TEST_CASE_LIBRARY.md](docs/BALKAN_WORKS_TEST_CASE_LIBRARY.md).

## Investor data room

The controlled due-diligence structure, evidence pack and sharing protocol are in [BALKAN_WORKS_INVESTOR_DATA_ROOM.md](docs/BALKAN_WORKS_INVESTOR_DATA_ROOM.md).

## First 180 days

The outcome-led MVP, pilot, validation and scale-readiness plan is in [BALKAN_WORKS_FIRST_180_DAYS_PLAN.md](docs/BALKAN_WORKS_FIRST_180_DAYS_PLAN.md).

## Monetization and pricing

The phased package, pricing, revenue and commercial-safeguard strategy is in [BALKAN_WORKS_MONETIZATION_PRICING.md](docs/BALKAN_WORKS_MONETIZATION_PRICING.md).

## Codebase structure

The canonical monorepo, application, module and shared-package organization is in [BALKAN_WORKS_CODEBASE_STRUCTURE.md](docs/BALKAN_WORKS_CODEBASE_STRUCTURE.md).

## Security and privacy framework

The security-by-design, privacy, IAM, AI and release-control standards are in [BALKAN_WORKS_SECURITY_PRIVACY_FRAMEWORK.md](docs/BALKAN_WORKS_SECURITY_PRIVACY_FRAMEWORK.md).

## Competitive analysis

The category-level positioning, moat, risks and research agenda are in [BALKAN_WORKS_COMPETITIVE_ANALYSIS.md](docs/BALKAN_WORKS_COMPETITIVE_ANALYSIS.md).

## Module roadmap

The dependency-led sequencing of Core, engagement, business, transaction and intelligence modules is in [BALKAN_WORKS_MODULE_ROADMAP.md](docs/BALKAN_WORKS_MODULE_ROADMAP.md).

## Execution plan

The operating plan from foundation through MVP, pilot, validation and scale is in [BALKAN_WORKS_EXECUTION_PLAN.md](docs/BALKAN_WORKS_EXECUTION_PLAN.md).

## Founder playbook

The founder decision, operating rhythm and evidence-first leadership system is in [BALKAN_WORKS_FOUNDER_PLAYBOOK.md](docs/BALKAN_WORKS_FOUNDER_PLAYBOOK.md).

## Execution roadmap

The concise phase sequence from MVP through private beta, launch, growth, transactions and AI is in [BALKAN_WORKS_EXECUTION_ROADMAP.md](docs/BALKAN_WORKS_EXECUTION_ROADMAP.md).

## Team roles

Role-level responsibilities and hiring sequence are in [BALKAN_WORKS_TEAM_ROLES.md](docs/BALKAN_WORKS_TEAM_ROLES.md).

## Analytics

Event taxonomy, dashboards and experimentation rules are in [BALKAN_WORKS_ANALYTICS_DATA_STRATEGY.md](docs/BALKAN_WORKS_ANALYTICS_DATA_STRATEGY.md).
