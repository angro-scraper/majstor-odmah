# Super App Ecosystem

Sprint 11 extends the shared Balkan.works core; it does not create separate applications or identities.

## Shared architecture

Every module uses the existing user, business, location, wallet, AI, analytics, audit, and feature-flag layers. The `EcosystemModule` exposes a single registry (`GET /api/v1/ecosystem/modules`) so web, mobile, and future partners render the same enabled capabilities.

## Implemented module foundations

- Health: private profile preferences and reminders only; clinical data and diagnosis are deliberately out of scope.
- Auto: vehicles plus service, registration, and insurance reminders.
- Travel, real estate, and education: shared discovery entities scoped to city/business.
- Events: local event discovery by city.
- Community: groups and membership foundation.
- Balkan Card: one membership card per user.
- Identity graph: `user_module_preferences` stores explicit user-controlled module affinity, never inferred sensitive data.

## Feature flags

`HEALTH_ENABLED`, `AUTO_ENABLED`, `TRAVEL_ENABLED`, `REAL_ESTATE_ENABLED`, `EDUCATION_ENABLED`, `EVENTS_ENABLED`, `COMMUNITY_ENABLED`, and `BALKAN_CARD_ENABLED` are independent. Disabled module endpoints return `FEATURE_DISABLED` and remain invisible to the ecosystem home response.

## API

Public discovery routes:

- `GET /api/v1/ecosystem/modules`
- `GET /api/v1/ecosystem/events`
- `GET /api/v1/ecosystem/travel/experiences`
- `GET /api/v1/ecosystem/real-estate/listings`
- `GET /api/v1/ecosystem/education/courses`
- `GET /api/v1/ecosystem/community/groups`

Authenticated identity routes include `/ecosystem/home`, `/ecosystem/preferences`, `/ecosystem/balkan-card`, `/ecosystem/health/*`, `/ecosystem/auto/*`, and community membership actions.
