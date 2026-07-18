# Balkan.works MVP Database Schema

## Core schema

The Prisma schema at `packages/database/prisma/schema.prisma` is the executable source of truth. It now covers authentication sessions, users/profiles, countries/cities, RBAC, businesses/locations, categories, offers, favorites, reviews, notifications, analytics events/searches, files and audit logs.

## Design decisions

- UUID primary keys, timestamps and soft-delete fields support cross-service references and controlled lifecycle handling.
- Roles/permissions use join tables rather than a hardcoded user role column, allowing Customer, Business and Admin policies to evolve safely.
- Business location is normalized in `business_locations`; business categorization and offers use `categories`.
- Offer status/expiry, price/currency and indexes support current local discovery and future regional configuration.
- Favorites may target a business or offer; application validation must require exactly one target.
- Reviews are one per user/business pair; moderation and audit workflows are enforced in the service layer.
- Events and searches are operational analytics data and must follow the Data Strategy; sensitive fields are excluded.

## Indexes and migration rules

The schema indexes user identifiers, city/category/business state, active/expiring offers and time-bound event/search records. All database changes require a Prisma migration, review, test in staging, backup verification and a rollback plan. The production database is never edited manually as a shortcut.

## Expansion boundaries

Save Food, Opsnestone, Digital Flyers, Stock Radar, Wallet and Marketplace receive their own migrations/tables when activated. They integrate through Core IDs and documented contracts rather than modifying unrelated tables without review.
