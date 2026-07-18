# Sprint 01–02 completion

## Foundation

- pnpm workspace with web, API, database and Expo mobile application foundations
- Docker/Render deployment configuration, environment examples and GitHub CI
- Prisma migrations and seeds for the shared platform data model
- JWT access and rotating refresh-token sessions; passwords are bcrypt hashed
- API documentation available at `/api/docs`

## Core platform

- Balkan ID exposes a common profile, roles, user type, verification state and last-login audit field.
- The central location engine supports countries, cities, and one primary GPS/city location per user at `PUT /api/v1/users/location`.
- Profiles keep preferences, interests, locale and date of birth in a normalized, access-controlled structure.
- Businesses, categories, verification, feature flags, in-app notifications and audit logs remain shared core services.

## Compatibility

The identity additions are additive. Existing accounts retain their profiles and default to `CONSUMER` until a business or admin flow assigns a different type.
