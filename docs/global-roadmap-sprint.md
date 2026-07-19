# Sprint 16 — Global Balkan.works Roadmap

## How this roadmap is used

This is the execution-level companion to the Master Roadmap. It turns the long-term company vision into a controlled sequence while preserving a hard distinction between **directional targets**, **feature-flagged capabilities** and **live, measured results**.

The admin-only `GET /api/v1/operations/global-roadmap` endpoint is the machine-readable copy. It is intended for internal planning and cannot be used as proof of current adoption, revenue, partnerships or product availability.

## One platform, governed modules

Every current or future product — Balkan.works App, Opsnestone, Sacuvaj-hranu.rs, Stock Radar or Digital Flyers — must use the following shared contracts:

1. **Balkan ID and authorization:** one accountable identity, explicit role/tenant permissions and no cross-business data access.
2. **Business identity and location:** businesses, locations, categories and verification remain canonical platform resources.
3. **Governed data and AI:** modules exchange allow-listed events and documented APIs; AI has scoped data access and requires confirmation for consequential actions.
4. **Rewards, notifications and analytics:** shared only through module-owned interfaces, consent-aware event rules and feature flags.
5. **Security and operations:** a module cannot bypass validation, audit logs, support, monitoring, recovery or compliance controls.

## Directional phases

| Phase | Planning horizon | Outcome to prove | Directional scale target | Release gate |
| --- | --- | --- | --- | --- |
| Foundation | 0–12 months | A dependable local network in one city | 50k users, 1k businesses, 100k offers | Pilot scorecard, quality supply, support, retention and security review |
| Market expansion | 12–24 months | Repeatable multi-city playbook | 500k users, 10k businesses | Local operations, business value, moderation and support prove repeatable |
| Regional platform | 2–3 years | Localized Balkan network | 5m users, 100k businesses | Languages, compliance, country operations and local network quality per market |
| Super app | 3–5 years | Connected life, business and regulated provider layers | 10m users, 500k businesses | Verified value, provider/legal readiness, tenant isolation and operational capacity |
| Digital infrastructure | 5+ years | Secure partner ecosystem | No fixed public target | API governance, contracts, data controls, SLA and partner outcomes |

Numbers are operating targets used for planning; they are not forecasts, commitments or current metrics. The Sprint 15 launch scorecard has its own smaller public-launch thresholds and is the mandatory gate before the first city campaign.

## Module sequencing

- **Foundation:** Balkan ID, business profiles, discovery, offers, Deals, Digital Flyers, Save Food, Rewards and Notifications.
- **Expansion:** Marketplace, Services, Jobs, Events, subscriptions and business analytics only where local support and trust requirements are met.
- **Regional:** country/localization layers, delegated administration and regional partner integrations.
- **Super app:** Opsnestone/CRM/analytics plus Travel, Events and Health behind their own feature, privacy and operational controls.
- **Infrastructure:** partner APIs, integrations, approved aggregate intelligence and enterprise operations.

Finance remains provider-backed. The platform does not custody customer funds, store card numbers or expose Wallet functionality simply because the schema exists. AI remains an assistive layer and cannot perform financial or data-changing actions without human authorization.

## Decision cadence

| Review | Required evidence | Decision |
| --- | --- | --- |
| Sprint | tests, migration/API contract, feature flag, security/privacy impact | ship, hold or remove scope |
| Monthly | activation, retention, supply freshness, support and business outcome | invest, iterate or stop a loop |
| Per city/country | launch scorecard, local owner, legal/compliance, support coverage | open, pause or expand geography |
| Quarterly | unit economics, quality, resilience, partnerships and team capacity | move phase, revise targets or preserve focus |

## Company model and team evolution

The planned business model combines business subscriptions, disclosed promotion, eligible transaction fees, premium AI tools and enterprise contracts. Each revenue source requires its own pricing, accounting, support and legal readiness; prospective contracts are pipeline, never revenue.

The operating team evolves from a focused product/engineering/sales/operations group (5–10 people), through functional growth teams (30–50), to country and partnership teams (100+). Hiring follows demonstrated bottlenecks in customer value, local supply, reliability and compliance—not a calendar target.

## Acceptance condition

The roadmap is successful only when daily users find trustworthy value, businesses obtain measurable outcomes, partners can integrate safely and AI improves the experience within explicit permissions. It is not successful merely because every planned module exists in source code.
