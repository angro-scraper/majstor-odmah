# Balkan.works Product Module Map

## Core idea

Balkan.works is the roof system. Modules share Balkan ID, user and business profiles, permissioned location/discovery services, notifications, analytics and the AI gateway. They do **not** share unrestricted access to each other's private data.

```text
Balkan.works Core
├── Balkan ID · profiles · roles · consent · location
├── Discovery · offers · notifications · rewards
├── Data and AI Gateway
└── Module layer
    ├── Save Food / sacuvaj-hranu.rs
    ├── Opsnestone Business Operating System
    ├── Digital Flyers / Marketing Engine
    ├── Stock Radar / Intelligence Module
    └── Future: Marketplace, Wallet, Travel, Jobs, Events, Learning
```

## Module contracts

| Module | Product position | Receives from Core | Contributes through governed APIs |
| --- | --- | --- | --- |
| Save Food | Food & Sustainability | ID, location, offers, rewards | Availability, reservations, food-waste impact |
| Opsnestone | Business Operating System | Business identity, permissions | Consent-scoped inventory/sales insights and operations |
| Digital Flyers | Marketing Engine | Business profile, offers, campaign audiences | Flyer content, campaign performance and engagement |
| Stock Radar | Intelligence Module | Approved market/business signals | Market trends, price intelligence and educational analysis |
| Marketplace | Commerce module | ID, business, listings and trust | Catalog/listing activity and orders when enabled |
| Wallet | Money module | Identity, rewards and authorization | Ledger events only after regulated provider integration |

## Development rule for every module

Before a module is activated it must define: the problem, the target user, business model, Core services it consumes, data it contributes, data-retention requirements, security permissions, API contract, analytics events and rollback plan.

## Feature-flag lifecycle

`development → hidden → beta → active → retired`

Feature flags determine visibility per environment, country, role, partner and pilot cohort. A user sees only active modules they are eligible to use. Initial examples:

```text
MODULE_SAVE_FOOD=true
MODULE_FLYERS=true
MODULE_OPSNESTONE=false
MODULE_STOCK_RADAR=false
MODULE_WALLET=false
MODULE_TRAVEL=false
```

## Navigation principle

Core navigation remains stable while modules are configurable: **Home**, **Discover**, **Offers**, **Business**, **Profile**. Home and Discover surface only the modules enabled for that user, country and role.

## Long-term operating model

Save Food drives daily consumer value; Flyers drive local business reach; Opsnestone operationalizes businesses; Stock Radar improves decisions; AI connects the permissioned signals into recommendations. Each module remains independently releasable but increases the usefulness of the shared Balkan.works network.
