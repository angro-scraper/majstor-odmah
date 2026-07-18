# Balkan.works API Documentation

## Purpose

Define the public and internal API contract for Balkan.works. The API is a stable, documented and secure agreement between web, mobile, business/admin applications and future approved integrations.

## Architecture and scope

`Web / Mobile / Admin → API gateway → modular backend services → database`

The current platform is REST-first. GraphQL, WebSockets, AI endpoints, webhooks and partner APIs are future extension points; they do not bypass the gateway, permissions, validation or audit controls.

## Base URL and versioning

Production clients use `https://api.balkan.works/api/v1`. Local and staging URLs are environment-specific and never hard-coded in clients. A version remains supported until a documented migration and deprecation window exist. Breaking changes require a new version; additive changes stay backwards compatible where possible.

## Authentication and authorization

Authenticated endpoints accept `Authorization: Bearer <access-token>`. Balkan ID issues short-lived access tokens with refresh-token/session management. Endpoint access is role and resource scoped; roles include Customer, Business, Moderator and Admin, with business membership checked for tenant-owned resources. Never trust role, owner or tenant identifiers sent by the client.

## Response contract

Successful responses use:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed",
  "error": null
}
```

Errors use:

```json
{
  "success": false,
  "data": null,
  "message": null,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Provide a valid email address.",
    "details": []
  }
}
```

The HTTP status communicates transport outcome; the stable application `code` enables clients to handle errors safely. Server responses never leak secrets, stack traces or another tenant's data.

## Core v1 resources

| Domain | Namespace | Core operations |
| --- | --- | --- |
| Authentication | `/auth` | Register, login, refresh, logout and session management |
| Users | `/users` | Read/update current profile, preferences and privacy controls |
| Businesses | `/businesses` | Create, read, update and manage approved business profiles |
| Locations and categories | `/locations`, `/categories` | Countries, cities, location-aware filtering and taxonomy |
| Discovery | `/search` | Keyword/local search across approved public content |
| Offers | `/offers` | List, read, create and update valid business offers |
| Favorites and reviews | `/favorites`, `/reviews` | Save relevant content and submit moderated trust signals |
| Notifications | `/notifications` | List and mark the current user's notifications as read |
| Analytics/events | `/events`, `/analytics` | Privacy-aware event capture and permissioned business metrics |
| Administration | `/admin` | Moderation, approval and system operations for authorized roles |

Canonical endpoint detail is maintained alongside the OpenAPI document; this guide does not invent an endpoint implementation that has not been released.

## Representative operations

| Operation | Method and path | Access | Notes |
| --- | --- | --- | --- |
| Register | `POST /auth/register` | Public, rate-limited | Email/password/account type validated server-side |
| Login | `POST /auth/login` | Public, rate-limited | Returns access/refresh token pair and safe user data |
| Current profile | `GET` / `PATCH /users/me` | Authenticated | Only the account holder, subject to admin support policy |
| Create business | `POST /businesses` | Authenticated | Creates a pending business owned by the caller |
| Find businesses/offers | `GET /businesses`, `GET /offers`, `GET /search` | Public/feature policy | Pagination, filtering and location scope required |
| Create offer | `POST /offers` | Authorized business member | Business ownership/status and offer validation required |
| Save favorite | `POST /offers/{id}/favorite` | Authenticated | Idempotent user-scoped operation |
| Review a business | `POST /reviews` | Authenticated, policy-gated | Moderation and anti-abuse controls apply |
| Business analytics | `GET /analytics/business/{id}` | Authorized business member | Aggregated, tenant-isolated metrics |
| Approve business | `PATCH /admin/businesses/{id}/approve` | Admin/Moderator permission | Audited administrative action |

## Query conventions

Collection endpoints use explicit pagination, filtering and sorting, for example `?page=1&limit=20&cityId=...&categoryId=...&sort=distance`. Limits are bounded by the service. Responses include pagination metadata when a collection is paginated. Search relevance, distance and availability are labeled accurately and are never treated as guarantees.

## Validation, security and reliability

Every endpoint has input validation, authentication where necessary, resource-level authorization, rate limits, structured error handling and request/audit logging appropriate to its risk. Sensitive endpoints use stricter limits and security monitoring. API input is sanitized; passwords are never returned; file uploads use the storage boundary; and non-idempotent future payment/reservation calls require idempotency protection.

## Observability

Log request correlation identifiers, latency, status class, application error code and security events without storing unnecessary personal data. Business-changing and administrative actions write audit entries. Monitor availability, error rate, latency, rate-limit events and abnormal authentication behavior. Analytics events are purpose-limited and consent-aware.

## Webhooks and integrations

Future approved partners can consume versioned event notifications such as business verification, offer lifecycle or payment completion. Webhooks require explicit subscriptions, signed deliveries, retries, idempotent receivers, delivery logs and tenant/permission checks. Payments, maps, AI providers and partner services are integrated through adapters and environment-managed secrets, never directly from application clients.

## Documentation and testing

OpenAPI/Swagger is the machine-readable source for released endpoints, schemas, authentication and examples. Each module supplies validation tests, authorization tests, error examples and API integration tests. Contract changes are reviewed for backwards compatibility and included in a changelog before release.

## Expansion path

The sequence is: Core API → controlled partner API → developer platform → Balkan.works ecosystem. Save Food, Opsnestone, Digital Flyers, Stock Radar, wallet and AI modules publish their own versioned namespaces while sharing Balkan ID, standard response envelopes, events, permissions and feature flags.

## Final vision

The Balkan.works API is the foundation on which client applications, businesses and future partners can safely build without destabilizing the core platform.
