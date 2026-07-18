# Balkan.works Platform Operations System

## Purpose

This document defines how Balkan.works operates as a reliable platform as users, businesses and data grow. It complements the company operating cadence by defining the platform processes that protect quality, trust, security and scalability.

## Operating rule

Balkan.works must operate as a serious technology platform, not merely as an application. Every operational process needs an owner, a measurable state, an audit trail where risk requires it, and an escalation route.

## 1. Business onboarding

The onboarding flow is designed to make a quality business profile easy to create:

`Business registration → core details → category → location → services → images → verification → profile activation`

The business owner should always see profile completeness, missing required information and the next useful action. Activation must not bypass moderation or verification policies.

## 2. Business verification

| Level | Meaning | Minimum evidence |
| --- | --- | --- |
| Basic | Automatically created or claimed profile | Basic public business information |
| Verified | Ownership/contact checks passed | Confirmed phone, email and core details |
| Trusted | Higher-confidence business relationship | Documentation, reputation and operating-history review |

Verification labels must be transparent: users should understand what the label means, and admins must retain a reviewable decision record.

## 3. Quality control

Each business may receive a future **Quality Score** to support ranking and business coaching. It should combine auditable factors, including:

- profile completeness;
- quality and volume of approved reviews;
- response behavior where that signal exists;
- recent profile activity;
- verification level.

The score must never be presented as an unexplained absolute truth. Its components, eligibility and treatment of missing data require a product policy before automated ranking depends on it.

## 4. Review moderation

The moderation flow is:

`Submission or report → automated risk signals → human review when needed → decision → audit record → appeal path`

Controls address spam, abusive material, suspicious duplicates and suspected fake reviews. AI may flag or prioritize content, but a model must not silently make high-impact moderation decisions without a defined human-review and appeal process.

## 5. Admin operations

The admin panel must support:

- platform dashboard: users, businesses, activity and growth;
- moderation queues: reports, reviews and content;
- business management: verification, suspension, editing and decision history;
- permission-controlled actions and audit logs.

Any action that changes a public business state or user access must record actor, object, timestamp, result and reason where applicable.

## 6. Customer support

Support evolves from a help center and contact form into a ticket workflow:

`Request → category → priority → owner → resolution → feedback → knowledge-base update`

Future AI support may assist with routing and self-service answers, but must be clearly identified and hand off to a person for sensitive, unresolved or safety-related cases.

## 7. Security and resilience

The baseline includes rate limiting, audit logs, backups, monitoring and secure secret management. Operational access follows least privilege; credentials are never stored in source control. Backups need periodic restoration tests, not merely scheduled creation.

## 8. Data management

User, business, event and review data require controlled access, retention rules, protected backups and an appropriate history of important changes. Data collection remains purpose-limited and privacy-aware, especially where signals later support search, ranking or AI.

## 9. Monitoring

| Area | Monitor |
| --- | --- |
| Application | errors, latency, availability and dependency health |
| Security | suspicious login/activity patterns, privilege changes and failed access |
| Business | registrations, profile activation, engagement and conversion signals |
| Data | event delivery, data quality, backup status and migration health |

Alerts require named owners and severity levels. Monitoring is useful only when it leads to timely response and post-incident learning.

## 10. Scaling plan

The platform is prepared for more cities, countries, languages and high usage through modular boundaries, localized business/location data, permissions and observable operations. Scale only after the local model is stable; standardize onboarding, support, moderation and data quality before replicating a city playbook.

## Implementation boundary

This is the operational target state. Existing authentication, business moderation endpoints and audit structures are an early foundation; ticketing, quality scoring, automated content-risk detection, production monitoring and multi-country localization require separately scoped, tested delivery tasks.
