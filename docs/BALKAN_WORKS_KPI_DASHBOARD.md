# Balkan.works KPI Dashboard

## Purpose

Define the small set of metrics that measure platform health and drive decisions about growth, quality, retention and revenue. A dashboard is useful only when a metric has an owner, definition, source and action.

## North Star metric

**Successful Connections** — verified or reasonably evidenced value-creating connections between a user and a relevant local business.

Eligible examples include an eligible business/offer view that meets quality criteria, contact intent, website/call/navigation click, saved business/offer, reservation or completed purchase when those modules exist. The definition must distinguish a passive impression from a meaningful action, avoid double-counting and be versioned as the product evolves.

## KPI framework

`Acquisition → activation → engagement → retention → revenue`

All metrics are segmented by city, category, acquisition source, user/business cohort and time period where statistically/operationally useful. Show date range, timezone, denominator, event/source freshness and known limitations on every dashboard.

## Acquisition

| Metric | Definition | Decision use |
| --- | --- | --- |
| New users | New valid accounts in period | Channel/product reach, not success alone |
| New businesses | New qualified business signups in period | Supply pipeline |
| Traffic | Unique eligible visitors/sessions by source | Content/channel health |
| Organic traffic | Attributed search-engine visits | SEO/local-discovery quality |
| Referral traffic | Attributed shared/invited visits | Referral/partner loop quality |
| CPA/CAC | Attributable acquisition cost per activated user/business, not raw signup | Spend efficiency |

## Activation

Activation means a new participant reaches an initial value moment within a defined window.

| Metric | Example event |
| --- | --- |
| First search | User performs an eligible search |
| First business/offer view | User opens a relevant eligible result |
| First favorite | User saves a business/offer |
| First contact | User starts an approved contact/navigation/website action |
| Activation rate | Activated new cohort ÷ eligible new cohort |
| Business first-value rate | Activated businesses with first profile/offer customer-interest signal ÷ activated businesses |

The activation event can differ by audience but must be stable within a cohort comparison.

## Engagement and retention

| Metric | Definition | Caution |
| --- | --- | --- |
| Searches per active user | Eligible searches ÷ active users | Interpret with search-success rate; more searches can mean poor results |
| Profile/offer views | Unique eligible views | Filter bot/internal traffic and duplicate events |
| Favorites/reviews/contacts | User intent actions under current policy | Review/contacts require trust/moderation context |
| Session frequency | Active sessions per eligible user | Not a proxy for value on its own |
| DAU/WAU/MAU | Users with a defined meaningful active event per period | Use consistent active-event definition |
| Retention 30/90 | Original cohort with meaningful activity at day 30/90 ÷ cohort | Report cohort and reactivation rules |
| Churn | Previously active/paid users or businesses no longer active in period ÷ starting eligible base | Define separately for users and businesses |

Retention is the main product-quality signal. Acquisition growth with weak activation/retention triggers investigation before additional spend.

## Business network health

| Metric | Definition |
| --- | --- |
| Active businesses | Quality-complete business profiles with recent owner/system activity under defined criteria |
| Verification completion | Eligible businesses completing documented verification ÷ eligible businesses |
| Profile completion rate | Required complete fields/items ÷ expected fields/items, with quality checks |
| Current offers | Eligible active/non-expired offers by business/city/category |
| Leads/customer interest | Authorized contacts/actions attributable to business discovery |
| Business retention | Previously active businesses remaining active/current in a defined cohort |
| Supply density | Active relevant businesses/offers per target locality/category demand signal |

Business metrics are tenant-isolated. Dashboard reporting does not expose another business's confidential performance.

## Revenue and transaction metrics

Activate these only after the matching products are live and reconciled.

| Metric | Definition |
| --- | --- |
| MRR / ARR | Recognized recurring subscription revenue, monthly/annualized |
| ARPA | Average recognized recurring revenue per paying business/account |
| Premium conversion | Eligible free businesses becoming paying subscribers ÷ eligible free businesses |
| Gross margin | Revenue less direct service delivery cost |
| CAC / LTV | Documented acquisition cost and cohort-based lifetime-value methodology |
| Orders/bookings/GMV | Completed eligible transactions/reservations and gross merchandise value, where applicable |
| Transaction conversion | Eligible product view or checkout start → completed transaction, with chosen denominator |

Financial definitions require finance/accounting ownership; do not present pipeline, clicks or uncollected amounts as revenue.

## Content, sales and AI metrics

**Content:** indexed eligible pages, organic qualified visits, freshness rate, local guide performance and search visibility measured through approved tools. Do not optimize search ranking at the expense of accurate local content.

**Sales:** qualified outreach, conversations/demos, registrations, active profile activations, activation conversion, time to activation and retained business outcome. This measures process quality, not outreach volume alone.

**AI (future):** eligible AI searches, recommendation click/acceptance rate, grounded task success, user satisfaction, dismiss/override rate, latency/cost, safety reports and incremental conversion versus non-AI baseline. AI metrics are privacy-aware and never justify opaque personalization.

## Dashboard views

### Executive dashboard

Keep it focused: Successful Connections, MAU/retention, active businesses/current offers, business first value/leads, recognized revenue when active and premium conversion when active. Include trends, city segmentation and a short explanation of what changed.

### Early-stage dashboard

For the first year, emphasize active quality businesses, activated users, successful searches, profile/offer actions, contacts, retention, support/moderation issues and supply freshness. This is more actionable than a dense finance or AI dashboard before those systems are live.

## Data quality and governance

Events are validated, deduplicated where needed, consent/purpose aware and documented in the analytics taxonomy. Internal/test/bot traffic is labeled/excluded. Dashboard access follows role and tenant permissions. Metrics are reconciled after schema changes and anomalies are annotated, not silently overwritten.

## Decision rules and anti-vanity guardrails

- Registrations without activation are a funnel problem, not growth success.
- Business counts without quality/current profiles are not usable supply.
- Traffic without successful connections is not product-market evidence.
- Revenue without retention/margin can hide an unsustainable model.
- If a metric does not inform a decision, remove it from the primary dashboard.

## Final principle

Measure what changes decisions. The KPI dashboard exists to make Balkan.works more useful, trusted and sustainable — not to make activity look bigger than it is.
