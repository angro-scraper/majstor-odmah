# Balkan.works DevOps Infrastructure

## Principle

Automate repeatable work; prefer stability, observability and recoverability over deployment speed. This document complements Deployment Architecture with day-to-day operating controls.

## Environment and service model

Development, staging and production are isolated. Begin with a single API deployment unit plus independently deployable web/admin clients, managed PostgreSQL, Redis and object storage. Scale from single instance to multiple instances, load balancing and selectively distributed services only when metrics justify it.

## CI/CD and release control

`Commit → automated tests → build → security/dependency checks → staging → smoke/migration validation → reviewed production release → monitoring`

Every release has a version, changelog, test evidence, migration compatibility note, owner and rollback plan. Use protected `main`/production release controls and short-lived feature branches. Branch naming/review policy must match the actual repository workflow; never invent branches merely to satisfy a diagram.

## Operational capabilities

- Application: health, latency, error rate, request volume and dependency failures.
- Infrastructure: CPU, memory, disk, network, container restarts and capacity headroom.
- Database: connections, slow queries, replication/backup status and migration history.
- Business: active supply, user activity and key outcome metrics without exposing private data in operations tools.
- Logs: structured API, error, security and audit events with access restrictions/retention rules.

Alerts cover service outage, error spikes, resource saturation, database failure, suspicious authentication behavior and failed backups. Alerts include severity, owner, runbook and escalation route.

## Storage, cache and data

Object storage uses secure upload policies, media optimization, lifecycle/versioning and CDN distribution for approved public assets. Redis is used for cache/rate-limit/session-adjacent workloads with expiry/failure behavior defined. Production data backups run daily at minimum and are verified through restore exercises.

## Security operations

Use restricted network access, environment/secret management, least-privilege identities, dependency patching, audit review and tested incident response. Secrets never appear in logs, source code, screenshots or support tickets.

## Daily and weekly routine

**Daily:** review health, error trends, alert status and urgent capacity/security signals.

**Weekly:** review backup/restore status, security/dependency findings, deployment outcomes, latency/cost trends and operational debt.

## Cost and scale discipline

Track hosting, database, storage, CDN, queue/cache and AI costs by environment and workload. Set budgets/alerts before scaling. A more complex deployment must identify the measured reliability, latency, capacity or regulatory problem it solves.

## Future readiness

AI workloads, embeddings/vector search, analytics storage and background queues are isolated behind environment/configuration boundaries. They must not compromise Core availability or expose production personal data to development workloads.
