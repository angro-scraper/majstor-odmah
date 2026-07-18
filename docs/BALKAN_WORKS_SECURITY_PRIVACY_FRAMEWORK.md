# Balkan.works Security & Privacy Framework

## Purpose

Define the security and privacy standards that guide Balkan.works product design, implementation and release. The aim is a platform that users and businesses can trust with personal, business, financial and future AI-related data.

## Principles

- **Security by design:** controls are designed into identity, APIs, data and operations from the start.
- **Privacy by design and default:** collect the minimum data for a stated purpose and make protective settings the default.
- **Least privilege:** people, services and integrations receive only the access required.
- **Defense in depth:** no single client, token, database role or infrastructure control is trusted alone.
- **Evidence over claims:** production security status is verified through reviews, tests, logs and recovery evidence.

`Users → authentication → authorization → application services → governed database → encrypted storage/backups`

## Identity and authentication

Balkan ID supports email/password authentication, secure session management and token-based access. Passwords are salted and hashed using an approved adaptive password-hashing algorithm; plaintext passwords are never stored, logged or returned. Private keys, raw refresh tokens and access tokens are never kept in source code, client storage without platform protection, logs or support tickets. Server-side session/revocation records store only the minimal protected/hashable reference needed for secure session control.

Account security includes password policy, rate-limited login/recovery routes, token expiry/rotation, session revocation, secure account recovery and suspicious-activity monitoring. Privileged administrators require MFA before production access; stronger authentication for business and other high-risk operations follows the risk model.

## Authorization and tenant isolation

Roles are an entry point, not complete authorization. Core roles include Customer, Business, Admin and System; Moderator and scoped business-member roles are added where required. Every sensitive request checks the authenticated actor, resource ownership, tenant/business membership, action permission and current resource state.

Examples: customers may view eligible public offers and save favorites; business members may manage only their authorized business profile/offers; administrators may perform approved operational actions; system jobs run with narrowly scoped service permissions. Frontend claims and client-supplied owner IDs are never authorization evidence.

## Data protection and privacy

| Data class | Examples | Required handling |
| --- | --- | --- |
| Public | Approved business name/category/published location | Accurate, moderated and purpose-appropriate publication |
| Personal/private | Name, email, phone, preferences, eligible location data | Minimize collection, restrict access, protect in responses/logs, define retention |
| Business-confidential | Analytics, campaigns, internal operations | Tenant isolation, access/audit controls and contractual handling |
| Sensitive/regulated | Payment, verification or high-risk AI context | Enhanced access control, encryption, review and specialized compliance handling |

People receive clear notice of what is collected, why, how long it is retained and how to exercise applicable access, correction, deletion and preference rights. Data uses require a documented purpose and lawful basis appropriate to the jurisdiction. No personal data is sold.

## Encryption, secrets and storage

Use TLS/HTTPS for data in transit. Verify encryption-at-rest, backup encryption and access controls in the selected cloud/database/storage provider. Secrets are managed via environment/secret-management systems, rotated when required and never committed to Git. Access to production data stores is restricted, logged and separated by environment.

Files use a dedicated storage boundary: allowlisted content types, size limits, server-side authorization, safe object names, malware/content scanning where applicable and private-by-default access. Public media is released only through an authorized, moderated path.

## API and application security

Every endpoint has schema validation, authentication when necessary, resource authorization, rate limits appropriate to risk, secure headers, structured safe errors and audit/logging requirements. Use parameterized data access, output minimization, content sanitization/encoding and dependency hygiene to reduce injection and exposure risks. Sensitive actions use idempotency, confirmation and/or step-up controls where appropriate.

API documentation includes permission requirements and standard error behavior. The API never exposes stack traces, secrets, internal network detail or unauthorized resource data.

## Audit, monitoring and administration

Audit security-relevant events: authentication attempts, session/permission changes, sensitive data actions, business verification, moderation and administrator actions. An audit entry identifies actor/service, action, resource, time, outcome and minimally necessary context; IP/device data follows documented privacy/retention rules.

Monitoring detects unusual authentication patterns, authorization failures, service errors, rate-limit events, privilege changes, data-access anomalies and deployment/infrastructure issues. Admin access is restricted, MFA-protected, logged and periodically reviewed.

## AI privacy and safety

AI processing is routed through the AI Gateway. It uses only permissioned, purpose-limited data and applies tenant isolation, minimization, redaction where needed, tool authorization, request/output logging policy and human escalation. Models must not disclose private context, infer sensitive facts without an approved use case or access data outside the requesting user's/business's scope.

Assistant and agent actions remain approval-controlled. AI cannot publish, contact, spend, reserve, change permissions or alter sensitive records without the correct authorized human confirmation and an audit trail. Provider, model and retention choices require review before activation.

## Backup, incident response and recovery

Backups are encrypted, access-restricted, retained according to policy and regularly restoration-tested. The response lifecycle is:

`Detection → analysis → containment → recovery → review and improvement`

Security incidents have named owners, evidence preservation, internal escalation, factual communication and legal/privacy review for any notification obligations. Recovery targets, procedures and test results are maintained as operational evidence, not assumed from a written plan.

## Secure development and release

Developers use peer review, threat-aware design, dependency/vulnerability scanning, secret scanning, automated validation/tests and controlled deployment. New features define data types, permission rules, abuse cases, logging/audit needs, privacy impact and deletion/retention implications before release.

Before production, verify: security review, role/authorization tests, API validation tests, dependency/secret checks, infrastructure configuration, access review, MFA for privileged accounts, backup restore evidence, monitoring/alerts, incident contacts and rollback readiness.

## Compliance readiness

The architecture is designed for GDPR-style data-minimization, transparency, access/deletion and security principles, as well as relevant regional laws. Actual compliance requires jurisdiction-specific legal review, operational policies, contracts, records and implementation evidence; this framework is not legal advice or a compliance certification.

## Final vision

The strongest Balkan.works asset is trusted participation. Trust is earned through secure engineering, understandable privacy, accountable operations and honest evidence of what the platform protects.
