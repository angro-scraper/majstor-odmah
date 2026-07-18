# Balkan.works Data Architecture

## Purpose

Define the data foundation for reliable application behavior, business analytics, personalization and future AI — while keeping operational data secure, understandable and scalable.

## Principle and vision

Data is more than a record of activity: when governed well, it becomes the platform's intelligence. It is collected only for defined purposes and processed through distinct layers:

`Operational data → event data → analytics data → governed AI data`

`User activity + business information + permitted market signals + accountable processing → intelligent platform`

## 1. Operational data layer

This transactional source of truth supports the running product. PostgreSQL/Prisma holds Balkan ID accounts and profiles, business profiles and memberships, categories, countries/cities/locations, offers, favorites, reviews, notifications, sessions, permissions, files and audit records. Business data is tenant-isolated: a business member can act only within an explicitly authorized business.

Operational data is optimized for correct product behavior rather than broad reporting. It has stable identifiers, timestamps, validation, relations, indexes, lifecycle/status fields and deletion/retention behavior appropriate to each domain. Currency, language, country and time-zone concerns are modeled so the platform can expand without redefining identity.

## 2. Event data layer

Events describe meaningful actions without replacing operational records. Examples include `USER_REGISTERED`, `BUSINESS_VIEWED`, `SEARCH_PERFORMED`, `OFFER_VIEWED`, `OFFER_SAVED`, `CONTACT_CLICKED`, `BUSINESS_CREATED` and `OFFER_CREATED`.

Every event has an immutable identifier, event name/version, occurred timestamp, anonymous or authorized actor reference where necessary, entity reference, minimal context, source/application and correlation ID. Location is coarse or omitted unless the user has granted a suitable purpose-specific permission. Sensitive values, tokens, full messages and raw personal data do not belong in analytics metadata.

## 3. Analytics data layer

Analytics transforms governed events and operational snapshots into metrics that help teams make decisions. Early stages may use PostgreSQL event tables and scheduled aggregates; the architecture allows a later warehouse without changing application contracts:

`Raw governed events → validated/processed data → aggregate tables → dashboards and reports`

| Audience | Questions answered | Examples |
| --- | --- | --- |
| Executive | Is the network growing healthily? | active users, active businesses, offer freshness, city health |
| Business owner | Is participation creating customer interest? | profile views, offer views, saved items, contact actions |
| Product team | Does the product solve needs reliably? | search success, activation, retention, error/latency signals |
| Operations | Where is quality or moderation needed? | incomplete profiles, stale offers, reports, verification queues |

Business analytics is aggregated and authorization-scoped. It never reveals another business's data or individual user behavior unless a product flow has a documented lawful basis and permission.

## 4. AI data layer

AI consumes only purpose-limited, permissioned and quality-checked inputs. Recommendation systems can use declared interests, eligible behavior and appropriate location context. Search intelligence can use queries, current approved content and retrieval context. Future business AI can use the requesting business's authorized metrics and approved market aggregates.

A vector/embedding store is a future retrieval capability for semantic search and grounded assistance; it is not the operational source of truth. Embeddings, model inputs and outputs need access controls, retention policy, provenance, evaluation and deletion handling. The AI gateway controls model access, tool permissions, auditability and cost.

## Data pipeline and real-time patterns

`Application action → validated event → processing/queue → governed storage → aggregate/analytics → feature, dashboard or permitted AI use`

Notifications, activity dashboards and recommendation updates may use asynchronous real-time processing. Background jobs must be idempotent, observable, retry-safe and dead-letter capable. They do not block the user-facing transaction or create a second source of truth.

## Data quality

Data must be accurate, complete enough for its purpose, fresh, consistent and secure. Each important dataset has an owner, documented schema/meaning, validation rule, freshness expectation and quality monitor. Examples: a business location must resolve to an approved city; an active offer requires a valid period; an event name must be registered; an analytics metric must state its denominator and time window.

## Governance, access and privacy

Role and resource controls apply at every layer: User → Business Owner/Member → Moderator → Admin → controlled system job. Apply least privilege, audit access to sensitive data, encrypt data in transit and at rest through infrastructure controls, and test backups/restoration. Users need meaningful profile, preference, notification and privacy controls; platform data collection remains minimal, transparent and purpose-bound.

No personal data is sold. Aggregated insights and future data products require privacy review, re-identification safeguards, clear scope and partner/business contracts before release.

## Dashboard and reporting rules

Dashboards label metric definition, time zone, date range, source freshness and known limits. A business metric must distinguish views, clicks, contact actions and completed outcomes; it must not imply revenue or customer conversion where that evidence is unavailable. Reports are permissioned and export activity is auditable.

## Scaling path

| Stage | Approach |
| --- | --- |
| MVP | PostgreSQL operational schema, event tracking, defined metrics and basic aggregates |
| Growth | Queue-backed processing, stricter schemas, scheduled aggregates, data-quality monitoring |
| Regional scale | Warehouse/lakehouse, governed transformations, observability and country-aware data controls |
| Intelligence platform | Evaluated feature/retrieval pipelines, privacy-preserving aggregates and controlled AI services |

## Final vision

Balkan.works becomes a platform that not only connects local markets, but understands them responsibly — through trustworthy data, useful insight and human-controlled intelligence.
