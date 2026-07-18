# Balkan.works Product Requirements Document — MVP

## Product objective

Validate that consumers use Balkan.works to discover valuable local businesses/offers, that businesses publish and measure useful local presence, and that the shared network becomes more useful as active supply and demand grow.

## Roles

| Role | Primary outcome |
| --- | --- |
| Customer | Find local businesses/offers, save useful items and return |
| Business User | Create a profile, publish offers and understand basic outcomes |
| Admin | Protect quality through user/business/content management |

## MVP customer requirements

- Register/login/logout/refresh session using secure email/password identity flow.
- Choose city and optionally a more precise area/location with informed permission.
- View a Home surface with relevant offers/businesses or helpful empty states.
- Search businesses, categories and offers by supported city/category/text filters.
- View business details: name, description, location, category, trust status and offers.
- View offer details: title, description, price, validity, image when available and business.
- Save/remove favorite businesses and offers.
- Manage profile, basic preferences, notification/privacy and security settings.

## MVP business requirements

- Create a business profile with name, category, location, contact, description and logo.
- Update owned business information only.
- Create/manage offers with title, description, price, media reference and expiry.
- View basic aggregate profile/offer activity in the business dashboard.
- See business state clearly: draft, pending review, approved/verified or suspended.

## MVP admin requirements

- View and manage users within controlled administrative permissions.
- Review, approve, reject or suspend businesses with audit entries.
- Moderate offer text/images/descriptions and retain clear decision state.

## Required flows

**Customer:** install/open → register → choose city → discover/search → business/offer detail → save/useful action → return.

**Business:** sign up → create profile → admin review → publish offer → view outcome.

## Non-functional requirements

- Responsive and accessible mobile/web experience, including useful loading, empty and error states.
- Secure auth, authorization, data validation, tenant boundaries, audit logs and minimal data collection.
- Versioned API, database migrations, indexed discovery queries and feature flags.
- Multi-city/country/language readiness through configuration rather than product forks.
- Public web supports business/offer discovery and future SEO; business dashboard remains protected.

## Acceptance criteria

The MVP is accepted only when a customer can find a business and offer, a business can complete approval and publish an offer, a customer can save/react to that offer, relevant activity is recorded, and an admin can manage users/business/content with permissions and auditability.

## Explicit non-goals

Wallet, payments, Marketplace, AI Assistant, Rewards, advanced analytics and Save Food are not MVP release requirements. Their Core extension points may exist, but they are hidden/disabled until their own product, security, operational and legal gates are met.

## Success measures

Track registration/activation/retention, active businesses, fresh offers, dashboard use, search success, offer engagement and moderation/support load. Use these measures to decide whether to iterate, monetize or expand the pilot city.
