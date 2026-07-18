# Balkan.works Master Implementation Order

## Purpose

Define the ordered build path from an empty project to a functional super-app foundation ready for sustainable growth. The order protects the Core Platform while allowing future modules to attach through stable contracts.

## Build principle

Do not build all modules at once. Build the shared identity, trust, business and discovery core that every later product needs. Never mark a phase complete until code, migrations, tests, documentation and deployment/operational evidence satisfy its release gate.

`Foundation → identity → business network → offers → discovery → engagement → monetization → specialized modules → intelligence → financial layer`

## Phase 0 — Project foundation

**Goal:** establish the modular technical baseline.

Build the monorepo, web/mobile/admin shells, NestJS API foundation, PostgreSQL/Prisma schema/migration workflow, environment/secrets model, shared UI/types/config packages, Docker/local development path, CI/CD design and baseline observability/testing.

**Gate:** project builds/runs in its declared environment, schema migration path works, environment configuration is documented and a controlled deployment plan exists. The current repository foundation is not treated as a live deployment until these checks are actually run/verified.

## Phase 1 — Balkan ID

**Goal:** one identity for the ecosystem.

Build secure registration, login/logout, session/refresh management, user profile, roles/resource permissions, password recovery/email verification readiness and audit/security events. Core data: users, profiles, sessions and roles/permissions.

**Gate:** authentication, ownership/role tests, rate/abuse controls, privacy settings, audit records and admin-access protection are verified.

## Phase 2 — Business network

**Goal:** create accurate, trusted local business supply.

Build business profiles/memberships, categories, country/city/location, authorized images/contact/hours, profile quality, pending/approval/verification lifecycle and business onboarding. Core data: businesses, business members/locations, categories, locations/files.

**Gate:** tenant isolation, moderation/approval, public visibility, data quality and business onboarding/support flow are proven.

## Phase 3 — Offers engine

**Goal:** create a daily reason to discover the platform.

Businesses create current offers; users view, save/share eligible offers. Build validity/status/expiry, business ownership, moderation, favorites, event tracking and factual offer activity. Core data: offers, favorites, campaigns/flyer foundations where required.

**Gate:** offers are current/accurate, expired/hidden content is protected, users can find/save useful offers and businesses can see first-value signals.

## Phase 4 — Discovery engine

**Goal:** make local value easy to find.

Build global/local search, category/location filters, pagination, useful ranking, manual location selection and map-ready geographic contracts. Start with PostgreSQL/full-text/structured search; add specialized search only when evidence requires it.

**Gate:** search success, data freshness, filter correctness, permission/privacy behavior and performance are measured in the pilot city.

## Phase 5 — Digital Flyers

**Goal:** introduce the first specialized business marketing module.

Businesses create eligible flyers/campaign content, promote where allowed and see measured results. Add content/media governance, campaign analytics, clear sponsored labels and promotion entitlements.

**Gate:** business onboarding/offer data are strong, pricing/entitlement/support rules exist and promotions do not compromise organic relevance/trust.

## Phase 6 — Rewards system

**Goal:** encourage valuable return behavior, not empty engagement.

Build a future-ready reward account, points/activity rules, audit/reversal path, user visibility and anti-abuse controls. Activate rewards only after their economics, terms, data/privacy and support operations are ready.

**Gate:** value-producing behavior, transparent rules, fraud controls and ledger/reconciliation design are verified.

## Phase 7 — Save Food integration

**Goal:** add the first specialized sustainability/service module.

Build food packages, availability, reservations, pickup workflow and business/customer support through shared Balkan ID, location, offers, notifications and rewards contracts. External sacuvaj-hranu.rs connection happens only when separately authorized and technically/legal/operationally ready.

**Gate:** merchant policy, food/reservation operations, pickup/incident support, privacy and transaction readiness are verified.

## Phase 8 — Business platform / Opsnestone

**Goal:** make Balkan.works a practical tool for businesses.

Incrementally introduce CRM/customers, tasks, inventory/invoices/reports and approved automation through an Opsnestone integration/service boundary. Keep every business tenant isolated; consumer/discovery modules use contracts/events rather than direct accounting data access.

**Gate:** tenant model, data ownership, integration/API contracts, support, security and business value evidence are ready.

## Phase 9 — Analytics platform

**Goal:** turn governed data into actionable insight.

Build event quality, aggregate dashboards, business analytics, product/market insights and KPI definitions. Add warehouse/queues/feature layer only as workload warrants.

**Gate:** metrics are reproducible, tenant-isolated, privacy-safe and tied to product/business decisions.

## Phase 10 — Marketplace

**Goal:** open a selected local commerce network.

Build products/sellers, ordering, reservations, fulfillment/delivery policy, buyer/seller support, moderation and later provider-backed payments. This is not part of the Core MVP.

**Gate:** transaction lifecycle, consumer/seller terms, payment/refund/dispute handling, fraud/security, support and reconciliation are ready.

## Phase 11 — AI layer

**Goal:** add intelligence that improves real outcomes.

Sequence: grounded AI search → recommendations → user/business assistance → permissioned agents. All AI routes through the AI Gateway with retrieval/provenance, evaluation, privacy, cost controls, access/tool policy, audit and human confirmation for consequential actions.

**Gate:** quality data, measured lift over baseline, safety/grounding, monitoring and user/business controls are proven.

## Phase 12 — Wallet and payments

**Goal:** introduce the financial layer only when the network and controls justify it.

Use regulated/approved payment providers and build wallets/rewards/transaction records only with sufficient users/transactions/partners, legal/compliance review, security, ledger/reconciliation, fraud prevention and support readiness. Never build a proprietary payment system as an MVP shortcut.

## Module delivery rule

Every module delivers:

- Database model and reviewed migration.
- Versioned API, DTO validation, resource permissions and structured errors.
- Shared/reusable UI screens/components, loading/error/empty states.
- Unit/integration/API/UI/E2E tests appropriate to risk.
- Events/metrics, monitoring, audit/security/privacy and support impact.
- Documentation, feature flag, rollout/rollback and release evidence.

## Feature flags and releases

Large capabilities are feature-flagged, for example `MODULE_SAVE_FOOD`, `MODULE_MARKETPLACE`, `MODULE_WALLET` and `AI_ASSISTANT`. Release through internal alpha, controlled beta, one-city public launch and evidence-based expansion. Flags are permissioned, auditable and removed after a stable decision to avoid permanent dead paths.

## First public version

Consumer: account, location, businesses, offers/digital-flyer foundation, search and saved items where released.  
Business: profile, current offers and basic factual activity insight.  
Admin: approval, moderation, taxonomy and system controls.

## What not to do

Do not launch 100 modules, a broad marketplace, a proprietary payment system or autonomous AI before the Core local loop is stable. Stability, trust, data quality and business/user value are prerequisites for speed.

## Success condition

The first version works when people return because it gives useful local value and businesses remain active because they see a real, measured reason to participate.

## Final command

Build Balkan.works in phases. Never sacrifice stability, trust or evidence for apparent speed. Create the foundation for a regional super app.
