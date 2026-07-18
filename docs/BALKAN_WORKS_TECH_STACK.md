# Balkan.works Technology Stack

## Decision

Balkan.works uses a practical, TypeScript-first modular monolith for the MVP. The design supports later extraction of services only when measured scale or operational boundaries justify it.

## Stack

| Layer | MVP standard | Later evolution |
| --- | --- | --- |
| Consumer mobile | React Native + TypeScript | Native modules only where experience requires them |
| Web, business and admin | Next.js + TypeScript | Independently deployed apps as usage grows |
| API | Node.js + NestJS, REST `/api/v1` | GraphQL only for validated multi-client query needs |
| Primary data | PostgreSQL + Prisma | Read replicas, partitioning and domain extraction when required |
| Cache and rate limits | Redis | Managed clustered Redis at scale |
| Search | PostgreSQL full-text search | OpenSearch/Elasticsearch after search quality and volume justify it |
| Media and files | S3-compatible object storage | CDN and lifecycle policies |
| AI | Permissioned AI Gateway | Embeddings/vector search and task agents behind flags |
| Local development | Docker Compose | Staging and production managed infrastructure |

## Architecture

`Mobile/Web → API Gateway → NestJS modules → PostgreSQL / Redis / object storage / approved external APIs`

Business logic stays in services, not controllers or frontend components. Modules communicate through documented interfaces or events; they do not couple directly to one another's database tables.

## Environments

Development, staging and production use separate credentials, databases and storage. Secrets are environment variables or a managed secret store and are never committed. Deployment requires a tested build, migration plan and rollback path.

## Security baseline

- HTTPS in every public environment.
- Password hashing, short-lived JWT access tokens and revocable refresh sessions.
- MFA for administrative accounts before production admin access.
- Input validation, RBAC, rate limiting, audit logs and principle-of-least-privilege service credentials.
- Encrypted transport and provider-managed encryption at rest.

## Quality and operations

CI/CD must run linting, unit tests, integration tests, build verification and migration checks. Production must collect structured request/error logs, audit events, uptime, latency, queue/cache health and backup verification.

## Scaling plan

- **0–100k users:** modular monolith, PostgreSQL indexing, Redis, CDN and background queues.
- **100k–1M users:** managed scaling, replicas, event processing and carefully selected service extraction.
- **1M+ users:** independently scalable services only for demonstrated bottlenecks or regulatory boundaries.

Kubernetes, OpenSearch, GraphQL and microservices are not default requirements; they are deliberate upgrades with a proven operating need.
