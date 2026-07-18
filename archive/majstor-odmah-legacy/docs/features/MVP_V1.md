# FEATURE: MVP v1.0

## Goal and users

Validate the Balkan.works network with consumers, local businesses, digital offers and Save Food. Customers register, set location, browse offers/flyers, save favorites and reserve food packages. Business owners create profiles, offers, flyers and food packages. Admins verify businesses and moderate content.

## Database scope

Core: users, profiles, roles, countries, cities. Business: businesses and categories. Offers: offers, categories and favorites. Save Food: food packages and reservations. System: notifications, reviews and audit logs.

## API scope

Auth, users/profile, businesses, offers, favorites, save-food, notifications and admin endpoints are MVP release surfaces. API routing remains version-ready.

## UI scope

Consumer: splash, auth, onboarding, Home, Explore, offer detail, Save Food, reservation, favorites and profile. Business: login, dashboard, profile, offers, offer creation, Save Food management and analytics. Admin: dashboard, users, businesses and reports.

## Feature gate

Enabled: identity, location, businesses, offers/deals, flyers, Save Food, favorites, notifications, verification and moderation.

Disabled: Wallet, payments, marketplace, jobs, AI Assistant, Health, Auto, Real Estate and unapproved connectors. Disabled modules remain in code only as future foundations; they are not exposed in MVP navigation.

## Validation

MVP success is measured by registrations, daily active users, active businesses, published offers, offer views, reservations and returning users.
