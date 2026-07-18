# Balkan.works Analytics & Data Strategy

## Purpose

Turn validated product activity into better user experiences, better business decisions and measured recommendations — never collect data without a clear purpose or turn personal data into a product for sale.

## Architecture

`Applications → validated event tracking → controlled pipeline → operational analytics → future warehouse/AI insights`

MVP events live in the Core data model and operational dashboards. A warehouse, streaming pipeline and ML workloads are future upgrades based on demonstrated volume and query needs.

## Core event taxonomy

```text
USER_REGISTERED       USER_LOGIN
BUSINESS_CREATED      BUSINESS_VIEWED
OFFER_CREATED         OFFER_VIEWED         OFFER_SAVED
SEARCH_PERFORMED      FOOD_PACKAGE_RESERVED
NOTIFICATION_OPENED
```

Every event carries an event type, timestamp, optional actor/business/offer IDs and minimum metadata. Event schemas are versioned, documented and validated; sensitive personal information, passwords, private message contents and payment instruments are forbidden in metadata.

## Metrics

| Audience | Decision metrics |
| --- | --- |
| Product/Growth | acquisition source, activation, search success, engagement and retention |
| Business | profile/offer views, saved offers, customer actions and campaign outcomes |
| Platform | active users/businesses, offer freshness, supply/demand balance and city health |
| Operations | errors, notification performance, moderation/support burden and data quality |

Dashboards show only data appropriate to the audience and tenant. A business sees its own aggregate performance; partners/cities see privacy-reviewed aggregates; platform operators access data through audited roles.

## Reporting cadence

- Daily: operational anomalies, errors, supply freshness and support needs.
- Weekly: product usage, experiments, business activation and retention signals.
- Monthly: strategy, unit economics, roadmap evidence and investor reporting using verified data.

## Experimentation

Every experiment defines a hypothesis, population, success metric, guardrail metric, duration and owner before launch. Feature flags provide controlled rollout and rollback. Do not A/B test safety, core privacy rights or misleading pricing behavior.

## Data quality and governance

Events need ownership, completeness checks, consistent naming, a retention period and a documented purpose. Data issues are tracked and corrected at source; dashboards disclose meaningful limitations. Analytics follows the platform Data Strategy and Security & Privacy Strategy, including consent, minimization, audit trails and deletion/retention controls.

## AI relationship

Analytics can support recommendation, personalization and business intelligence only through the permissioned AI Gateway. Model quality is measured against useful outcomes, accuracy, bias/quality checks and user overrides — not volume of generated output.

## Future data products

Only aggregated, privacy-reviewed market trends and business insights may become products. No personal user data, tenant-confidential data or undisclosed profiling is commercialized.
