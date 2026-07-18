# Balkan.works platform blueprint

## Product boundary

`balkan.works` is the platform shell, not a single vertical product. It owns the shared experience: identity, profile, location, language, notifications, trust signals and navigation. Individual products remain modules with their own domains and release cadence.

## Module registry

The machine-readable registry is [`platform-modules.json`](../platform-modules.json). The current shell exposes the following module boundaries:

| Module | Phase | Current state | Boundary |
| --- | --- | --- | --- |
| Core Platform | 1 | Foundation | Accounts, profiles, location, language, notification and trust contracts |
| Market | 1 | Active | Local services, jobs, providers, city search and ratings |
| Deals | 1 | Active | Catalogues, offers, partner profiles and product discovery |
| Save Food | 2 | Planned | A dedicated integration with `sacuvaj-hranu.rs` |
| Business | 2 | Planned | A dedicated integration with `Opsnestone.com` |
| Money | 3 | Planned | Education and tools via `Stock-radar.com`; no transfers in MVP |

## MVP scope

The MVP is limited to user and business profiles, location, basic marketplace services, digital catalogues/deals, ratings and module navigation. Payments, wallet functions, QR pickup and inventory synchronization must not appear as live features before their source integrations and compliance requirements are ready.

## Target architecture

```text
React Native apps ─┐
React web app ────┼──> Core API (Node.js / NestJS) ──> PostgreSQL
Module web views ─┘                 │                     │
                                  Redis                S3 storage
                                    │
                  OAuth2/JWT · OpenStreetMap/Google Maps · FCM
                                    │
          Save Food API · Opsnestone API · Stock Radar API
```

The current Render prototype is a lightweight Node.js web shell. It validates the navigation, module boundaries and existing Market/Deals flows. It is not yet the production React/NestJS service split.

## Service rules

1. Each module owns its business data and API namespace.
2. Core owns identity and authorization; modules consume a verified user identity rather than maintaining duplicate accounts.
3. Cross-module communication happens through versioned REST/GraphQL contracts or events, never direct database table access.
4. Integrations are behind adapters. A failure in Save Food, Opsnestone or Stock Radar must not take down Core, Market or Deals.
5. Payments require a separately approved licensed payment design and are not part of phase 1 or phase 2 data flows.

## Next implementation order

1. Extract core identity/profile/location/rating tables into the shared PostgreSQL schema.
2. Create `market-api` and `deals-api` namespaces with module-scoped roles.
3. Make Deals catalogues and favourites persistent.
4. Agree and implement the first Save Food API contract before displaying live food inventory in Balkan.works.
