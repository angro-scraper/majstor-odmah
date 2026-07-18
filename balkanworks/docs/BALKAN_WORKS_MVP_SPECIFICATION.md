# Balkan.works MVP Specification

## Purpose

Define the first public version of Balkan.works: a focused local platform that proves people want a simple way to find trusted local businesses and businesses value a new channel through which customers can find them.

## MVP principle

Do not build a small version of the whole vision. Build the smallest safe, useful version that proves the local network.

## MVP goal

Within the first pilot period, validate that users find value, businesses join and remain active, and real contacts occur between the two sides. Six-month targets are reviewed by city/team capacity and are not automatic success without activation and retention.

## Directory-first MVP baseline

The release acceptance baseline is deliberately narrow:

| User | Must be able to do |
| --- | --- |
| Customer | register/login/reset access, set profile/location/interests, search and filter businesses, view a complete business profile, contact/save a business and submit an eligible review |
| Business Owner | create and manage an accurate profile, services, images and opening hours; request verification; see basic views, contacts and reviews |
| Admin | review users/businesses/reports, approve/block businesses, moderate reviews and manage categories |

The primary consumer flow is **open → search service → view business → contact business → leave review**. A first-value event is a useful search, business view, saved business or contact. The release is successful only when these actions can be completed reliably and safely.

## In scope

- Balkan ID: secure registration/login/session foundation and user profile.
- Business profiles: ownership, pending/approval lifecycle, accurate local information and media readiness.
- Categories and country/city location context.
- Directory foundation: businesses, services, opening hours, categories, locations, media, verification and trust status.
- Discovery: business/category search with local filters.
- Reviews: moderated ratings/comments and report-handling rules.
- Favorites/following where released.
- Notification foundation: in-app first, controlled future delivery adapters.
- Admin panel: business/user/content moderation and category/location administration.
- Basic analytics/events: product, business and operational metrics.

## Not in scope

Marketplace transactions, wallet, payments, autonomous/advanced AI agents, complex accounting/Opsnestone operations, full Stock Radar, delivery logistics and broad multi-country expansion are later modules. Offers and digital flyers are optional, feature-flagged pilot extensions after the directory-first acceptance baseline is stable; they are not required to claim MVP success.

## MVP users and permissions

| User | Core capability |
| --- | --- |
| Customer | Create account, select location/interests, discover businesses/offers, save/follow eligible content and manage profile/settings |
| Business Owner | Create/manage authorized business profile, add accurate information, create eligible offer/flyer content and see basic permitted activity insight |
| Admin/Moderator | Approve/suspend businesses, moderate content/reports, manage taxonomy/location and review audit-relevant actions |

All actions use Balkan ID, resource-level permissions and tenant isolation. A role label alone does not grant access to unrelated business/user data.

## Core consumer flow

`Open → see local value → register when needed → select location/interests → search/explore → business/offer detail → save/contact/follow → return`

### Core screens

1. Splash/session check
2. Login/register
3. Location/interests onboarding
4. Home: greeting, universal search, categories and popular/relevant businesses
5. Search: businesses/categories with location/category filters
6. Business page: logo, name, description, category, location, hours, services, contact, trust status, media and reviews
7. Saved: favorite businesses
8. Profile: personal data, interests, notifications and settings

The exact web/mobile navigation may differ, but the capabilities and accessible loading/error states remain consistent.

## Business experience

### Dashboard

Show profile completeness, approval/verification status, active/current offers, basic eligible profile/offer activity and the next best onboarding action.

### Profile management

Required business information: name, category, address/location, phone/contact, opening hours, description, services and authorized images/links. The owner approves content; verification is a documented review process, not an automatic label.

### Offer/flyer creation

Offers and digital flyers are feature-flagged extensions, not directory-first MVP requirements. When enabled, they use business ownership, media, validity and moderation rules. No offer is public unless its business/status/content passes the current eligibility policy.

## Admin MVP

Admin/Moderator functions include user/business lookup, business approval/rejection/suspension, content/offer review, report handling, category/location management, basic platform metrics, audit logs and feature-flag/configuration controls within permission scope. Privileged actions are logged and require stronger security controls before production use.

## MVP data model

Core entities are User/Profile, Business/BusinessLocation/Service/BusinessImage, Country/City/Category, Favorite, Review, ContactEvent/BusinessView, Notification, Event/SearchQuery, Role/Permission, AuditLog and File. Offer and Subscription are available for feature-flagged extensions. The Prisma schema is the executable source for fields/relations; documentation does not replace migrations or data validation.

## MVP API direction

Versioned REST endpoints under `/api/v1` provide authentication, password-reset flow, current-user profile, businesses/services/media, locations/categories, reviews, favorites, search, notifications/events and admin operations. Offer endpoints remain feature-flagged. Every released endpoint has DTO validation, authorization, error envelope, documentation and tests. Exact paths/schemas are governed by the API contract/OpenAPI documentation.

## Required MVP events

Track purpose-limited, documented events: `USER_REGISTERED`, `BUSINESS_CREATED`, `SEARCH_PERFORMED`, `BUSINESS_VIEWED`, `CONTACT_CLICKED`, `FAVORITE_CREATED`, `REVIEW_SUBMITTED` and eligible verification/moderation actions. Event collection follows privacy, tenant isolation and data-quality rules.

## Monetization test

The first paid tests may be optional premium business visibility, additional eligible offer capacity or transparent sponsored placement. They launch only after free activation/value, pricing/entitlements, legal/billing/support controls and measurement are ready. Do not block the MVP local network behind a paywall or sell unreleased features.

## Success metrics

| Audience | Evidence |
| --- | --- |
| Users | Activated users, successful searches/connections, saves/contacts and retention |
| Businesses | Active quality profiles, current offers, first-value/customer interest and retention |
| Engagement | Eligible offer/business views and successful local actions |
| Revenue | Value-led premium interest/recognized revenue only when monetization is live |
| Trust/operations | Accurate content, support/moderation health, security/reliability signals |

## Development order

1. Backend/project environment and database migration path.
2. Authentication and users.
3. Business/location/category/service/media module.
4. Discovery/search and contact actions.
5. Reviews, verification and moderation.
6. Consumer/business UI flows and basic dashboard.
7. Event analytics/notifications.
8. Quality, security, deployment and controlled pilot launch.
9. Optional offers/flyers only after the directory-first baseline is proven.

## Launch strategy

Launch one city, not the whole Balkans. A directional pilot target is 1,000 activated users and 100 active quality businesses, calibrated to supply quality and operations. The launch gate is a useful, stable and supportable local experience — not just a count.

## After MVP

Once the local core is validated, consider Save Food, rewards, grounded AI recommendations and Opsnestone integration in the order established by the Module Roadmap. Every module reuses Balkan ID, shared permissions, events, design/API contracts and feature flags.

## Final MVP definition

Balkan.works MVP succeeds when a person can reliably find and contact a trusted local business, and that business can see a real, measured reason to remain active.
