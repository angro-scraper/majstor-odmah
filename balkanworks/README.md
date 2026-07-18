# Balkan.works Monorepo

Target TypeScript foundation for the Balkan.works platform. It is intentionally staged beside the existing live Core until a reviewed migration plan is approved; no production service or data is replaced by this scaffold.

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

## Master prompt

The preserved architect/developer directive is in [BALKAN_WORKS_CODEX_MASTER_PROMPT.md](docs/BALKAN_WORKS_CODEX_MASTER_PROMPT.md).

## API contract

The versioned REST response, security and compatibility contract is in [BALKAN_WORKS_API_CONTRACT.md](docs/BALKAN_WORKS_API_CONTRACT.md).

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

## Team roles

Role-level responsibilities and hiring sequence are in [BALKAN_WORKS_TEAM_ROLES.md](docs/BALKAN_WORKS_TEAM_ROLES.md).

## Analytics

Event taxonomy, dashboards and experimentation rules are in [BALKAN_WORKS_ANALYTICS_DATA_STRATEGY.md](docs/BALKAN_WORKS_ANALYTICS_DATA_STRATEGY.md).
