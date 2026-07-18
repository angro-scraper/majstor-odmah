# Balkan.works Deployment Architecture

## Principle

Start simple, scale from measured demand and preserve a safe rollback path. The MVP is a modular monolith with managed PostgreSQL, Redis and object storage; it is not a premature microservice fleet.

## Environments

| Environment | Purpose | Data/security rule |
| --- | --- | --- |
| Development | Local feature work via Docker and fixtures | No production credentials or personal production data |
| Staging | Release validation against production-like topology | Separate database, storage, secrets and observability |
| Production | Public customer/business service | Least privilege, audited access and controlled releases |

## Reference topology

`CDN → Next.js web/admin → versioned API → PostgreSQL / Redis / S3-compatible storage → event, analytics and AI adapters`

Mobile builds consume the same API through development, beta and store-release channels. Frontend builds are immutable artifacts deployed through CI/CD; the API is a containerized NestJS service with health checks and environment-based configuration.

## Deployment units

- Web, admin and API are separately deployable applications.
- Domain modules remain in the Core process until an independently scalable, observable and operationally justified boundary exists.
- Notification, analytics, AI and payment workloads run as queues/workers or separate services only when their workload/reliability requirements demand it.

Every deployed service must have a Dockerfile, non-secret configuration contract, liveness/readiness health checks, structured logs and a rollback method.

## Database, cache and storage

PostgreSQL has encrypted backups, monitoring, restricted access and a migration pipeline: local → CI/staging validation → reviewed production deploy. Never make manual production schema edits. Redis is used for rate limits, cache and eligible sessions; it is not the source of truth. Object storage holds media/documents with lifecycle rules, private defaults and CDN delivery only for approved public assets.

## CI/CD release gate

`Commit → lint → unit/integration tests → build → dependency/security checks → staging deploy → smoke/migration checks → production approval/deploy`

Production releases require migration compatibility, rollback/recovery instructions, observability checks and an owner. Secrets are injected via environment/secret manager; no credential, password, token or provider key is committed.

## Monitoring and incident readiness

Monitor availability, latency, error rate, API throughput, CPU/memory/disk/network, database connection/query pressure, queue health and backup restore success. Centralize application, security and audit logs. Alert on service failure, error spikes, database saturation, unusual auth behavior and backup failure.

Incident response: detect → isolate → assess → recover → verify → communicate as appropriate → review. Practice database restore and disaster-recovery steps before relying on them.

## Scaling and cost controls

- **MVP:** frontend + API + managed database/storage, cost dashboards and basic monitoring.
- **Growth:** Redis, background queues, horizontal API scaling, read optimization and CDN.
- **Regional scale:** load balancing, replicas/partitioning, regional delivery and selectively extracted services.

Do not buy or operate complex infrastructure before demand validates it. Scale service-by-service based on bottlenecks, reliability targets and cost evidence.

## Production checklist

HTTPS, restricted secrets, validated backups/restores, monitoring/error tracking, migration/rollback plan, security review, load/smoke checks, support escalation and release ownership are required before a public production launch.
