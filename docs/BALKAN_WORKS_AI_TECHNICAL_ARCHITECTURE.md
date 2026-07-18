# Balkan.works AI Technical Architecture

## Purpose

Define the technical architecture for an AI layer that improves local search, recommendations and business insight without creating a disconnected chatbot or bypassing the platform's security, privacy and module boundaries.

## Vision

`Governed data → understanding → prediction/retrieval → recommendation → approval-controlled action`

Balkan.works AI is an intelligence layer across the ecosystem. It helps people and businesses find, understand and decide using current, permissioned platform knowledge. It does not replace the operational source of truth, business ownership or human accountability.

## Reference architecture

`Applications → AI gateway → AI services → models/retrieval → knowledge layer → governed data layer`

The AI gateway is the sole application route to model providers and AI tools. Individual modules call stable internal contracts; they do not embed model keys, prompts or vendor-specific calls directly in a client or feature.

## Core components

| Component | Responsibility | Control boundary |
| --- | --- | --- |
| AI gateway | Authentication, authorization, routing, quotas, policy, telemetry, fallbacks and cost controls | Verifies requester, tenant, feature flag and tool scope |
| User assistant | Grounded local search, comparisons and decision support | Proposes; does not make consequential changes without confirmation |
| Business assistant | Drafts profile/offer content and explains authorized business analytics | Tenant-isolated and owner-approved output |
| Recommendation engine | Ranks relevant businesses, offers, events and content | Transparent signals, experiments and user controls |
| Search intelligence | Intent detection, semantic retrieval and hybrid ranking | Current approved content and location-aware policy |
| Knowledge/retrieval layer | Indexes approved business, offer, category and location facts | Freshness, provenance, permissions and deletion support |
| Forecasting/BI | Future demand and trend insights | Aggregated, evaluated and privacy-reviewed inputs |
| Agent runtime | Future scoped workflows with tools | Least privilege, confirmation, audit and human override |

## AI gateway

The gateway authenticates the caller through Balkan ID, checks module and feature-flag eligibility, enforces rate/usage limits, selects a model or fallback, retrieves allowed context, applies content/tool policy and records an auditable request outcome. It must redact or minimize sensitive data before external model processing, manage provider credentials through server-side secrets and expose provider-neutral response contracts.

Gateway telemetry includes correlation ID, model/version, prompt/template version, retrieval IDs, tool calls, latency, cost estimate, safety decision and outcome classification. Logs avoid retaining raw sensitive content unless an explicit, reviewed policy requires it.

## Search intelligence and recommendations

Search supports hybrid retrieval: structured filters (city, category, status, availability) plus full-text/semantic relevance. For a request such as “Treba mi jeftin frizer blizu mene,” the system derives intent, service/category, price preference and permitted location context; it returns only currently eligible records and labels uncertainty or incomplete data.

Recommendations use declared preferences, permitted history, local context and aggregate signals. A ranking pipeline applies eligibility filters before relevance scoring, diversity/freshness rules after scoring and explainability labels at display time. Every model-backed ranking is compared against a non-AI baseline through controlled experiments.

## Knowledge layer and RAG

Retrieval-Augmented Generation is the default pattern for factual assistant answers:

`User question → policy/intent → retrieve current authorized records → model synthesis → grounded answer with links/evidence`

Knowledge sources include approved business profiles, offers, categories, locations and platform documentation. External/public sources require separately approved ingestion and provenance. Indexing respects business status, offer expiry, locale, country, access policy and content freshness. The answer layer must not invent prices, availability, opening times, verification or a business that retrieval did not return.

## Vector and embedding layer

A vector database is a future retrieval index for semantic search and similarity, not the primary database. Embeddings may represent approved descriptions, offers, taxonomy and user interests only where purpose and permission allow. The index stores document/entity version, tenant/public access scope, locale, source timestamp and deletion state so re-indexing and right-to-delete flows are possible.

## ML and data pipeline

`Product event → validation/quality controls → governed storage → features/retrieval index → training or evaluation → versioned release → monitoring`

Use clicks, searches, views, saves, interactions and later eligible transactions only with defined purpose and data governance. Maintain feature definitions, training-data lineage, evaluation datasets and a separation between experimentation and production. Model training is not an MVP dependency; strong retrieval and rule-based ranking can deliver value first.

## Model lifecycle and evaluation

Models, prompts, retrieval settings and ranking rules are versioned. A release requires offline quality evaluation, privacy/security review, latency/cost assessment, red-team/safety testing appropriate to the use case, staged rollout, monitoring and rollback capability. Measure grounding accuracy, relevance, task completion, recommendation satisfaction, dismiss/override rate, business impact, language/city coverage, safety reports, latency and cost.

## Agent architecture

Agents are future, tool-using workflows. A Business Growth Agent can prepare campaigns or offer changes; a Customer Agent can research and plan. Agents may never autonomously publish content, spend money, reserve/pay, contact users or alter sensitive data without explicit user/owner confirmation, correct module permissions and an audit record. Tool calls are scoped, idempotent where relevant, rate-limited and reversible where possible.

## Security and privacy

The AI layer applies least privilege, tenant isolation, purpose limitation, data minimization, content safety controls, secret management, request/tool audit logs and user controls. No private user or business data is used for an unrelated prompt, model training or partner purpose without an approved basis. Users can manage eligible preferences; businesses control access to their confidential data. High-risk AI outputs receive human review paths.

## Development phases

| Phase | Product focus | Technical prerequisite |
| --- | --- | --- |
| 1 | Smarter search and basic recommendations | Quality events, search index, gateway, evaluation baseline |
| 2 | Grounded user assistant | Retrieval, source freshness, safety and user feedback |
| 3 | Business AI insights and drafting | Tenant-isolated analytics, approval UX and content policy |
| 4 | Permissioned agents | Tool registry, confirmation flows, audits and incident controls |

## Final vision

The long-term advantage is not a generic model. It is governed regional knowledge, current local supply, responsible product data and AI systems that make those inputs more useful without compromising trust.
