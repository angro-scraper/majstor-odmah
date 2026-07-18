# Balkan.works System Architecture

## Purpose

Define the system-level architecture that can launch the MVP, support user growth, scale city by city and add governed analytics and AI when evidence requires it.

## Principle

Start simple, build modularly and scale based on observed need. The initial architecture is a modular monolith with clear domain boundaries, not prematurely distributed services.

```text
Users
  ↓
Frontend applications
  ↓
API layer
  ↓
Modular backend services
  ↓
Primary database and object storage
  ↓
Analytics / AI layer
  ↓
External providers
```

## Frontend layer

| Application | Primary responsibility | Delivery stage |
| --- | --- | --- |
| Web application | discovery, public business profiles, SEO and business access | MVP |
| Business dashboard | profiles, offers, outcomes and business tools | MVP / growth |
| Admin panel | verification, moderation, user/business controls and audit work | MVP |
| Mobile application | location-aware discovery, notifications and quick return use | staged after validated core flows |

Shared design components, accessibility standards and consistent API clients should be reused across applications.

## API layer

The versioned API is the controlled boundary for authentication, authorization, validation, business logic and integrations. Core modules cover:

- users, profiles, preferences and sessions;
- businesses, services, categories, locations and media;
- search, filters and ranked results;
- offers, favorites, reviews and reporting;
- analytics event collection and business metrics;
- notification orchestration;
- administration, moderation and audit trails.

The API contract and response/error conventions are governed by the API documentation; endpoints enforce role and resource-level authorization rather than relying on UI restrictions.

## Backend layer

Initial modules run in one deployable NestJS/TypeScript application with service and repository boundaries. User and business services own their respective workflows. Search begins with indexed database queries and filters; notifications coordinate email, in-app and future push delivery; payments and external commerce remain future integrations with qualified providers.

Service extraction is a measured later step: search, analytics and AI are candidates only when load, deployment independence, data isolation or operational evidence justifies it.

## Data, search and analytics

The primary relational database holds transactional platform data: users, businesses, locations, categories, reviews, offers and events. Object storage holds images and media. Search progression is database filtering → full-text/geo relevance → dedicated search service if needed. Analytics separates aggregate reporting from operational queries and establishes a governed event pipeline for product and business decisions.

```text
User action → event tracking → governed storage → analytics → evaluated intelligence → improved experience
```

See Database Architecture and Data Architecture for entity-level and pipeline details.

## Future AI layer

AI is an additional governed layer, not an MVP dependency. It may add intent-aware search, recommendations, business assistance and, much later, constrained agents. It uses only permitted local knowledge and needs data-quality controls, access controls, logging, evaluation, transparency and human escalation. No AI feature may make unsupported business claims or reveal private information.

## Security and infrastructure

Authentication protects accounts; authorization enforces customer, business and administrative permissions; encryption, backups, logging and monitoring protect data and availability. Cloud infrastructure includes application compute, database, storage, networking, secrets management and observability. The delivery path is **code → test → build → deploy → monitor**, with versioning and rollback readiness.

Monitor availability, response times, errors, resource usage, suspicious events, backups and material cost drivers. The detailed requirements remain in the Security, DevOps and Deployment Architecture documents.

## Scaling path

| Stage | Architecture decision |
| --- | --- |
| MVP | one modular application, managed primary database and observable deployments |
| Growth | scale application instances; extract search/analytics workloads only when justified |
| Regional scale | independently deployable, well-governed services and region-aware infrastructure where required |

## Technology principles

- **Reliability:** the product must be available and recoverable.
- **Simplicity:** avoid complexity before it solves a measured problem.
- **Security:** data and access controls are core product responsibilities.
- **Scalability:** preserve module boundaries and operational observability for future growth.

## Final vision

Balkan.works evolves from a reliable local discovery platform into a data-informed, AI-enabled regional digital infrastructure — while retaining clear ownership, safety and operational control at every layer.
