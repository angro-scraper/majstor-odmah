# Balkan.works Frontend Implementation Plan

## Scope

Build three related TypeScript interfaces: consumer mobile (React Native), public web/SEO (Next.js) and protected Business/Admin surfaces. They share design tokens, components, API contracts and accessibility standards without becoming one inseparable codebase.

## Architecture

`UI screens → reusable components/patterns → feature state/hooks → API client → versioned backend`

Shared packages own tokens, Button/Card/Input/Modal/Avatar/Badge/Toast, types, configuration and API client behavior. Feature code owns domain screens, loading/error/empty states and permitted data mutations. UI components never embed business rules or raw API fetch logic.

## Consumer MVP

1. Splash/session check.
2. Onboarding and location selection; show value before forcing registration where possible.
3. Login/register.
4. Home with relevant local offers/businesses and helpful empty states.
5. Search with text, category and location filters.
6. Business detail.
7. Offer detail.
8. Saved businesses/offers.
9. Profile/settings.

The canonical mobile bottom navigation is: **Home · Search · Offers · Saved · Profile**.

## Web, Business and Admin

Public web supports discoverable business/offer pages, responsive search and SEO-ready rendering. Business Dashboard supports profile editing, media/information management, offer management and authorized aggregate analytics. Admin supports operational users/businesses/activity views and moderation; it is protected by elevated access and audit controls.

## State and API integration

Server state uses a centralized typed API client with cache/invalidation, request cancellation and standardized response/error handling. Global client state is limited to session, current user, location and lightweight UI preferences; feature data remains query-driven. Auth/session logic is never duplicated across screens.

## UX and performance requirements

- Clear human errors with retry paths, not technical codes.
- Skeleton/progress states, optimistic updates only when safe and reversible.
- Responsive layouts for phone, tablet and desktop.
- Image sizing/optimization, virtualized lists where needed and bounded cached data.
- Keyboard/screen-reader support, touch targets, contrast and scalable text.
- Future offline cache of recent offers only after data freshness/privacy behavior is defined.

## Test and delivery phases

**Phase 1:** auth, Home, search, business/offer detail and saved items.

**Phase 2:** Business Dashboard and authorized analytics.

**Phase 3:** AI, Marketplace and Wallet only as their Core/API/security modules activate.

Each phase includes component tests, API integration tests and critical user-flow E2E tests. A screen is complete only when its loading, empty, error, unauthorized and accessible states are implemented.
