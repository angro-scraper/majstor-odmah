# Balkan.works Security Framework

> Security operating framework. It complements the detailed Security & Privacy Framework and Security Operations documents; it does not certify implementation or replace professional security assessment.

## Purpose

Protect customers, business users, data, infrastructure and the company’s reputation. Security is a product responsibility, not an optional add-on.

## Security model

```text
Prevent → Detect → Respond → Recover → Learn
```

Every material control should have an accountable owner, a review cadence and evidence that it is working.

## Security layers

| Layer | Core controls |
| --- | --- |
| Application | secure authentication, session lifecycle, validation, safe error handling and dependency hygiene |
| Authorization | least privilege, role/resource checks and auditable admin actions |
| Data | minimization, encryption in transit/at rest, retention controls and restricted access |
| Accounts | password protection, rate limits, secure resets, suspicious-login monitoring and stronger admin controls |
| Infrastructure | patched services, network controls, secrets management, monitoring, backups and recovery testing |
| API | authentication, authorization, rate limiting, schema validation, logging and abuse monitoring |
| Content | business verification, reports, moderation, anti-spam and appeal processes |
| AI (future) | permission-aware data use, output safeguards, evaluation, transparency and auditability |

## Identity and account protection

Support strong passwords, secure password reset, session/token expiry and rate limiting against credential attacks. Protect business ownership changes and administrative actions with additional verification and comprehensive audit logs. The role model progresses from customer to business owner, moderator, admin and super admin; permissions must grant only what each role needs.

## Data protection

Collect only data required for an explicit product purpose. Encrypt sensitive data in transit and at rest using managed, reviewed controls. Limit database, storage and analytics access; keep backups encrypted and tested; record material access and administrative changes. Privacy rights, retention and cross-border rules follow the Legal and Privacy frameworks.

## API and infrastructure protection

All public API endpoints require deliberate authentication/authorization choices, request validation, rate limits and safe logging. Infrastructure practices include timely updates, network/firewall controls, secret rotation, health monitoring, alerting and backup/recovery verification. Sensitive keys, passwords and tokens must never be committed to source control.

## Payments and AI

Payments are a future integration and must use qualified providers; do not store sensitive payment data unless necessary and permitted. Future AI functions must only use permitted data in the authorized context, disclose AI interaction where appropriate, resist misuse/prompt attacks, avoid unsupported claims and provide a human escalation path for consequential cases.

## Content security and trust

Mitigate spam, fake businesses and fake reviews through proportionate verification, reporting, moderation, clear policies and appeals. The operational flow is **report → analysis → decision → action → appeal**. Preserve access-controlled evidence for material moderation actions.

## Monitoring and incident response

Monitor application errors, authentication attempts, suspicious behavior, privileged changes, infrastructure health and security alerts. For an incident:

1. **Detect** — identify and triage the signal.
2. **Contain** — restrict impact and preserve necessary evidence.
3. **Investigate** — establish scope and cause.
4. **Recover** — restore safe, verified service from known-good systems/backups.
5. **Learn** — document findings, notify where legally required and implement prevention.

## Launch gate

- Authentication, authorization and administrative audit controls are tested.
- Backups exist and restoration has been exercised.
- Monitoring, alerting, incident ownership and contact paths are active.
- Privacy and retention controls have been reviewed.
- API validation/rate limiting and dependency/secret checks are in place.
- Moderation, reporting and appeal handling are operational.

## Security culture

Everyone who builds or operates Balkan.works owns part of its security: use approved access paths, report anomalies early, protect confidential information and treat operational evidence as a requirement.

## Final principle

People place trust in the company that protects their information and resolves their problems. Preserve that trust through visible discipline before, during and after incidents.
