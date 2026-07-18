# Business Platform — Sprint 03

Business owners have a single digital identity consisting of the profile, locations, services, offers, flyers, Save Food packages, verification status and analytics.

## Delivered API foundation

- `POST/PATCH /api/v1/businesses` accepts cover imagery, opening hours and validated social-link metadata.
- `POST/DELETE /api/v1/businesses/:id/follow` and `GET /api/v1/businesses/following` provide persistent customer follows.
- `POST/PATCH /api/v1/flyers` accepts up to 50 ordered flyer pages. Replacing pages is atomic with the flyer update.
- `GET /api/v1/analytics/businesses/:id` now includes followers, active Save Food packages and completed/current food reservations alongside existing views, contacts, offers and flyer metrics.

## Commercial foundation

The existing `subscriptions` table remains the stable plan assignment foundation (`FREE`, `BUSINESS`, `PREMIUM` values are application-level plan codes). Payment processing remains intentionally outside this sprint and is isolated by the payment architecture.

## Security and data integrity

- A business owner can only mutate their own profile or flyers.
- Users can only follow verified public businesses.
- Business follows use a composite primary key, preventing duplicates.
- Flyer page order is unique per flyer and validated at the API boundary.
