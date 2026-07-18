# Balkan.works Database Architecture

## Purpose

Define the data architecture supporting users, businesses, discovery, reviews, business relationships, analytics and future AI. This is not only a storage design: it is the evolving model through which Balkan.works understands the local economy.

The normative implemented model remains [BALKAN_WORKS_DATABASE_SCHEMA.md](BALKAN_WORKS_DATABASE_SCHEMA.md) and the Prisma schema in `packages/database/prisma/schema.prisma`. This document describes the architectural layers and intended evolution; it does not claim that future tables or services are already deployed.

## High-level model

```text
Users ↔ Interactions ↔ Businesses ↔ Categories ↔ Locations
                       ↕
             Reviews, trust, analytics and governed AI knowledge
```

## Operational entities

| Domain | Core data | Purpose |
| --- | --- | --- |
| Identity | `users`, profiles, sessions | accounts, preferences, roles and secure access |
| Businesses | `businesses`, members, contacts, images, services | structured local supply and ownership |
| Geography | `locations`, categories | discovery by place and type of need |
| Trust | reviews, verifications, reports, audit logs | quality, moderation and accountable decisions |
| Engagement | favorites, search events, interaction events | user value and product signals |
| Analytics | business metrics, aggregate analytics | business outcomes and platform decisions |

### Essential model rules

- A business has an accountable owner and can later have multiple authorized members.
- Contact information, services and images are separate extensible records where lifecycle or multiple values are needed.
- Categories support parent/child relationships; locations support country, region, city and neighborhood-level evolution.
- Reviews, reports and verifications have explicit statuses, timestamps and responsible actors.
- Event records capture only useful, governed context and must not become an uncontrolled collection of personal data.

## Event and search architecture

`search_events` records the query, relevant location context, timestamp and a privacy-safe actor reference when available. A more general `events` stream captures meaningful actions such as search, click, view, contact and favorite creation, with an entity reference and structured metadata.

These events are the source for activation, successful-connection metrics, business analytics and future relevance improvements. Event names, payload schemas, retention and access must be versioned and documented before collection.

## Trust layer

The trust system includes business-verification records, review moderation, reports for suspicious content and audit logs for material administrative actions. Verification evidence and moderation data are access-controlled, retained only as necessary and never exposed as a public claim without supporting policy and process.

## Analytics layer

Business metrics aggregate profile views, offer views, clicks, contacts and conversions according to a documented definition. Aggregates serve dashboards; raw event data remains separately governed to avoid expensive product queries and uncontrolled access to personal data.

## Governed AI knowledge layer

Future AI records may include user intents, recommendation impressions/outcomes and vector representations of approved business descriptions, services, reviews and location context. Any such layer must:

- use only permitted data for a documented purpose;
- separate sensitive/private data from retrieval indexes;
- record recommendation reason, model/version and outcome where practical;
- support deletion, correction, retention and access-control obligations;
- be evaluated for relevance, safety and privacy before release.

The future knowledge graph connects **user → need → service → business → location → outcome**. It is a later analytical representation, not a prerequisite for MVP.

## Search evolution

1. **MVP:** PostgreSQL query/filtering by business, category and location.
2. **Growth:** full-text and geo-aware search, with tested relevance ranking.
3. **Scale:** dedicated search service where measured load/relevance needs justify it.
4. **AI:** governed semantic/vector retrieval layered on verified, permissioned knowledge.

## Security and access model

Use role-based, least-privilege access for customer, business owner, admin and super-admin capabilities. Protect data in transit and at rest, maintain tested backups and audit material access/change events. Aggregate or de-identify data before broader analysis where feasible. Follow the Security & Privacy Framework and Legal Framework for rights requests, retention, incident handling and regional obligations.

## Scaling path

Start with one well-indexed primary database and a clear repository/data-access layer. Split search, analytics and AI workloads only when observed scale, isolation or operational requirements warrant it. Distributed architecture is an outcome of measured demand, not a starting assumption.

## Principles

- **Clean data:** accurate, current and structured information produces better discovery.
- **Useful signals:** track only interactions that improve product decisions or user/business value.
- **Privacy first:** user data carries responsibility as well as value.
- **Progressive complexity:** do not build a data platform before the network produces real signals.

## Final vision

The database becomes a governed digital map of the local economy: reliable enough for people and businesses today, and structured enough for future intelligence to understand needs, services and successful outcomes.
