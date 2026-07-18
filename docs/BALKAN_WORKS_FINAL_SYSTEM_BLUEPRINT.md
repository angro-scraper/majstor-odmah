# Balkan.works Final System Blueprint

## Purpose

This is the high-level technical and business map for product, architecture, partner and investor conversations. It summarizes the system; the Master Roadmap remains the authority for delivery order.

## System model

```text
Consumers / Businesses / Partners
             │
 Web · Mobile · Business Portal · Admin
             │
       Versioned API / Core Platform
             │
 Identity · Users · Businesses · Discovery · Offers · Notifications
             │
 PostgreSQL · Redis · Object Storage · Event/Analytics Layer
             │
 Permissioned AI Gateway · Approved external integrations
```

## Core Platform

- **Balkan ID:** one account, session management, roles, permissions, profile and security settings.
- **User Engine:** preferences, location, consent, saved items and activity history.
- **Business Engine:** profiles, ownership, categories, locations, verification, offers and reputation.
- **Discovery Engine:** search, local discovery, transparent recommendations and navigation.
- **Trust & Operations:** notifications, moderation, audit logs, analytics and support workflows.

## Module layer

| Module | Purpose | Core services consumed |
| --- | --- | --- |
| Offers | Digital offers, visibility and results | Business, discovery, analytics |
| Save Food | Surplus-food discovery and reservation | Identity, location, offers, rewards |
| Digital Flyers | Marketing campaigns and measurement | Business, offers, analytics |
| Opsnestone | Business operations: CRM, inventory, finance/reporting | Business identity, tenant controls, analytics |
| Stock Radar | Market intelligence and educational analytics | Governed market/business data, AI gateway |
| Future Marketplace/Wallet/Travel/Jobs/Events/Learning | Vertical local value | Core contracts and feature flags |

Modules are independently releasable, feature-flagged and permissioned. They communicate through documented APIs/events rather than unrestricted database coupling.

## Data and AI

`user/business action → validated event → controlled data platform → analytics → approved recommendation or insight`

AI is a layer over the system, not a shortcut around it. The AI Gateway enforces consent, data minimization, source grounding, tool permissions, audit logs and human confirmation for actions with impact. It supports personal assistance, business copilot, recommendation and intelligence capabilities as their prerequisites are met.

## API and services

All public APIs are REST-first and versioned under `/api/v1`. Core domain modules include Authentication, Users, Businesses, Offers, Locations, Notifications, Analytics, AI Gateway and future Payment adapters. Each endpoint requires validation, authorization, structured errors, logging and documentation.

## Security and operations

TLS, secure credentials, hashed passwords, short-lived access tokens, revocable sessions, RBAC/MFA for privileged accounts, tenant isolation, audit logs, encrypted backups, monitoring and incident response are baseline system requirements. Payments, financial data and regulated modules require qualified providers and country-specific legal/security review.

## Experience and design

Every app shares the same design tokens, components, navigation patterns and trust elements. The user flow is: open → discover → act → receive value → return. The business flow is: register → create profile → publish offer → gain outcome → improve. The product must feel like one ecosystem even as modules change.

## Scale model

Start with a modular monolith, PostgreSQL, Redis, object storage and one validated city. Add replicas, queues, specialized search or extracted services only for demonstrated scale/reliability requirements. Support multiple cities, countries, languages and currencies through configuration rather than forked products.

## Golden rule

Build a feature only when it increases network value for users, businesses or partners — with a clear problem, owner, data policy, operating model, success metric and rollback path.
