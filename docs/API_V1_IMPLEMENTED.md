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

## Environment

- `DATABASE_URL`
- `JWT_ACCESS_SECRET` (or `JWT_SECRET` for development)
- `JWT_REFRESH_SECRET` (optional; falls back to the access secret only in development)
- `WEB_ORIGIN` — comma-separated CORS allowlist
