# Balkan.works Mobile App Specification

## Vision

A fast, simple, local and daily-useful iOS/Android experience for discovering nearby businesses, offers and later services. Location improves relevance but is always optional and user-controlled.

## Product principles

- **Value before registration:** show public local value before asking for an account where possible; require identity only for saved items and account actions.
- **Location first:** use explicit city/area choice with optional device location permission and a manual fallback.
- **Fast discovery:** the central action is finding something useful nearby.

## MVP application structure

`Authentication · Home · Search · Business detail · Offer detail · Saved · Profile · Notifications`

The user journey is: open → choose location → Home → explore/search → business or offer → meaningful action. The bottom navigation is **Home · Search · Offers · Saved · Profile**.

## Screens

1. **Splash:** brand and safe session/bootstrap check.
2. **Onboarding:** concise value statement and privacy-aware location introduction.
3. **Location setup:** city/area, automatic location only after permission.
4. **Login/register:** email/password; future OAuth only after secure provider implementation.
5. **Home:** current location, profile entry, universal search, recommended/popular/nearby/new offer sections with useful empty states.
6. **Search:** text, category/location filters; distance/rating/open-now filters activate only when verified data exists.
7. **Business profile:** logo, name/category, description, contact, location, active offers/media and save/call/navigation actions.
8. **Offer detail:** title, image, description, price, validity, business and save/share/contact actions.
9. **Saved:** businesses and offers saved by the current user.
10. **Profile:** account data, notification/privacy/security settings and eligible history.

## Notifications and media

Support opt-in offer, followed-business and system notifications with per-type/frequency settings. Push delivery needs a provider token lifecycle, consent state and fallback in-app notification record. Profile/business media and QR/camera flows are future additions behind secure upload, privacy and permission controls.

## Location, maps and offline

Location supports local ranking, distance and future map display. Maps, routing and event pins are later integrations with provider/privacy review. Offline behavior begins with carefully scoped caching of recent public results and clear freshness indicators; it never exposes private data from a shared device.

## Security and performance

Use platform secure storage for tokens, protected session refresh/logout behavior and later biometric re-authentication where appropriate. Optimize startup, image delivery, list rendering and network retries. Do not log secrets or personal data in mobile diagnostics.

## Measurement and release

Track app opens, location selection, search, business/offer views, saved actions and return usage under the Analytics/Data Strategy. Release follows development → automated/manual testing → beta → store review → production. Store readiness includes icon, screenshots, listing copy, privacy disclosures, support contact and current platform policies.

## Deferred features

AI assistant, Wallet, loyalty, QR payments and Marketplace require their independent product/security/operational gates and must remain hidden until enabled.
