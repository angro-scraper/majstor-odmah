# Balkan.works AI Architecture

## Purpose

Define the governed AI layer that can evolve local business discovery into an assistant that understands what a person needs. AI is not a generic chatbot; it is a local discovery, recommendation and business-support layer grounded in permitted platform knowledge.

## User experience

A person should be able to say, “I need a reliable air-conditioner repair person this afternoon,” without knowing the exact category. The system interprets intent, supported location context, time/urgency and preferences, then returns transparent options and the next safe action.

## Components

```text
AI layer
├─ Intent recognition
├─ Semantic retrieval
├─ Ranking and trust signals
├─ Personalization and recommendations
├─ User/business assistant experiences
└─ Human moderation and safety controls
```

### Intent recognition

Extract service/category, constraints, location, time and priority from natural-language input. For example, “restaurant for a quiet family lunch” can become an explicit structured query with uncertainty preserved. The system must ask clarifying questions when required data is missing rather than inventing constraints.

### Semantic search

Semantic retrieval complements — never silently replaces — conventional search. Approved embeddings may represent verified business descriptions, services, categories and eligible review summaries. The existing `Embedding` Prisma model is a placeholder for metadata/reference storage; production vector storage and embedding lifecycle require a separate, reviewed provider decision.

### Ranking and trust

Rank results using explainable, audited signals such as textual relevance, distance when consented/available, approved rating/review evidence, verification, profile quality, current availability only when reliably supplied and explicit user preference. Do not present an opaque “quality score” as fact. If a score is shown, disclose its purpose, signals and limitations.

### Recommendations and summaries

Recommendations use permissioned search, save, view and contact signals. Business summaries must be grounded in approved source information, avoid unsupported claims and link users back to source details. Personalization must remain controllable and never expose a user’s private activity to a business.

### Assistant experiences

The customer assistant can find, compare and explain eligible businesses. The business assistant can suggest profile improvements, review responses and marketing drafts for human approval. Agents that make bookings, contact third parties or take other external actions are a later phase requiring explicit user approval, tool scopes, audit trails and escalation paths.

## Data and API boundary

Future module structure:

```text
services/api/src/modules/ai/
├─ ai.controller.ts
├─ ai.service.ts
├─ intent/
├─ retrieval/
├─ ranking/
├─ recommendations/
└─ assistant/
```

Planned endpoints include `POST /api/v1/ai/search`, `GET /api/v1/ai/recommendations` and `POST /api/v1/ai/chat`. They remain feature-flagged and unpublished until data, model/provider, safety and evaluation gates are met.

## Development phases

1. **Data foundation:** event taxonomy, quality controls and verified local data.
2. **AI search MVP:** intent handling, grounded retrieval and explainable ranking evaluation.
3. **Recommendations:** consented personalization with outcome measurement.
4. **Assistants:** grounded customer and business help with disclosure and human fallback.
5. **Constrained agents:** approved actions only after booking/transaction controls exist.

## Quality, safety and moderation

Track searches, views, contacts, favorites and reviews with purpose-limited event policies. Evaluate retrieval accuracy, helpfulness, successful-connection impact, latency, unsupported-claim rate, privacy incidents and user trust. Moderation automation may prioritize spam or suspicious content for review; it does not replace accountable human decisions for consequential enforcement.

AI must be useful, fast and transparent. It must never fabricate business facts, promise outcomes it cannot verify or hide why a recommendation was made.

## Current boundary

The MVP database and event model preserve the necessary future extension points, but no AI provider, embeddings pipeline, vector database or public AI endpoint is implemented or enabled yet.

## Final vision

The user should not need to know which business to search for. They should be able to express a real local need, understand the recommended options and make a better, trusted choice.
