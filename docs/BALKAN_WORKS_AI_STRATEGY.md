# Balkan.works AI Strategy

## Purpose

Balkan.works is an AI-powered regional ecosystem that helps users, businesses and partners make better decisions while retaining human control and privacy.

## Architecture

`Applications → AI Gateway → Permissioned Agents → Knowledge Layer → Data Layer → Models`

The AI gateway is the sole entry point for model calls. It enforces authentication, module feature flags, rate limits, audit events, data-minimisation and user consent before any request reaches a model or a tool.

## Product agents

| Agent | User outcome | Initial scope | Requires approval |
| --- | --- | --- | --- |
| Balkan Assistant | Finds local offers, places and services | Search and recommendations | Any reservation, message or purchase |
| Business Copilot | Proposes campaigns and analyses results | Insight and draft generation | Publishing a campaign |
| Marketing Agent | Drafts flyers, copy and audiences | Draft only | Audience selection and publishing |
| Accounting Assistant | Explains expense and sales trends | Read-only summaries | Any accounting write |
| Stock Radar Agent | Explains market data and trends | Educational/read-only | Never executes investment actions |
| Save Food Agent | Suggests discount timing and surplus offers | Recommendation only | Creating or publishing a package |
| Support Agent | Guides users through the product | Knowledge-base answers | Escalation or account changes |

## Knowledge and data rules

- Knowledge sources are verified business profiles, offers, products, locations and approved documentation.
- Search begins with PostgreSQL search. Vector search is an optional later capability behind an `AI_VECTOR_SEARCH_ENABLED` flag.
- Personal preferences are purpose-limited and user-controlled. They are not sold or exposed to businesses.
- Sensitive account, payment, identity and private-message data is excluded from model prompts by default.
- Every assisted action records the source, tool call, result and actor in audit logs.

## Permissions and human control

AI may retrieve, rank, summarize and prepare drafts only within its explicit module permissions. It may not spend money, publish content, alter financial records, contact users or make reservations without an authenticated person confirming the action.

## Rollout

1. **AI Search & Recommendations** — grounded responses over public platform data.
2. **Business Copilot & Marketing AI** — campaign drafts and measured suggestions.
3. **Opsnestone & Analytics AI** — permissioned reporting, inventory and accounting insights.
4. **Automation** — approved workflows with clear previews, cancellation and audit trails.

## Commercial model

- Free: limited grounded assistant search.
- Premium User: deeper personal recommendations.
- Business AI: marketing, analytics and approved workflow tools.
- Enterprise: isolated knowledge sources and custom policy controls.

## Success metrics

Measure recommendation quality, accepted recommendations, repeat usage, business uplift, time saved and rejected/overridden suggestions. Optimize for accurate, useful outcomes rather than generated volume.
