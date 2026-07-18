# Partner ecosystem foundation

The MVP exposes a controlled foundation for banks, telecoms, retailers, food organisations, cities, education providers, logistics and technology partners.

## Admin endpoints

All routes below require an authenticated `ADMIN` or `SUPER_ADMIN` account.

- `GET /api/v1/partners` — list partners and operational counts.
- `POST /api/v1/partners` — create a partner profile with a category, tier and lifecycle status.
- `PATCH /api/v1/partners/:id` — update partner data or progress from prospect to pilot/active.
- `POST /api/v1/partners/:id/integrations` — record an integration and its non-sensitive scopes.
- `POST /api/v1/partners/:id/api-keys` — issue a secret API key. The raw key is returned exactly once and only its SHA-256 hash is stored.

## Partner API

Active partners can call `GET /api/v1/partner/v1/me` with:

```http
X-Partner-Api-Key: bwpk_live_...
```

The endpoint returns the partner profile, registered integrations and aggregated API-usage metrics. It never returns platform users, credentials or business-private data.

API keys can be scoped, expire, and later be revoked. Each accepted request updates `last_used_at` and writes a `partner_api_requests` record; administrative actions additionally write to the central audit log.

## Deliberately deferred

Payments, wallet access, customer data sharing, partner webhooks and data exports require separate contracts, consent flows and security reviews. They are not enabled by this foundation.
