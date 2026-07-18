# Balkan.works Database Schema Final

> Production-target schema specification. The executable source is `packages/database/prisma/schema.prisma`. This document does not mean that a production migration has been generated, reviewed, tested or deployed.

## Purpose

Define the initial production data target for users, businesses, discovery, reviews, verification, analytics and a future governed AI layer.

## Engine and principles

- **Primary database:** PostgreSQL.
- **ORM and migration tool:** Prisma.
- **Design:** explicit relations, normalized operational records, indexed discovery paths, auditable changes and privacy-aware analytics.

```text
Users → business owners → businesses → services/reviews/interactions
  → search and analytics → governed intelligence
```

## Canonical domain map

| Logical table/domain | Prisma model(s) | Notes |
| --- | --- | --- |
| Users and roles | `User`, `Profile`, `Role`, `Permission`, `UserRole` | RBAC relations replace a single mutable role enum; profile holds optional personal/location preferences |
| Businesses | `Business`, `BusinessLocation`, `Service`, `BusinessImage` | profile, owner, categories, locations, services, hours, media and verification state |
| Geography | `Country`, `City`, `BusinessLocation` | normalized country/city plus business address/coordinates rather than one overloaded location table |
| Categories | `Category` | current schema provides type/slug; parent hierarchy and description require a reviewed migration when needed |
| Trust | `Review`, `Business.verificationStatus`, `AuditLog` | reviews use pending/approved/rejected moderation status |
| User intent | `Favorite`, `SearchQuery`, `BusinessView`, `ContactEvent` | saved firms, searches, views and measurable contacts |
| Platform analytics | `Event`, `SearchQuery`, aggregates outside the transaction path | event payloads require versioned, governed metadata |
| Commercial extension | `Subscription`, `Offer` | feature-flagged until entitlement, billing and support controls are ready |
| AI extension | `Embedding` | vector representations are a future governed data layer, not an MVP dependency |

## Required production entities

### Identity and access

`users` stores UUID identity, unique email/optional phone, password hash, lifecycle status and timestamps. Profile data is separated to support minimization and permissions. Sessions are revocable. Role and permission join tables provide customer, business-owner, moderator, admin and super-admin capabilities without baking authorization policy into a single user field.

### Business network

`businesses` includes UUID, owner, name, staged unique slug, description, category, contact channels, `opening_hours`, lifecycle status and verification status. `business_locations`, `services` and `business_images` hold repeatable related records. The staged nullable slug must be backfilled and made required only through a reviewed migration and application rollout.

### Trust and interactions

`reviews` associate a user and business with rating, comment, moderation status and timestamps; the current unique constraint prevents duplicate review records per user/business. `business_views` and `contact_events` record outcome-relevant, purpose-limited interactions. Verification evidence, user reports and appeals require access-controlled models/workflows before their public launch.

### Search and analytics

`searches` records query, user context where permitted and result count. `events` is the general event stream with purpose-limited metadata. Search/filter indexes must be reviewed against real query patterns; do not assume a separate search cluster until PostgreSQL full-text and indexes no longer meet measured needs.

## Planned, gated extensions

| Capability | Data model direction | Release gate |
| --- | --- | --- |
| Messages | sender/recipient/business records with retention and abuse controls | defined consent, moderation, support and privacy process |
| Verification requests | submitted-by, evidence references, reviewer/status and audit records | secure evidence storage and documented manual process |
| Reports | reporter, target, reason, decision and appeal record | moderation ownership and policy are live |
| Payments | provider references, amounts/currency, immutable state and reconciliation | qualified payment provider and legal/financial review |
| Recommendations | user/business, reason, score, model/version and outcome | quality evaluation, privacy controls and explanation policy |
| Knowledge graph | need/service/business/location/outcome relations | useful data density and a defined analytical use case |

## Indexing baseline

Maintain unique indexes for user email/phone where applicable, business/category slugs and relationship uniqueness. Index business category/status, business location, review business/timestamp, event actor/business/type/timestamp, search recency and contact/view business/timestamp. Add or remove indexes from observed query plans, not guesswork.

## Security and operations

Use least-privilege database access, encrypted transport and storage, managed backups with restoration tests, access/audit records and retention/deletion processes. Application roles do not equal database credentials. Sensitive verification/payment artifacts use dedicated access controls and should not be stored as public URLs.

## Migration strategy

Every schema change follows:

```text
Migration file → peer review → local/staging validation → backup/rollback plan → deploy → monitor
```

For non-null additions or high-volume changes, use expand/backfill/contract: add compatible fields, deploy readers/writers, backfill safely, validate, then enforce stricter constraints in a later migration.

## Final vision

The database is more than storage. It is the governed foundation for a trusted local business network, future commerce and privacy-respecting local intelligence.
