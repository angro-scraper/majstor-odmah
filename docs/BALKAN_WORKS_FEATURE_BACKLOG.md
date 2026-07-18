# Balkan.works Feature Backlog

## Purpose

Maintain the central feature list for Balkan.works. Each item has a priority, phase, status, owner/dependency path and release evidence. The backlog is a decision tool, not a promise that every described feature exists.

## Priority system

| Priority | Meaning |
| --- | --- |
| P0 | Critical for the focused MVP/local discovery loop |
| P1 | Needed after MVP to improve engagement, trust or business growth |
| P2 | Advanced capability after proven readiness/dependencies |
| P3 | Future ecosystem/enterprise opportunity |

## Status system

| Status | Meaning |
| --- | --- |
| Planned | Scoped direction exists; implementation has not begun |
| Designed | Product/technical requirements are documented |
| Foundation | Repository/schema/module boundary or UI shell exists, but end-to-end feature is incomplete |
| In development | Actively being built and tested |
| Ready for verification | Implementation awaits required test/deploy/operational evidence |
| Released | Deployed and verified for the declared scope/environment |
| Blocked | Needs an external decision, authority, provider or prerequisite |

Current repository status is assessed honestly: the monorepo and selected API/schema foundations exist, but Node dependencies, migrations, automated tests and production deployment have not been executed/verified in this workspace. No item may be marked Released on documentation alone.

## P0 — MVP features

| Feature | Scope | Status | Release evidence required |
| --- | --- | --- | --- |
| Email registration | Valid email/password account creation and confirmation readiness | Foundation | DTO validation, password handling, migration/API tests and deployed verification flow |
| Login/logout/session | Secure login, access/refresh lifecycle and logout | Foundation | Auth/session tests, rate limits, security review and deployed smoke test |
| Password reset/email confirmation | Recovery/verification flows | Designed | Token policy, delivery provider, abuse controls and end-to-end tests |
| User profile | Name, avatar, preferences and permitted settings | Foundation | Ownership tests, UI/API flow and privacy controls |
| Global search | Search businesses/categories/offers | Designed | Indexed query, pagination/filter tests and useful-result evaluation |
| Search filters | City/location/category filters | Designed | Taxonomy/location data, validation and UI/API tests |
| Business listing/detail | Accurate business name, description, contact/location/media | Foundation | Public visibility/status rules, media policy and discovery tests |
| Business registration/profile management | Create/edit owned business profile | Foundation | Tenant/ownership validation, pending-review lifecycle and UI/API tests |
| Business dashboard | Profile management and basic factual activity insight | Designed | Permissioned analytics definitions and business flow tests |
| Admin user management | Authorized user review/status controls | Designed | RBAC/audit tests and operational UI flow |
| Admin business management | Approval, rejection/suspension and category control | Designed | Moderation policy, audit trail and public visibility tests |
| Moderation | Review business/offers/reports | Designed | Queue/status model, RBAC/audit and support escalation |

## P1 — Growth, trust and engagement

| Feature | Scope | Status | Dependency/gate |
| --- | --- | --- | --- |
| Reviews/ratings | Ratings, comments and moderation | Foundation (schema direction) | Trust policy, anti-abuse and moderation release |
| Reputation | Aggregated ratings/history/verification signals | Planned | Reliable review/verification data and fairness policy |
| Favorites | Save businesses/offers/lists | Foundation (schema direction) | Auth, public eligibility and user ownership tests |
| Offers | Promotions, actions, validity and coupons where appropriate | Foundation (schema direction) | Business ownership, expiry, moderation and discovery tests |
| Notifications | In-app, later email/push | Foundation (schema direction) | Preferences, provider adapters, delivery/abuse controls |
| Business analytics | Views, actions and profile/offer insight | Designed | Valid event taxonomy, tenant isolation and definitions |
| Admin analytics | Growth/activity/system insight | Designed | Governed aggregates and admin access controls |
| Mobile optimization | Responsive/native core local discovery | Foundation (mobile shell) | Device test matrix, secure storage and core-flow QA |
| Location services | Permissioned location/search-nearby | Designed | Consent UX, geospatial policy and fallback/manual choice |

## P2 — Advanced platform capabilities

| Feature | Scope | Status | Dependency/gate |
| --- | --- | --- | --- |
| Premium system | Subscriptions and premium profiles | Designed | Pricing, entitlements, billing/tax/support and legal readiness |
| Payments | Cards/subscriptions/invoices | Planned | Provider, security, compliance, reconciliation and support |
| Marketplace | Orders, reservations and purchase flows | Planned | Seller/consumer rules, payments, operations and moderation |
| Loyalty/rewards | Points, rewards and partner value | Planned | Reward economics, anti-fraud, terms and ledger controls |
| Partner portal | Partner dashboards/metrics | Planned | Partner contracts, data permissions and support model |
| AI search | Natural-language/semantic discovery | Designed | Quality data, gateway, retrieval and evaluation baseline |
| AI recommendations | Personalization and suggestions | Designed | Consent, eligible signals, experiment/quality controls |
| AI assistant | Grounded user help | Designed | Retrieval, safety, confirmation UX and monitoring |

## P3 — Future ecosystem capabilities

| Feature | Scope | Status | Dependency/gate |
| --- | --- | --- | --- |
| Business AI | Marketing/content/analytics assistance | Designed | Tenant isolation, data quality, approval UX and cost controls |
| AI agents | Permissioned automation | Planned | Tool registry, confirmations, audits, human override and incident controls |
| Enterprise platform | Complex organizations/multi-location | Planned | Mature RBAC, contracts, support and integration model |
| Open/partner API | External developer integrations | Designed | Stable versioned API, docs, auth/quotas and partner governance |
| Regional ecosystem | Multi-country network and advanced modules | Planned | Repeatable city/country playbook and localized compliance/operations |

## MVP release checklist

The MVP can move toward release only after P0 flows have verification evidence for registration/login, profile, business creation/approval, discovery/search, business detail, business management/dashboard scope, admin moderation, security/validation, migration/backup readiness, monitoring, support and deployment health. Features not in the deployed MVP remain clearly feature-flagged or unavailable.

## Version direction

| Version direction | Focus |
| --- | --- |
| V1 | Focused Core MVP/local discovery |
| V2 | Trust, engagement, business growth and analytics |
| V3 | Premium/selected transactional capabilities when ready |
| V4 | Governed intelligence platform |

Version labels are planning aids; a release is defined by tested, deployed, monitored scope and changelog evidence.

## Backlog rule

A feature is added only when it solves a real problem, increases network value, supports strategy and has a measurable outcome. Every item includes non-goals, dependencies, security/privacy/operations impact, acceptance criteria, tests, analytics and owner before it enters an active sprint.
