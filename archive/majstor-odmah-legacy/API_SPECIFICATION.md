# Balkan.works API Specification

## Contract

- Public base URL target: `https://api.balkan.works/v1`
- Transport: REST over HTTPS
- Format: JSON
- Authentication: JWT Bearer token
- Documentation: OpenAPI / Swagger

The currently deployed `/api` surface remains a backwards-compatible portal gateway while modules migrate or are introduced under `/v1`. New public contracts must not be added without versioning.

## Module namespaces

`/auth`, `/users`, `/businesses`, `/locations`, `/categories`, `/offers`, `/deals`, `/save-food`, `/services`, `/jobs`, `/marketplace`, `/rewards`, `/wallet`, `/messages`, `/notifications`, `/search`, `/ai`, `/admin`.

Future namespaces: `/health`, `/auto`, `/real-estate`, `/travel`, `/tickets`, `/education`, `/diaspora`.

## Standard response envelope

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Errors use the same envelope with `success: false`, a stable machine-readable error code and a safe user-facing message. Pagination, request IDs and rate-limit headers are required for list endpoints at scale.

## Authentication

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/v1/auth/register` | Create user with email, phone, password and country |
| POST | `/v1/auth/login` | Return access token, refresh token and user summary |
| POST | `/v1/auth/refresh` | Rotate a refresh token |
| POST | `/v1/auth/password-reset` | Start password-reset flow |

## User and business

- `GET` / `PUT` `/v1/users/profile`
- `GET` / `PUT` `/v1/users/preferences`
- `POST` `/v1/businesses`
- `GET` `/v1/businesses/{id}`
- `POST` `/v1/businesses/{id}/verify` — admin only

Business profiles expose contact, location, opening hours, offers, verification and trust signals.

## Offers and Deals

- `POST` `/v1/offers`
- `GET` `/v1/offers/nearby?lat=&lng=&radius=&category=`
- `POST` `/v1/offers/{id}/favorite`
- `POST` `/v1/deals/flyers`
- `GET` `/v1/deals/flyers?city=&category=&business=`

Offers are the shared engine for actions, promotions and later marketplace/business promotions.

## Consumer growth routes

- `POST` `/v1/save-food/packages`
- `POST` `/v1/save-food/reserve`
- `POST` `/v1/save-food/pickup` — QR pickup verification
- `POST` `/v1/services`; `GET` `/v1/services/search`
- `POST` `/v1/jobs`; `POST` `/v1/jobs/{id}/apply`
- `POST` `/v1/marketplace/products`; `GET` `/v1/marketplace/search`

Marketplace, Wallet and advanced AI endpoints remain feature-flagged until their approved roadmap phases.

## Shared APIs

- `POST` `/v1/messages/conversations`
- `POST` `/v1/messages/send`
- `POST` `/v1/reviews`
- `GET` `/v1/rewards/balance`; `GET` `/v1/rewards/history`
- `GET` `/v1/notifications`; `PUT` `/v1/notifications/{id}/read`
- `GET` `/v1/search?q=` — businesses, offers, services and other enabled modules

## Deferred regulated / AI APIs

- `GET` `/v1/wallet`; `POST` `/v1/wallet/payment` require payment-provider, legal and security approval.
- `POST` `/v1/ai/chat` starts as permission-aware Search + Chat only. It cannot make autonomous or paid actions.

## Admin

`GET /v1/admin/dashboard` summarizes users, businesses, activity and only approved financial metrics. Every admin action is RBAC-protected and audit-logged.

## Implementation rule

Each module owns controller/router, service, repository, DTO/schema, entity/model, validation, logging, permissions, tests and OpenAPI documentation. Modules do not bypass the Core or directly couple to one another.
