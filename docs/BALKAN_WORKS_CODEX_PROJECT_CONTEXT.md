# Balkan.works Codex Project Context

## Product identity

**Balkan.works** is an AI-first local super application. It connects people with the best local businesses through natural-language search, recommendations and data-backed trust.

The core product promise is simple: a person should not have to decide which company category to search. They should be able to state a need — for example, `I need a reliable electrician near me today` — and Balkan AI should guide them to appropriate local options.

## What we are building

- a trusted local-services discovery platform;
- an AI search and recommendation layer;
- a business network and growth tool;
- a foundation for a future local marketplace.

We are not building a basic business directory, a classified-ads clone, a Google Maps clone or a reviews-only application.

## Primary users

| User | Primary need |
| --- | --- |
| Customers | Find a service, business, recommendation or practical solution |
| Businesses | Gain visibility, customers, analytics and future AI support |
| Platform admins | Maintain quality, security and sustainable growth |

## Core journey

`Open app → describe a need → AI understands intent → compare relevant options → contact a business → share the outcome → improve platform intelligence`

The MVP can use classic search and ranking while collecting the structured signals required for future AI capabilities. It must not present unavailable AI capabilities as implemented.

## Product differentiators

1. **AI-first discovery:** natural-language intent is the long-term primary search interaction.
2. **Trust system:** results reflect verification, reputation and reliability — not only a company name.
3. **Business intelligence:** businesses receive evidence about profile performance and, later, useful recommendations.
4. **Local network effect:** more successful connections create better local data, which improves relevance and business value.

## Product and design memory

The experience should feel premium, modern, calm and fast — closer to a trusted fintech or high-quality marketplace than an overloaded directory. The UI system must lead users to one useful next action, use clear states and maintain a trustworthy visual language.

## Engineering memory

Prioritize in this order:

1. Stability
2. Simplicity
3. Scalability
4. Development speed

The target stack is Next.js, React, TypeScript and Tailwind for frontend; NestJS, Node.js and TypeScript for API services; PostgreSQL and Prisma for the primary data store; and Docker plus cloud deployment practices for infrastructure.

The MVP remains a modular monolith. Do not introduce microservices, marketplace payments or complex autonomous agents before real usage requires them.

## AI and data memory

The future AI layer includes intent recognition, semantic search, ranking, recommendations, an assistant and a business coach. Its foundations are clean local-business data and consent-aware event signals:

- searches and selected filters;
- business views and result clicks;
- favorites;
- contact actions;
- reviews and moderation outcomes;
- meaningful return behavior.

Collect only data that creates user or business value, respect privacy and preserve permission boundaries. AI must never invent business facts or conceal that a recommendation is AI-assisted.

## Decision rules

Before a material change, confirm that it improves user experience, supports future scale and AI readiness, and reduces rather than adds unnecessary complexity. If it does not, defer it.

Work in small phases. Each phase must state its goal, implement a cohesive change, run proportionate verification and update the relevant documentation and task board.

## Current development phase

The project is in Phase 1: repository foundation, data model, backend foundation, authentication and core frontend discovery. The first validated value loop is:

`Registration → login → search → business profile → contact → review`

## Long-term direction

Balkan.works is intended to become digital infrastructure for local services across the Balkans. Marketplace, bookings, payments, mobile applications, multiple countries and safe AI agents are later phases, enabled only after the local discovery model is proven.
