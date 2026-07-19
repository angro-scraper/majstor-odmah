# Sprint 15 — Launch & Growth Operating System

## Pilot decision

**Configured pilot:** Beograd, Serbia (`LAUNCH_PILOT_CITY=Beograd`). This is a configuration decision, not a claim that the city is live. The authoritative release signal is the protected API scorecard at `GET /api/v1/operations/launch/readiness`.

The scorecard evaluates the exact public-launch gates defined for this sprint:

| Gate | Target | Source of truth |
| --- | ---: | --- |
| Active local businesses | 500 | verified, non-deleted business profiles with a live Beograd location |
| Registered local users | 50,000 | non-deleted users with a Beograd location |
| Active local offers | 1,000 | current, non-expired offers connected to a Beograd business |
| Verified business rate | 60% | verified businesses ÷ active local businesses |

The targets are environment-configurable in `.env.example`. A missing pilot city returns `BLOCKED`; an unmet gate returns `NOT_READY`. No dashboard, campaign or marketing page may state that a launch is live until every required gate is met and the operational release review is signed off.

## Launch sequence

1. **Prepare supply.** The local business team prioritizes food (bakeries, restaurants, markets), services (repair, salons, trades) and local retail. Every profile must pass the existing onboarding score, have correct contact/location data and have a current offer where applicable.
2. **Run a controlled cohort.** Invite a bounded local group through approved partners, referrals and community ambassadors. Record feedback, support load, search success and content gaps before buying reach.
3. **Review readiness daily.** Admins use `/operations/daily-brief`, `/operations/cities/readiness` and `/operations/launch/readiness`. Resolve moderation, offer freshness and support issues before expanding the cohort.
4. **Open the local public launch.** Only after the scorecard passes, monitoring/backups are checked and a named city operations owner is on call.
5. **Operate the loop.** Update local content and offers daily; review activation, retention and meaningful business actions weekly; run a post-launch review before adding a second city.

## Customer acquisition and community

Approved early channels are referrals, rewards, local business QR/onboarding material, community ambassadors, useful local content and partner campaigns. Every channel is tagged in the existing analytics event vocabulary. Do not incentivize fake reviews, misleading offers or automated account creation.

Ambassadors have one city owner, a documented escalation path and a measured remit: invite qualified businesses, explain the app accurately, collect feedback and report local issues. They cannot promise unapproved pricing, availability, finance features or integrations.

## Business packages

The protected `GET /api/v1/operations/launch/plan` response is the canonical package definition for the first launch:

- **Free Starter:** public profile, basic offers and a digital flyer.
- **Business:** analytics, promotions and campaigns.
- **Premium Partner:** selected visibility plus AI/Opsnestone capabilities only when their feature flag, contract and supporting integration are active.

The first objective is verified utility and repeat business activity, not premature monetization. Package prices, payment claims and contracted benefits require separate approval and legal/finance review.

## Growth loops and release guardrails

| Loop | Measurable output | Guardrail |
| --- | --- | --- |
| Deals | fresh offers, qualified views, contacts/saves | never promote expired or misleading discounts |
| Save Food | created packages, reservations, completed pickups | confirm real availability and pickup windows |
| Rewards/referrals | completed referrals and meaningful retained activity | reject spam, self-referrals and fake accounts |

The North Star remains **Successful Connections**: an observed, policy-eligible action that creates value between a user and relevant local business. Raw installs, unverified profiles and clicks alone are not success.

## Launch ownership and cadence

| Cadence | Owner | Decision |
| --- | --- | --- |
| Daily | City operations + support | supply freshness, moderation, incidents, urgent content fixes |
| Weekly | Product, growth and business leads | activation, retention, offer quality, campaign continuation |
| Monthly | Founder/leadership | city economics, staffing, partner health, next-city readiness |

The current city must show reliable supply, repeat value and manageable operations before expansion. A second city begins only with a named local owner, qualified supply plan, support coverage and a completed launch scorecard review.
