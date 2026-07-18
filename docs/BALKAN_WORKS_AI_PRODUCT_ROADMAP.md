# Balkan.works AI Product Roadmap

## Purpose

Define the staged development of AI capabilities for Balkan.works: improving local discovery first, then personalization and business assistance, while preserving privacy, user control and clear accountability.

## AI vision and principle

Balkan.works should not merely list information. It should understand a user's need and connect that need to relevant, trustworthy local opportunities. AI is valuable only when it improves user value, business value or operating efficiency; it is not a decorative feature.

`AI search → recommendations → user assistant → business AI tools → governed AI ecosystem`

## Phase 1 — AI foundation

Before an AI-facing feature, establish privacy-minimized event tracking, data quality ownership, consent and preference controls, an AI gateway, evaluation datasets, access permissions, audit logs and feature flags. Useful inputs may include searches, approximate location only when permitted, categories, stated interests and product behavior. The system must document purpose, retention and access for each signal.

## Phase 2 — intelligent search

Improve traditional keyword search with intent understanding, semantic retrieval and location-aware ranking. A query such as "Gde mogu brzo popraviti auto blizu mene?" should return explainable local options, relevant filters and the evidence used for ranking. Results remain grounded in current approved platform data; AI must not invent businesses, prices, availability or opening hours.

## Phase 3 — recommendations

Recommend businesses, offers, events and local content using declared interests, location, history and aggregate behavior only where allowed. Begin with transparent, reversible ranking experiments and measure incremental usefulness against non-AI discovery. Users can edit preferences, dismiss recommendations and understand why something is shown.

## Phase 4 — Balkan Assistant

Provide a conversational discovery layer that can search, compare and support decisions. For example, a request for a family restaurant should return a grounded shortlist, why each option fits and links to verified platform details. The assistant proposes actions; it cannot reserve, publish, spend money, contact a business or change user data without an explicit confirmation and the required module permissions.

## Phase 5 — Business AI Assistant

Offer approval-required assistance to businesses:

- **Profile builder:** draft descriptions, category suggestions and completeness guidance.
- **Marketing assistant:** draft campaigns, posts and offer copy.
- **Analytics assistant:** explain permitted business metrics and trends, with data provenance.

Generated output is clearly labeled, editable and never published automatically. One business cannot access another business's data. Payment, campaign spend and customer outreach always require a human owner approval.

## Phase 6 — market intelligence

Turn governed, aggregated platform signals into practical business insights such as demand patterns or local category trends. Insights need a stated time window, scope, confidence/limitation context and privacy review. They must not expose individual behavior, confidential partner data or sensitive inferences.

## Phase 7 — agents

Agents are a long-term capability, not an MVP assumption. A user agent may research, compare and plan; a business agent may prepare content and analyze results. Every agent tool has least-privilege permissions, a clear scope, confirmation requirements for consequential actions, auditability, rate limits and a human override.

## Reference architecture

`Governed data layer → models and retrieval → recommendation/AI gateway → permissioned tools → consumer and business experiences`

The gateway is the only approved route to AI models and tools. It centralizes provider configuration, prompt and tool policy, moderation, cost controls, request logging, evaluation and fallback behavior. Models are replaceable; modules consume stable internal AI contracts instead of connecting directly to vendors.

## Safety, quality and governance

AI must be transparent, reviewable, accountable and non-manipulative. It uses no private or business data without a documented purpose and appropriate permission. Track recommendation relevance, task completion, user satisfaction, grounding/citation coverage where applicable, override/dismissal rate, harmful-output reports, latency, cost and business outcomes. Evaluate by country/language and local context before expansion.

## Commercial model

Possible later products include premium consumer assistance, approval-based business tools and professional analytics. No paid AI feature should be activated before pricing, entitlements, legal review, data controls and user-facing disclosure are ready.

## Risks and release gates

| Risk | Control |
| --- | --- |
| Irrelevant or inaccurate recommendations | Offline evaluation, controlled experiments, feedback and rollback |
| Privacy or cross-tenant exposure | Consent, data minimization, tenant isolation, access logs and security review |
| Excessive automation | Explicit confirmation, scoped permissions and human override |
| Hallucinated local facts | Grounded retrieval, freshness checks and transparent uncertainty |
| Bias across cities, languages or business types | Coverage testing, monitoring and documented remediation |

Each phase launches behind a feature flag after security review, quality evaluation, user-experience review and monitoring are in place. It scales only when it proves an incremental benefit over the non-AI baseline.

## Final vision

Balkan.works AI becomes an intelligent, governed layer that helps people and businesses discover, decide and act — without replacing trust, consent or human accountability.
