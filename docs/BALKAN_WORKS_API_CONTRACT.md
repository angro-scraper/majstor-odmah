# Balkan.works API Contract

## Scope

This is the stable REST contract between mobile/web/admin clients, the Core API and future modules. Public endpoints are JSON, versioned under `/api/v1`, documented in OpenAPI/Swagger and protected by authentication, authorization, validation and rate limits where required.

## Response envelope

```json
{ "success": true, "data": {}, "message": "Operation completed", "error": null }
```

```json
{ "success": false, "data": null, "message": null, "error": { "code": "INVALID_INPUT", "message": "Human-readable message" } }
```

Codes are stable machine-readable values such as `AUTH_ERROR`, `INVALID_INPUT`, `NOT_FOUND`, `FORBIDDEN`, `CONFLICT` and `SERVER_ERROR`. Do not expose stack traces or sensitive implementation detail.

## Authentication and roles

Use `Authorization: Bearer <token>`. RBAC policies support Customer, Business and Admin capabilities through Core role/permission tables; a client-provided role is never trusted as authorization. Refresh/logout/session revocation are implemented through authenticated session endpoints.

## Core namespaces

| Namespace | Contract |
| --- | --- |
| `/auth` | register, login, refresh, logout/session revocation |
| `/users/me` | current user profile and profile update |
| `/businesses` | create, list/filter, read and update owned businesses |
| `/offers` | create, list/filter, read and favorite offers |
| `/favorites` | list and remove saved businesses/offers |
| `/search` | keyword/category/city discovery, prepared for semantic search |
| `/notifications` | list and mark own notifications read |
| `/events` | internal/authorized event tracking with validated taxonomy |
| `/admin` | privileged business approval, suspension and moderation |

Future modules own `/food`, `/business-tools`, `/campaigns`, `/intelligence` and `/wallet` namespaces; they cannot change Core contracts without versioning and migration planning.

## Resource behavior

- Collection endpoints support pagination (`page`, `limit`), documented filtering and safe sorting.
- Business lists may filter by city, category and text search.
- Offer lists may filter by city, category, business and active status.
- Create/update payloads use DTO validation and derive owner/tenant identity from the authenticated subject.
- Favorite creation/removal is idempotent where possible and scoped to the current user.

## Versioning and compatibility

Do not make breaking behavior changes inside `/api/v1`. Add optional fields compatibly; create a new API version and migration plan for breaking changes. Deprecations include documentation, telemetry and a client migration window.

## Documentation and tests

Every route needs OpenAPI annotations, request/response examples, permission policy, validation tests, service/API tests and error cases. API performance rules include indexed queries, bounded pagination, response shaping and caching only where data freshness permits.
