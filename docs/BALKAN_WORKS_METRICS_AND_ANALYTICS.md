# Balkan.works Metrics & Analytics System

## Purpose

Define a measurement system for evidence-led decisions. The objective is not merely to count growth, but to understand whether that growth creates meaningful local value.

## Principle and North Star

The central question is: **does Balkan.works successfully connect people to the right local business?**

The North Star metric is **Successful Connections**: confirmed high-intent actions between a person and business, such as a call, message, service request, booking or purchase. Its exact event definition, attribution window and deduplication rules must be versioned before reporting. Profile views, clicks and registrations are supporting signals, not substitutes for outcomes.

```text
Successful connections
  ├─ user growth and activation
  ├─ active, quality business supply
  ├─ product relevance and retention
  ├─ revenue and unit economics
  └─ repeatable market expansion
```

## Core metric groups

| Area | Metrics | Decision supported |
| --- | --- | --- |
| User acquisition | new users, source, acquisition cost | which channels create quality demand? |
| Activation | first search, first business view, first contact | do people reach value quickly? |
| Engagement | active days, searches, views, favorites | is local discovery useful? |
| Retention | weekly/monthly active users, cohort return | do users have a reason to return? |
| Business supply | new, active and verified businesses | is supply sufficiently dense and trusted? |
| Business value | profile quality, views, clicks, qualified leads | do businesses receive outcomes? |
| Revenue | MRR, ARR, ARPU, premium conversion | is monetization value-led? |
| Unit economics | CAC, LTV, payback period, margin | can growth become sustainable? |

## Event tracking contract

Track events only when they have a defined product, operational or analytical purpose. Core events include:

- **User:** `signup`, `search`, `view_business`, `contact_business`, `favorite`, `review`.
- **Business:** `create_profile`, `update_profile`, `receive_lead`, `upgrade_plan`.
- **Outcome:** `booking_created`, `purchase_completed` or other future connection events only when their source of truth is defined.

Each event needs an event name/version, timestamp, actor/context policy, entity reference, approved metadata schema, owner, retention rule and privacy review. Do not collect sensitive data or unrestricted free-form payloads merely because they might be useful later.

## Funnel analysis

Analyze the journey as:

```text
Visit → Search → Business view → Contact → Successful connection
```

Segment carefully by city, category, acquisition source and cohort only when samples are sufficient and privacy requirements are preserved. Use funnel drop-off to guide interviews and product experiments, not to assume causality.

## Dashboards

- **CEO:** Successful Connections, active users/businesses, retention, revenue, runway and material risk signals.
- **Product:** activation funnel, feature usage, errors, feedback and cohorts.
- **Sales:** qualified leads, pipeline conversion, activation, premium conversion and revenue.
- **Marketing:** channel quality, campaign efficiency, SEO and referral contribution.
- **AI (future):** retrieval/recommendation quality, helpfulness, safety signals and connection impact.

Dashboards must state their data freshness, metric definitions and known limitations. Source data remains access-controlled.

## Experiment framework

Every experiment specifies a hypothesis, change, target metric, guardrail, population/time window and decision rule. Record the result and learning, including negative results. Avoid optimizing one local metric (for example clicks) at the expense of trust, retention or successful connections.

## Data quality and review cadence

Metrics must be accurate, complete enough for their decision and timely. Monitor event loss, schema changes, duplicate records and dashboard freshness. Weekly reviews ask whether we are growing in meaningful use, providing value to businesses and monetizing without degrading trust.

## Mistakes to avoid

- Vanity registrations without activation or retention.
- Optimizing clicks while reducing successful connections.
- Adding metrics without a decision owner or action.
- Treating correlation as proof of causation.

## Final principle

Data does not replace judgment. It makes judgment more disciplined when metrics are defined, trustworthy and connected to real user and business outcomes.
