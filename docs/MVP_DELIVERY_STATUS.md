# Balkan.works MVP delivery status

Updated: 18 July 2026

## Delivered now

- **Balkan ID:** email registration, login, JWT protection, rotating refresh sessions and logout.
- **Customer experience:** public search, category and location discovery, business profiles, contact/view events, favorites, moderated reviews and notification inbox.
- **Business experience:** owned business CRUD, services, offers, profile-completion score, AI-style business coach guidance and performance metrics.
- **Admin operations:** overview, user/business/review queues, business verification and review moderation with audit records.
- **Discovery and growth:** canonical business slugs, crawlable city/category pages, JSON-LD `LocalBusiness` metadata and search-event capture.
- **AI foundation:** intent-aware AI search endpoint backed by the verified local-business index.

## Verified in this workspace

```text
services/api: Nest build       PASS
apps/web: TypeScript check     PASS
services/api: Jest             PASS (1 suite, 1 test)
```

## Deliberately deferred behind the MVP boundary

- Marketplace transactions, wallet/payments, Save Food reservations, jobs, rewards and autonomous AI actions.
- These require separate product validation, compliance and operational controls; their data/API extension points are not treated as live MVP features.

## Operational next action

The repository contains pre-existing uncommitted frontend changes. Review and separate them before a production commit/deploy so unrelated work is not published accidentally.
