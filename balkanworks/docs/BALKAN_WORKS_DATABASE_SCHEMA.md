# Balkan.works Database Schema

## Source of truth

`packages/database/prisma/schema.prisma` is the executable schema. This document describes the Core model, relationships and future migration boundaries. It does not authorize adding speculative tables to production without product, security and migration review.

## Current Core entities

| Domain | Current Prisma models | Role |
| --- | --- | --- |
| Identity | `User`, `Profile`, `AuthSession`, `Role`, `Permission` and joins | Balkan ID, sessions and RBAC |
| Geography | `Country`, `City`, `BusinessLocation` | Country/city/GPS-ready local discovery |
| Business | `Business`, `Category` | Owner, profile/contact, category and status |
| Offers/trust | `Offer`, `Favorite`, `Review` | Offers, saving and reputation primitives |
| Operations | `Notification`, `File`, `AuditLog` | Communication, storage references and accountability |
| Analytics | `Event`, `SearchQuery` | Validated operational activity and search signals |

All Core tables use UUID identifiers, timestamps and soft-delete where policy requires it. Passwords are stored only as hashes. Relationships and indexes are defined for identity, business/category/status, offers/expiry and time-bound events/searches.

## Core relationship model

```text
User ── Profile / Sessions / Roles / Favorites / Reviews / Events / Searches
  └── Business (owner) ── Locations / Offers / Reviews / Events
Category ── Businesses / Offers
Country ── Cities ── Profiles / Business locations
Offer ── Favorites / Events
```

## Planned schema domains

| Domain | Planned examples | Activation condition |
| --- | --- | --- |
| Business membership | `business_members` with OWNER/MANAGER/EMPLOYEE | Multi-user business workflow and permissions defined |
| Aggregates | daily metrics/materialized reporting | Dashboard volume justifies controlled aggregation |
| Payments/subscriptions | payment attempts, subscriptions, invoices/ledger adapters | Qualified provider, legal/compliance and dispute/refund design |
| AI profiles | consented preferences/insights and vector references | AI data policy, consent and provider controls implemented |
| Marketplace | products, orders, fulfilment | Commerce trust, support and payments ready |
| Wallet | wallets/ledger transactions | Regulated/payment partner and reconciliation controls ready |
| Opsnestone | customers, inventory, invoices, expenses | Tenant isolation and business operating contracts ready |

Future tables are added through isolated, reviewed migrations. Their data never bypasses Core identity, tenant access checks, audit policy or retention requirements.

## Location, language and regional readiness

Countries/cities provide the initial location normalization. Currency is held on commerce/offer values where relevant; language/timezone/local tax configuration belongs to country/city/business configuration as modules require it. Do not duplicate country/city strings across business logic when normalized references are available.

## Security and operations

Use least-privilege database roles, encrypted backup/restore testing, audited production access and migrations promoted local → staging → production. No direct production schema editing, raw password storage or cross-tenant query without ownership/role checks. Analytics and AI data follow minimization, consent and retention rules.

## Index and scale rule

Index proven query paths: identity lookup, city/category/status filtering, offer validity, owner/tenant access and time-bound event/search queries. Re-evaluate indexes with production query evidence; use aggregation, partitioning, replicas or specialized search only when data volume and access patterns justify them.
