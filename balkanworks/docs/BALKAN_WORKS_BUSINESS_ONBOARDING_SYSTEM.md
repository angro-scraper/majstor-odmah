# Balkan.works Business Onboarding System

## Purpose

Define the complete business onboarding journey that turns a local company from an unknown prospect into an active, trusted digital partner — and only later, when value is proven, a premium customer.

## Principle

The first ten minutes must lead toward a clear outcome: a useful public profile and a visible next step. Onboarding is fast, progressive and result-oriented; it does not request every possible field before the business sees value.

## Journey

`Discovery → registration → profile creation → verification → first visibility → first customer interaction → retention → value-led upgrade`

## Stages

| Stage | Business outcome | Platform responsibility | Key signal |
| --- | --- | --- | --- |
| Discovery | Understands why Balkan.works is relevant | Clear local-business message through sales, referrals, partners, events and campaigns | Qualified lead source |
| Registration | Creates a business account | Collect only name, email, phone, category and location | `business_signup` |
| Profile creation | Has a credible digital business card | Guided completion of name, description, category, address, hours, contact, images and social links | `profile_created`, quality score |
| Verification | Builds customer trust | Offer basic email, standard business-data and verified review levels | `verification_completed` |
| First value | Sees that people can discover the business | Show profile views, contact clicks and customer interest in the dashboard | First qualified interaction |
| Offer activation | Publishes a current reason to return | Guide creation of a clear offer, promotion or update with title, description, validity and contact | `offer_created` |
| Retention | Keeps profile and offers current | Surface performance, recommendations, reminders and support | Active profile and fresh offers |
| Upgrade | Chooses paid value knowingly | Present plans after measurable traction, never as an onboarding obstacle | `upgrade_clicked` / conversion |

## Profile quality score

The score is an explainable checklist, not a hidden ranking. It rewards completed essentials: accurate name and category, verified contact, address/location, opening hours, useful description, media and an active offer. The dashboard must show the missing item and its benefit, for example: "Add working hours so customers know when to visit."

## Verification model

| Level | Evidence | Customer-facing meaning |
| --- | --- | --- |
| Basic | Confirmed account email | Account contact is confirmed |
| Standard | Required business details completed | Core company information is present |
| Verified | Additional review under the platform verification policy | Balkan.works reviewed the stated business evidence |

Verification must not imply a guarantee of a business's products or services. Every review, decision and status change is auditable and administered under role-based permissions.

## First value moment

The activation target is not registration; it is the first evidence of local discovery: a profile view, contact click, saved business, offer interaction or qualified customer message. The business dashboard presents this evidence plainly and explains the next best action, such as completing the profile or publishing a current offer.

## Offers and retention

Offer creation is the primary activation action after the profile is usable. An offer requires a clear title, accurate description, validity period and contact/action path. Retention communication focuses on real outcomes: profile activity, offer performance, profile quality, customer interest and useful recommendations — not spam.

## Premium conversion

Premium is presented after value is visible, for example when a business has growing profile views or needs additional visibility. Potential paid capabilities include promoted placement, advanced analytics, additional locations, marketing tools and future AI assistance. Pricing, entitlements and billing remain disabled behind feature flags until the relevant payment and legal work is complete.

## Automation and support

Automations are consent-aware, rate-limited and actionable:

- After registration: welcome and a direct profile-completion step.
- After profile completion: confirmation of public readiness and the offer-creation prompt.
- After first meaningful activity: a short, factual summary of customer interest.
- When activity declines: a helpful freshness reminder, with opt-out controls.

Businesses receive an onboarding checklist, contextual help and a human support channel. AI-assisted copy or profile suggestions are future, approval-required helpers; they never publish or make commercial decisions autonomously.

## Analytics and success metrics

Track `business_signup`, `profile_created`, `verification_completed`, `offer_created`, `dashboard_viewed` and `upgrade_clicked`, with privacy-minimized metadata and documented ownership. Measure qualified new businesses, time to activation, profile completeness, verification completion, first-value rate, active-offer continuity, retention and value-led premium conversion.

## Failure modes and safeguards

| Failure | Response |
| --- | --- |
| Business signs up then disappears | Short guided checklist, useful reminders and a clear first-value action |
| Profile is incomplete or low quality | Explainable quality score and context-specific completion help |
| Business cannot see value | Show factual views/interactions and recommend the next action |
| Premium is offered too early | Gate prompts on demonstrated value and never restrict basic activation |
| Verification is misleading | Use precise labels, documented evidence and an audit trail |

## Future readiness

Future AI can help draft descriptions, improve offer copy and suggest campaigns, but the owner approves every publish or spend decision. Opsnestone, Save Food, Digital Flyers, rewards and payments connect through Balkan ID, business permissions, events and feature flags rather than being required to complete the core onboarding path.

## Final vision

Balkan.works does not merely collect company listings. It helps each business become an active, trustworthy local partner that can see the results of its participation.
