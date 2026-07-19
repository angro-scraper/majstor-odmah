# Regional Expansion Foundation

Sprint 10 keeps one Balkan.works core while making country-specific data explicit.

## Data model

- `countries` stores the country code, default language, timezone, active state, and default currency.
- `currencies` provides the platform currency catalog; exchange rates are reference data, not a payment quote.
- `translations` supports CMS-managed copy by locale and optional country scope.
- `admin_scopes` delegates country and city administration. Only a `SUPER_ADMIN` can assign a scope.
- Existing `business_locations` already supports a single business with locations in multiple countries.

## Public API

All routes are under `/api/v1`:

- `GET /countries`
- `GET /currencies`
- `GET /languages`
- `GET /translations?language=sr&countryId=<uuid>`
- `GET /search/regional?countryCode=HR&query=restoran`

Existing `/locations/*` and `/search` routes remain backward-compatible.

## Administration

- `GET /admin/regional/overview`
- `GET /admin/regional/scopes?userId=<uuid>`
- `POST /admin/regional/scopes`

The scope creation endpoint requires an authenticated `SUPER_ADMIN`; it is recorded in `audit_logs`.

## Frontend

The public header has country and language preferences. Country choice is stored locally; data-bearing screens must pass the chosen country as an API query parameter. `formatCurrency` in `lib/regional.ts` standardizes regional currency formatting.
