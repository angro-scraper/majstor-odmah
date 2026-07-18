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
