# Balkan.works API v1 — Implemented MVP

Base URL: `/api/v1`

All successful responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "error": { "code": "...", "message": "..." } }`.

## Public

- `GET /health` — deployment health check
- `GET /businesses` — verified business directory (`categoryId`, `cityId`, `limit`)
- `GET /businesses/:id` — verified business profile
- `GET /businesses/slug/:slug` — canonical public business profile for SEO pages
- `GET /categories` — active category taxonomy for discovery UI
- `GET /locations/countries` and `GET /locations/cities` — location discovery for onboarding and filters
- `GET /search` — business search (`query`, `categoryId`, `cityId`, `city`)
- `GET /offers` — active offers (`categoryId`, `cityId`, `limit`)
- `GET /offers/:id` — active offer detail
- `GET /businesses/:id/reviews` — approved reviews
- `POST /ai/search` — assisted discovery with deterministic intent signals and verified results

## Auth and user profile

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh` — rotates the refresh session
- `POST /auth/logout` — revokes the submitted refresh session
- `GET /users/profile` — bearer token required
- `PATCH /users/profile` — bearer token required

Access tokens are short lived. Refresh sessions are stored as SHA-256 token hashes; no new raw refresh token is persisted.

## Business owner

All routes require a bearer token and enforce ownership.

- `POST /businesses`
- `PATCH /businesses/:id`
- `DELETE /businesses/:id`
- `POST /businesses/:id/services`
- `POST /businesses/:id/contact/:type`
- `POST /businesses/:id/view`
- `POST /offers`
- `PATCH /offers/:id`
- `GET /analytics/businesses/:id`
- `GET /analytics/businesses/:id/insights` — profile score and actionable improvement guidance

## Customer actions

- `GET /favorites`
- `POST /favorites`
- `DELETE /favorites/:businessId`
- `POST /offers/:id/save`
- `POST /reviews`
- `POST /analytics/events`
- `GET /analytics/me/summary` — privatni sažetak aktivnosti korisnika za poslednjih 30 dana
- `GET /notifications`
- `PATCH /notifications/:id/read`

## Administration

Requires `ADMIN` or `SUPER_ADMIN` role.

- `GET /admin/overview`
- `GET /admin/users`
- `GET /admin/businesses`
- `GET /admin/reviews/pending`
- `PATCH /admin/businesses/:id/status`
- `PATCH /admin/reviews/:id/status`
- `POST /notifications`
- `GET /analytics/platform/summary` — agregirani 30-dnevni platform KPI (admin only)

## Operations

Admin-only operational views:

- `GET /operations/daily-brief` — daily platform activity, moderation queues and priorities.
- `GET /operations/cities/readiness` — supply/verification density and city launch readiness.
- `GET /operations/launch/plan` — approved pilot configuration, launch packages, growth loops and safeguards.
- `GET /operations/launch/readiness` — observed pilot-city go/no-go scorecard; it never treats an unmet target as a live launch.
- `GET /operations/businesses/:id/onboarding` — owner-only onboarding steps, completion and next action.

## Partner API ecosystem

Partner endpoints are disabled by default and require `PARTNER_API_ENABLED=true`. An active partner API key is supplied with `X-Partner-Api-Key`; every key uses explicit scopes and API-key request activity is recorded.

- `GET /partner/v1/me` — partner dashboard and 30-day usage snapshot.
- `GET /partner/v1/catalog/businesses`, `/categories`, `/locations/countries`, `/locations/cities`, `/deals` — partner catalog, requires `catalog.read`.
- `GET /partner/v1/webhooks` — partner webhook configuration, requires `webhooks.read`.
- `POST /partner/v1/webhooks/test` — adds a webhook test event to the outbound outbox, requires `webhooks.test`.

Admin routes under `/partners` create, revoke and audit partners, API keys, integrations and webhook subscriptions. Webhook endpoints must use public HTTPS; the signing secret is encrypted at rest and returned exactly once when a subscription is created. Delivery execution is deliberately an outbox concern, ready for a dedicated queue worker rather than an unbounded request-time network call.

## Environment

- `DATABASE_URL`
- `JWT_ACCESS_SECRET` (or `JWT_SECRET` for development)
- `JWT_REFRESH_SECRET` (optional; falls back to the access secret only in development)
- `WEB_ORIGIN` — comma-separated CORS allowlist
- `PARTNER_API_ENABLED` — explicit partner API feature flag
- `WEBHOOK_ENCRYPTION_KEY` — required to encrypt webhook signing secrets
