# Balkan.works Codex Build Instructions

## Primary rule

Build a modular platform, not a single-purpose application. Every module must be isolated, documented, scalable and safe to enable or disable.

## Mandatory delivery order

1. Foundation
2. Authentication
3. User System
4. Business System
5. Offers System
6. Location System
7. Notifications
8. Rewards
9. Admin
10. Additional Modules

The first working platform must allow a consumer to register, discover businesses and offers, and use location; a business to create a profile and offers; and an admin to moderate the system.

## Architecture target

The target repository shape is a `balkan-works/` monorepo with `apps/`, `packages/`, `services/` and `docs/`. Its intended clients are React Native mobile, Next.js consumer web, Business Portal and Admin Panel. Shared packages own UI, database, auth, config, types and API client.

The current live Core remains a modular monolith until a separately reviewed migration establishes the target monorepo. No existing deployed service, user data or external project is replaced implicitly.

## Core rules

- PostgreSQL is the system of record; Redis, object storage and search remain supporting systems.
- All location-aware data carries country, city and GPS context.
- Every API module owns controller/router, service, database model, validation, tests and documentation.
- RBAC, validation, rate limiting, audit logs, analytics events and feature flags are foundational concerns.
- Modules communicate through API/event contracts, never direct undocumented coupling.
- New consumer modules must use Balkan ID, shared navigation and the central design system.

## Feature flag policy

Feature flags exist from the beginning. Modules in unfinished or regulated states remain disabled or foundation-only. This includes external connectors, Wallet payments, advanced AI and future marketplace expansion until their dedicated release phase.

## Analytics baseline

The platform tracks `USER_REGISTERED`, `BUSINESS_CREATED`, `OFFER_CREATED`, `OFFER_VIEWED` and `OFFER_SAVED` as baseline events, with no sensitive information in event payloads.

## Explicitly deferred

Do not make Wallet money movement, complex payments, advanced AI, marketplace expansion or microservices the next implementation priority. First validate the Core network: users, businesses, offers, location, notifications, rewards and moderation.

## Module implementation cycle

For each approved module: **Plan → Database → API → UI → Testing → Documentation**.
