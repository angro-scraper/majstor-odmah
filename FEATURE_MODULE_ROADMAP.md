# Balkan.works Feature Module Roadmap

## Master concept

**Balkan.works is the primary platform layer.** Save Food, Opsnestone, Digital Flyers and Stock Radar are modular products beneath it. They share Balkan ID, location, permissions, offers, notifications and a future AI layer; they are not four separate applications.

## Phase 0 — Foundation (must have)

| Module | Responsibility |
| --- | --- |
| Balkan ID | Account, profile and location |
| Business Network | Businesses, categories and locations |
| Offers Engine | Actions, offers and promotions |
| Notification System | User notifications and business campaigns |

## Phase 1 — Balkan.works MVP

Daily-use foundation: Explore for businesses, offers and services; digital business cards with location, contact and offers; and the first Digital Flyers workflow.

## Phase 2 — Digital Flyers

Businesses create flyers, products, actions and campaigns, then measure results. Future monetization: business subscription, promoted flyer and featured campaign. AI copywriting remains feature-flagged until an approved provider is configured.

## Phase 3 — Save Food

Partner network for restaurants, bakeries and markets; consumer discovery, reservation and pickup. Future monetization: reservation commission. Forecasting remains a future AI capability.

## Phase 4 — Opsnestone

Business operating system: invoices, records, CRM, inventory and analytics. It consumes published offer, sales and Save Food events only through documented APIs/event contracts. Future monetization: SaaS subscription.

## Phase 5 — Stock Radar

Business intelligence: market trends, financial analysis, alerts and reports. Future AI can suggest campaigns and opportunities only from authorized data.

## Later phases

6. Marketplace — local products, services, stores, catalog and orders.
7. Services Network — craftspeople, repair, education and professional services.
8. Jobs — listings, applications and later matching.
9. Wallet & Payments — payment, loyalty and rewards after regulated provider setup.
10. Balkan AI Core — permission-aware intelligence across users, businesses, offers, transactions and market data.

## Dependency map

`Balkan ID → Business Network → Offers → Flyers → Save Food → Opsnestone → Stock Radar → Marketplace → AI`

## Feature-flag strategy

Every module has a release flag. A module may exist in the codebase but remain invisible or foundation-only until its phase is approved.

```text
FLYERS_ENABLED=true
SAVE_FOOD_ENABLED=true
MARKETPLACE_ENABLED=false
WALLET_ENABLED=false
AI_ASSISTANT_ENABLED=false
```

## Priority rule

Before implementation, every new feature must answer:

1. Does it increase the number of users?
2. Does it help businesses?
3. Does it create revenue?

If the answer is no to all three, it is not a priority.

## Delivery rule

Modules follow: **Plan → Database → API → UI → Testing → Documentation**. No external credential, payment provider or external-platform synchronization is enabled before its phase and integration review.
