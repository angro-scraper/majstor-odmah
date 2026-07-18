# Balkan.works Super App Wireframes

## Purpose

This document maps the approved wireframe intent to the initial modular web implementation. The experience is mobile-first and focuses on local discovery, trust signals and an AI-ready search path rather than a static business directory.

## Implemented route map

| Wireframe | Web route | Current state |
| --- | --- | --- |
| Splash / onboarding | `/onboarding` | Implemented UI |
| Home | `/` | Implemented UI |
| Balkan AI search | `/ai` | Interactive UI with demo recommendations |
| Search results | `/search` | Implemented UI with filters |
| Business profile | `/businesses` | Implemented UI with contact action |
| Favorites | `/favorites` | Implemented UI |
| User profile | `/profile` | Implemented UI |
| Business dashboard | `/dashboard` | Implemented UI |
| Business creation | `/dashboard/business` | Implemented UI |
| Admin dashboard | `/admin` | Implemented UI |

## Reusable components

- Core: `Button`, `Input`, `Card`, `Modal`, `Badge`, `Avatar` and `Tabs`.
- Discovery: `BusinessCard`, `Rating`, `ReviewCard` and `ServiceCard`.
- AI: `AISearchBar`, `AIResponseCard` and `AIRecommendation`.
- Dashboard: `StatCard`, `TrendChart` and `ActivityFeed`.

## Data boundary

The screens currently use clearly scoped local demo data from `apps/web/src/lib/demo-data.ts`. They are presentation and interaction foundations, not evidence that profile, favorites, moderation, analytics or AI data persists. Connect each route to the typed API client only after the database runtime and end-to-end authorization flows are verified.

## Responsive behavior

Consumer routes use a compact bottom navigation on mobile. At desktop width, the navigation becomes a persistent side rail and dashboard cards retain a wider analysis layout.
