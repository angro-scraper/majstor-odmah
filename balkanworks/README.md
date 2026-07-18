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
