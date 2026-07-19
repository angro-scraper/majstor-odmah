# Data intelligence foundation

The MVP data platform is an **operational analytics layer** on PostgreSQL. It
collects a bounded event vocabulary, builds scoped API summaries at request
time, and records recommendation decisions. It is deliberately not presented
as a data lake or a warehouse yet: those are scaling steps once query volume
and historical reporting justify dedicated infrastructure.

## Event contract

`POST /api/v1/analytics/events` accepts only `ANALYTICS_EVENT_TYPES` declared
in `services/api/src/modules/analytics/analytics.service.ts`. Every event has a
small allow-list of metadata fields. Unknown fields fail validation so prompts,
message content, payment details, contact details, and device identifiers
cannot accidentally enter the analytics store.

Important cross-platform events include `DEAL_VIEWED`, `SAVE_FOOD_RESERVED`,
`PAYMENT_COMPLETED`, `REVIEW_CREATED`, `SERVICE_REQUEST_CREATED`,
`JOB_APPLIED`, and `RECOMMENDATION_CLICKED`.

## Read models

- `GET /analytics/me/intelligence` — authenticated, user-facing 30-day activity
  and segments; includes links to export and data-subject controls.
- `GET /analytics/businesses/:id/report` — business-owner scoped performance
  report and actionable, non-automated insights.
- `GET /analytics/platform/regional` — admin-only aggregate counts by country.
- `GET /ai/recommendations` — records recommendation decisions without prompts
  or private profile fields. Recommendation v2 uses bounded 30-day event
  categories and selected interests only; it never stores or ranks on the raw
  text of a user search or chat message.

All API responses remain behind the existing `/api/v1` prefix.

## Governance and retention

Analytics follows the existing consent, export, and data-subject-request flows:

- user consents: `/api/v1/compliance/consents`
- export: `/api/v1/compliance/data-export`
- correction/deletion requests: `/api/v1/compliance/data-requests`

`ANALYTICS_RAW_EVENT_RETENTION_DAYS` and
`ANALYTICS_AGGREGATE_RETENTION_DAYS` document the operational retention policy.
A scheduled deletion job must be introduced with Legal approval before a
production retention window is enforced. Aggregated reports never include raw
query text or individual user rows.

## Warehouse path

When the event volume warrants it, copy the reviewed event contract to a queue
and warehouse through an idempotent exporter. The application database remains
the source of truth; the warehouse receives only the allow-listed schema.
