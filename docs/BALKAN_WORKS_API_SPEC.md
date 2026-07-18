# Balkan.works API Specification

## Purpose

Define the versioned API contract through which web, mobile, business and admin surfaces communicate with Balkan.works.

## Principles

The API is secure, documented, versioned and scalable. Its base prefix is `/api/v1`; protected requests use `Authorization: Bearer {accessToken}`. Existing routes are not silently changed — breaking changes require a `/api/v2` migration plan.

All successful controllers use the standard envelope:

```json
{ "success": true, "data": {}, "message": "" }
```

Errors are mapped to appropriate HTTP status codes with a safe error code/message envelope. DTO validation, authentication, resource authorization, audit logs for privileged actions and rate limiting are release requirements.

## Current directory-first API

| Module | Route | Access | Status |
| --- | --- | --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login` | public | implemented foundation |
| User | `GET/PATCH /users/profile` | authenticated | implemented foundation |
| Business | `POST /businesses`, `GET/PATCH/DELETE /businesses/:id` | public read; owner write | implemented foundation |
| Business service | `POST /businesses/:id/services` | owner | implemented foundation |
| Contact event | `POST /businesses/:id/contact/:type` | authenticated | implemented foundation |
| Search | `GET /search?query=&categoryId=&cityId=` | public | implemented foundation |
| Reviews | `POST /reviews`, `GET /businesses/:id/reviews` | protected create; public read | implemented foundation |
| Favorites | `GET/POST /favorites`, `DELETE /favorites/:businessId` | authenticated | implemented foundation |
| Admin | `GET /admin/overview`, moderation status routes | administrator | implemented foundation |

Business creation currently expects `categoryId` and `cityId` rather than a generic `locationId`, because the canonical model uses `Country`, `City` and `BusinessLocation`. Contact actions accept `PHONE`, `EMAIL`, `MESSAGE` or `LOCATION` and create privacy-limited event records.

## Target module contract

### Authentication and users

- `POST /auth/register` — email/password and progressive profile information.
- `POST /auth/login` — access/refresh session response.
- `GET/PATCH /users/profile` — current user profile.

### Businesses and discovery

- `POST /businesses`, `GET/PATCH/DELETE /businesses/:id`.
- `GET /search` — query, category, city/location and future validated ranking parameters.
- `GET /categories`, admin category mutation.
- `GET /locations`.
- `GET /businesses/:id/analytics` for authorized owners.

### Trust and engagement

- `POST /reviews`, `GET /businesses/:id/reviews`.
- `GET/POST /favorites`, `DELETE /favorites/:businessId`.
- a contact-event route or business contact action with a documented attribution policy.
- `POST /events` for approved, schema-versioned analytics events.

### Administration and media

- business/user lists, approval/rejection, reports and review moderation under `/admin`.
- `POST /uploads` only after secure object storage, file validation, malware policy and ownership checks are active.

## Future, feature-gated endpoints

- `/ai/search`, `/ai/recommendations`, `/ai/business-assistant` after AI governance/evaluation gates.
- payments, marketplace and messaging endpoints after legal, security and operational readiness.

## HTTP behavior

Use `200` for successful reads/updates, `201` for created resources, `400` validation failures, `401` missing/invalid identity, `403` authorization failure, `404` absent/inaccessible resources and `500` unexpected server errors. Do not leak internal errors, account existence or secret material.

## Final vision

The API is the central contract connecting people, businesses, applications and future AI systems. Its reliability comes from stable versioning, honest documentation and security at every route.
