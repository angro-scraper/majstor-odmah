# Balkan.works AI & Data Strategy

## Purpose

Define how Balkan.works builds a responsible data foundation for future AI capabilities from day one. AI is not added as a disconnected feature; the platform becomes more useful as it learns from quality, permissioned local activity.

## Core principle

`Useful participation → governed data → better relevance/intelligence → better experience → retained participation`

Data creates intelligence only when it is accurate, purpose-limited, privacy-protected and evaluated against actual user/business outcomes. More data is not automatically better AI.

## Data vision

The platform should progressively understand what people seek, which local problems they are trying to solve, which eligible businesses best fit a stated need and how local supply/demand changes over time. It must do so without turning private behavior into a product to be sold or exposing a business's confidential information to another business.

## Data categories

| Category | Examples | Value/use boundary |
| --- | --- | --- |
| Business data | Name, category, location, hours, services, eligible prices/media, reputation | Accurate public discovery and authorized business management |
| User intent | Search query, stated need, permitted location/context, chosen filters | Better search/recommendation for the requesting user |
| Behavior | Eligible searches, views, saves, contacts, returns | Product quality, aggregate insights and opt-in/purpose-limited relevance |
| Trust data | Reviews, verification status, moderation/quality history | Trust signals with policy, evidence and anti-abuse controls |
| Local economy data | Aggregated supply, demand signals, category trends | Privacy-preserving local/business intelligence |

Financial, sensitive, health, detailed location and confidential business data receive additional controls and are not treated as general AI inputs.

## Collection principles

1. Collect only data that has a documented user/business/platform purpose.
2. Make collection and use transparent; provide meaningful controls where applicable.
3. Validate and minimize event metadata; avoid secrets, raw messages and unnecessary identifiers.
4. Preserve tenant isolation and do not use one business's confidential data to benefit another without an approved basis.
5. Define retention, deletion, ownership, access and audit requirements before new data collection.
6. Use data quality/freshness checks before it drives recommendations or automation.

## AI roadmap

### Phase 1 — Smart search foundation

Build accurate business/offers/location data, event taxonomy, full-text/structured search, query understanding experiments and quality evaluation. Natural-language and semantic search are grounded in current approved records; the system does not invent businesses, prices, availability or opening hours.

### Phase 2 — Recommendation engine

Add transparent, controlled ranking based on eligible location, declared interests, history and aggregate behavior. Measure against non-AI baseline. Users can adjust preferences and dismiss recommendations.

### Phase 3 — User assistant

Provide grounded comparison and discovery help: find firms, explain differences and recommend options with source/context. The assistant proposes; it does not contact, reserve, purchase or change data without explicit confirmation and module permissions.

### Phase 4 — Business AI

Offer owner-approved drafting (descriptions/posts/offers), permitted analytics explanation and improvement suggestions. Outputs are labeled, editable, tenant-isolated and never auto-published.

### Phase 5 — Agents

Future user/business agents may research, plan and prepare workflows. Consequential actions require scoped tools, authorization, human confirmation, audit logging, monitoring and rollback/compensation where possible.

## AI data pipeline

`User/business action → validated event collection → governed storage → quality/feature preparation → evaluated retrieval/model → recommendation/response → feedback and monitoring`

Core event examples include `SEARCH_PERFORMED`, `BUSINESS_VIEWED`, `OFFER_VIEWED`, `OFFER_SAVED`, `CONTACT_CLICKED` and later eligible `CONVERSION_COMPLETED`. Event names, schema versions, purpose and owner are recorded in the analytics taxonomy.

## Data infrastructure evolution

| Capability | MVP approach | Growth/scale evolution |
| --- | --- | --- |
| Operational data | PostgreSQL source of truth | Indexed/partitioned and governed by domain |
| Event tracking | Validated events and basic aggregates | Queue/warehouse processing and quality monitoring |
| Analytics | Product/business dashboards | Governed transformations and cohort/market analysis |
| Feature layer | Explainable rules and current context | Versioned eligible features/feature store when justified |
| Retrieval | Full-text/structured search | Vector/embedding index with provenance, scope and deletion support |
| Models | Rules/retrieval evaluation | Versioned models, offline/online evaluation and monitoring |

A data warehouse, feature store and vector database are future capabilities selected when the workload justifies them; they are not substitutes for a clean core schema and event design.

## Model and quality strategy

Models/retrieval configurations learn only from eligible, documented inputs. Training/evaluation data has lineage, quality checks, representative city/language coverage and privacy review. Measure recommendation relevance, grounded task success, user satisfaction, successful-connection lift, business outcomes, dismiss/override rates, safety reports, latency and cost. Roll out through feature flags and controlled experiments with a fallback.

## Privacy, security and governance

Apply data minimization, access control, encryption, audit logs, tenant isolation and user preference/privacy controls. AI processing passes through the AI Gateway, which applies purpose/permission checks, provider controls, minimization/redaction where needed, tool restrictions and request/output policy. GDPR-style principles and regional law require qualified review before production claims or high-risk processing.

## Data moat strategy

The intended advantage is not raw behavioral volume. It is a trusted local knowledge graph: accurate active businesses, current offers, reliable trust signals, useful interactions, local context and responsible intelligence. That combination becomes harder to copy when it produces visibly better outcomes for both sides of the network.

## What not to do

Do not build AI without quality local data, collect data without purpose, train on confidential/unauthorized content, deploy opaque personalization without controls or create complex models before a simpler search/recommendation solution proves insufficient.

## First-year and three-year focus

**First year:** data quality, event tracking, useful search, transparent basic personalization and evaluation discipline.  
**Three-year direction:** a grounded local AI search, business assistant and regional intelligence network — contingent on product adoption, governance, funding, operations and evidence.

## Final principle

The enduring value of Balkan.works is not only code or a model. It is the trusted understanding of local economies built gradually through data quality, consent, interactions and real user/business value.
