# Balkan.works Data Strategy

## Purpose

Data makes Balkan.works useful only when it has a defined purpose, accountable owner, lawful basis, retention limit and access policy. The platform does not collect data merely because it may be useful later.

## Data domains

| Domain | Examples | Use | Access boundary |
| --- | --- | --- | --- |
| User | Profile, preferences, selected location, saved offers | Personalization and account operation | User and authorized Core services |
| Business | Profile, offers, campaigns, operating data | Business tools and analytics | Owning business and authorized services |
| Behavioral | Views, searches, saves, module engagement | Product improvement and recommendation quality | Aggregated/pseudonymized by default |
| Transactions | Reservations, rewards, later payments | Fulfilment, audit and accounting | Strictly role and purpose scoped |
| Market | Aggregated demand, category and local activity | Trend reporting and intelligence | Aggregated and privacy reviewed |

## Event system

Events are versioned, documented and minimal. Initial canonical events are:

```text
USER_REGISTERED
BUSINESS_CREATED
OFFER_CREATED
OFFER_VIEWED
OFFER_SAVED
SEARCH_COMPLETED
FOOD_PACKAGE_RESERVED
NOTIFICATION_OPENED
```

Every event schema declares actor type, purpose, allowed properties, retention, owner and whether consent is required. Never place raw passwords, payment instruments, full private-message content or unnecessary identity data in analytics events.

## Pipeline

`User action → validated event → controlled storage → aggregated analytics → approved insight`

MVP uses PostgreSQL plus a documented event log and operational dashboards. A warehouse, streaming infrastructure and ML pipeline are later upgrades, not default complexity.

## Dashboards

- **Founder:** activated users/businesses, offer supply, engagement, retention and revenue only where applicable.
- **Business:** its own offers, views, activations and campaign performance.
- **City/partner:** aggregated local activity only; never individual user activity.

## Governance and privacy

- Users can understand and control data use relevant to their account.
- Personal data is not sold.
- Aggregation and anonymization are preferred for market reporting.
- Access uses RBAC, purpose limitation, audit logs, encryption, backups and periodic review.
- Retention and deletion flows are defined per domain before a feature goes live.
- Partner reporting is aggregated unless a user has explicitly authorized a necessary relationship.

## AI use

The AI gateway may use only approved, minimum-necessary data. It must record source and purpose, respect consent and permissions, and never turn analytics data into an undisclosed profiling product.

## Delivery checklist

Every feature must answer: What data is created? Which event measures it? Who owns it? Why is it needed? Who can access it? How long is it retained? How is it deleted or anonymized?

## Roadmap

1. Core events, data-quality checks and operational dashboards.
2. Consent-aware recommendations and personalization.
3. Evaluated prediction models and business insights.
4. Advanced aggregated intelligence with privacy and security review.
