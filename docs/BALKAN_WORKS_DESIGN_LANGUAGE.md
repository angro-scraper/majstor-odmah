# Balkan.works Design Language

## Vision

**A digital city in your pocket:** modern, calm and locally useful. Technology stays in the background; people see a clear next action, trustworthy local information and a consistent product across every module.

## Principles

- **Simple first:** reveal advanced options only when useful.
- **Human first:** clear language, visible outcomes and no unexplained technical states.
- **One ecosystem:** Core and modules share the same components, spacing, navigation and trust patterns.
- **Trust by design:** verification, ratings, location, price and validity appear where decisions are made.

## Foundations

The canonical base tokens are Balkan Navy `#0F172A`, Balkan Green `#16A34A`, Balkan Orange `#F97316`, background `#F8FAFC`, cards `#FFFFFF`, primary text `#111827` and secondary text `#64748B`. Use a modern sans-serif typeface (Inter first), an 8px-based rhythm and the standard spacing scale: 4, 8, 16, 24, 32 and 48px.

## Module identity

Core uses Balkan Navy. Save Food uses green; Deals/Flyers orange; Services blue; Jobs purple; Money emerald; AI uses a restrained dark gradient. Module accents must never replace the Core hierarchy, navigation, component shapes or accessibility rules.

## Component contract

All product surfaces use shared, documented components:

- Primary, secondary and danger buttons.
- Inputs, forms, search, modal, toast, badge and avatar.
- Business, offer, map and module cards.
- Web sidebar and mobile bottom navigation.

Cards present a visual, title, short context and an explicit next action. Business cards show logo, category, location and verified/trust status. Offer cards show image, price, discount and validity. No feature may create a duplicate component when an existing pattern can be extended.

## Navigation

Mobile navigation is stable: **Home**, **Explore**, **Offers**, **Business**, **Profile**. Web/business uses a predictable sidebar: Dashboard, Offers, Analytics and Settings. A user sees only active and eligible modules; the navigation does not become a list of every future product.

## Content and interaction

Use real, permissioned local business/product imagery when available; avoid generic stock imagery. Motion is short and useful, reserved for transitions, confirmations and feedback. AI should look like helpful recommendations, not a robot persona.

Every empty state gives a clear explanation and next step. Every status has accessible text, not color alone. Dark mode, keyboard navigation, screen-reader labels, scalable text and WCAG-aware contrast are requirements from the first implementation.

## Implementation rule

`Design tokens → shared components → reusable patterns → screens → modules`

Codex must use the shared package under `packages/ui`, extend tokens deliberately and avoid page-specific visual systems. Any design addition updates tokens/components/pattern documentation before it is used by a new module.
