# Global operations and security baseline

This document is the production operating baseline for Balkan.works. It does
not claim an external service has been enabled merely because the application
is configured to support it. Production owners must record real provider
configuration and restore-test evidence in the release ticket.

## Environments and release controls

| Environment | Purpose | Data rule | Release rule |
| --- | --- | --- | --- |
| Development | Local engineering | synthetic/disposable only | developer verification |
| Staging | integration and release rehearsal | anonymized/test data | CI green + migration rehearsal |
| Production | live users | restricted access | approved deployment and rollback plan |

GitHub Actions validates Prisma, API tests/build, API lint, the public web
build, dependency review, and production dependency audit. Render deploys only
from `main`; the API readiness check is `/api/v1/health/ready` and verifies the
database before Render routes traffic to the instance.

## Runtime controls

- `GET /api/v1/health` is a liveness probe.
- `GET /api/v1/health/ready` tests database readiness.
- Each API request receives an `X-Request-Id`; structured request logs include
  only method, path, status and duration.
- Security headers, CORS allow-listing, DTO validation and safe error envelopes
  are enabled in the API process.
- The API includes an in-memory per-instance rate limiter. Before multi-instance
  production scale, deploy matching edge/CDN and Redis-backed rate limits.
- Authentication outcomes and privileged platform changes are audit logged.

## Monitoring and alerts

Attach a monitored endpoint and error/log provider in production. Minimum alerts:

1. readiness endpoint unavailable for 2 minutes;
2. 5xx rate above 2% for 5 minutes;
3. p95 API latency above 1 second for 10 minutes;
4. database connection, backup, or migration failure;
5. unusual failed-login or financial-risk event increase.

The Admin Security Center APIs are `/api/v1/admin/security/overview` and
`/api/v1/admin/security/events`; both require an administrator token.

## Backup and recovery

**Target baseline:** encrypted daily database backups, 35-day retention, an
encrypted object-storage backup, and an isolated restore target. Initial
objectives are RPO ≤ 24 hours and RTO ≤ 4 hours, then improved after recovery
exercises.

Every quarter, the production owner must restore a backup to an isolated
environment and record: backup timestamp, restore duration, Prisma migration
version, integrity checks, and the person who verified it. Never restore a
production backup into development.

## Incident response

1. **Detect** — identify the monitor, report, scope and timestamp.
2. **Contain** — revoke exposed credentials, disable the affected feature flag
   or integration, and preserve logs/audit evidence.
3. **Assess** — determine data impact, users affected and legal notification
   requirements; involve legal/security owners when personal data is involved.
4. **Recover** — deploy a reviewed fix or restore to an isolated target before
   routing production traffic.
5. **Review** — publish a blameless post-incident record with root cause,
   timeline, recovery evidence and preventive actions.

## Pre-launch operations checklist

- separate development, staging and production secrets/databases;
- HTTPS/custom-domain verification and CORS origins reviewed;
- backup schedule and restore exercise evidence recorded;
- uptime, error-rate, latency and database alerts connected;
- admin MFA and least-privilege database/provider access verified;
- API rate limits configured at the edge plus shared Redis at scale;
- deployment rollback and feature-flag rollback owner named;
- privacy export, deletion-request and incident contacts tested.
