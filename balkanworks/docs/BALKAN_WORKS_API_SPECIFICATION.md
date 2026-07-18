# Balkan.works API Specification

## Relationship to API Contract

The API Contract defines envelopes, compatibility, permissions and versioning. This specification names the resource namespaces and intended operations. All endpoints are JSON REST under `/api/v1`; Swagger/OpenAPI becomes the generated executable reference as modules are implemented.

## Identity and user endpoints

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| POST | `/auth/register` | Create Customer/Business identity | Public, validated |
| POST | `/auth/login` | Issue access/refresh session | Public, rate limited |
| POST | `/auth/logout` | Revoke current session | Authenticated |
| POST | `/auth/refresh` | Rotate/refresh authenticated session | Session validated |
| GET | `/users/me` | Read current profile | Authenticated |
| PATCH | `/users/me` | Update allowed current-profile fields | Authenticated |

Role assignment and privileged roles are controlled server-side; request payload roles are not authorization claims.

## Business, offer and discovery endpoints

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/businesses` | List/filter businesses by category, location, search and later rating | Public/paginated |
| POST | `/businesses` | Create an owned business profile | Authenticated |
| GET | `/businesses/{id}` | Read business and published offers | Public |
| PATCH | `/businesses/{id}` | Update owned/authorized business | Owner/member policy |
| GET | `/offers` | List/filter offers | Public/paginated |
| POST | `/offers` | Create offer for authorized business | Business policy |
| GET | `/offers/{id}` | Read offer | Public |
| PATCH | `/offers/{id}` | Update authorized offer | Business policy |
| GET | `/search` | Global query across allowed business/offer categories | Public/controlled |

Filters and sorting are explicitly allow-listed. Create/update inputs use DTO validation and derive owner/tenant from the session.

## Interaction and platform endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/favorites` | Save an allowed business or offer |
| DELETE | `/favorites/{id}` | Remove own favorite |
| POST | `/reviews` | Create moderated review subject to policy |
| GET | `/businesses/{id}/reviews` | List published reviews |
| POST | `/events` | Record validated, authorized analytics event |
| GET | `/businesses/{id}/analytics` | Read authorized aggregate business metrics |
| GET | `/notifications` | List own notifications |
| PATCH | `/notifications/{id}/read` | Mark own notification read |

## Admin endpoints

`/admin/users`, `/admin/businesses/{id}/approve`, `/admin/businesses/{id}/suspend` and `/admin/moderation` are Admin-only, audited operations. Exact actions require explicit DTOs, permission checks and moderation state rules before implementation.

## Future flagged namespaces

| Namespace | Status rule |
| --- | --- |
| `/ai/recommendations`, `/ai/chat`, `/ai/business/{id}/insights` | AI Gateway, consent, model/provider and feature flag required |
| `/food` | Save Food product/fulfilment policy required |
| `/products`, `/orders` | Marketplace trust, payment/support workflow required |
| `/wallet`, `/wallet/transactions` | Regulated payment partner, ledger and reconciliation required |
| `/business-tools` | Opsnestone tenant/operating contracts required |

No client should surface a future namespace as available until its module is active for the current environment/user/tenant.

## Implementation requirements

Every endpoint needs auth/authorization where applicable, validation, stable response envelope, error codes, rate limits, audit/logging behavior, pagination/cache rules, OpenAPI documentation and automated tests. API changes that break clients require a version/migration plan.
