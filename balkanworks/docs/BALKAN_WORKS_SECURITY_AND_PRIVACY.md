# Balkan.works Security & Privacy Strategy

## Principle

Security and privacy are product requirements, not a release-stage add-on. Every data item has a purpose, owner, classification, access policy and retention/deletion rule.

## Identity and access

Balkan ID supports email/phone/password authentication at MVP and is prepared for verified OAuth and device/biometric flows later. Passwords are hashed; access tokens are short-lived; refresh sessions are revocable. RBAC governs Customer, Business Owner/Admin and System Admin capabilities. MFA is mandatory for administrators before production admin access and required for privileged business/enterprise actions as risk dictates.

## Application and API baseline

- HTTPS/TLS for every public endpoint.
- Authentication, authorization, DTO validation, safe error responses and rate limiting on every protected route.
- Brute-force controls and alerting for failed logins and suspicious activity.
- No secrets, tokens, credentials or production data in source control or client-side code.
- Dependency review, static checks, test coverage and vulnerability scanning in the release process.

## Data protection

Data in transit uses TLS; databases and object storage use managed encryption at rest. Production database access is restricted, logged and never broadly shared. Backups are encrypted, tested through restore exercises and governed by a documented disaster-recovery procedure.

Users must be able to understand, correct and manage the data relevant to their account, including privacy and notification settings. Account deletion/export requirements are implemented with legal retention obligations and operational recovery safeguards in mind.

## Business and tenant isolation

Every business-scoped query validates the owning tenant and actor permission. A business can never access another business's customers, operations, invoices, inventory or analytics. Opsnestone and future financial/business integrations receive stricter classification and audit requirements.

## AI safeguards

The AI Gateway applies consent, minimum-necessary data, tool permissions, rate limits and audit events before model use. Private user/business data is not reused for unrelated purposes. AI activity records the model/provider, approved data source category, tool calls and action outcome without unnecessarily logging sensitive prompt content.

## Monitoring, audit and incidents

Record security-relevant logins, permission changes, data changes, administrative actions and unusual access patterns. Incidents follow: detection → isolation → assessment → remediation → appropriate notification → post-incident review. Audit logs are protected from ordinary user modification.

## Release controls

Every feature passes design/privacy review, security review, implementation, validation/testing and release review. High-risk changes need a rollback path. Before regulated payments or large partner integrations, complete appropriate legal/compliance review, penetration testing and provider due diligence.

## Accountability and metrics

At MVP, the CTO and development team own this process; growth adds a security engineer; enterprise scale adds a dedicated security function. Track open vulnerabilities, incident count/severity, detection/response time, dependency patch status and backup-restore success.

## Compliance posture

Design to GDPR principles, consumer protection requirements and applicable local laws. This document is an engineering framework, not legal advice or a statement of certification; legal review is required before jurisdiction-specific launches.
