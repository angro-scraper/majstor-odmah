# Balkan.works Admin Panel Specification

## Mission

The Admin Panel is the platform's trust, safety, quality and operational control center — not unrestricted access to every piece of user or business data.

## Administrative roles

| Role | Scope |
| --- | --- |
| Super Admin | Controlled platform configuration and highest-risk actions |
| Admin | Business/user operations and approved platform administration |
| Moderator | Content, reports and moderation decisions only |
| Support | Account/support assistance within privacy-limited workflows |
| Analyst | Aggregated, privacy-reviewed analytics only |

Permissions are resource/action-based and deny by default. Privileged actions require strong authentication, session control, reason/confirmation where risk warrants it and immutable audit records.

## Dashboard

Show platform overview (users, businesses, active offers/activity), release/system health summaries, growth metrics and operational queues. Link to source dashboards rather than exposing raw infrastructure secrets or personal data.

## Core administration

- **Users:** search, view only the data necessary for the role, change permitted status, block/unblock with reason and audit trail, view support/reports context.
- **Businesses:** pending → review → approved/rejected flow; suspension/category adjustments with explanation and notification path.
- **Offers/content:** review, approve/remove/flag offers and moderate images/descriptions/comments/reports according to written policy.
- **Categories/locations:** manage categories/subcategories/icons/order and country/city/regional configuration through controlled changes.
- **Reports:** user report → assigned review → decision → action → auditable resolution.

## Analytics, notification and settings controls

Analytics views are aggregated and tenant/privacy aware. Revenue, payments and advanced BI remain future capabilities behind financial/security gates. Notification campaigns require audience/consent validation, preview, rate/frequency limits and delivery/audit records; no unrestricted broadcast tool is assumed.

Feature flags support development/hidden/beta/active rollout by environment, country, cohort, role or partner. Changes are access-controlled, logged, reversible and never used to bypass security/product gates.

## AI and future controls

Future AI administration may show approved usage, rate/limit policy, quality/safety signals and reported issues. It must not expose private prompts/data beyond the Security & Privacy policy or grant model/vendor configuration to unqualified roles.

## Daily workflow and quality

`Check system → review queues → approve businesses/content → monitor outcomes → resolve/escalate issues`

Test RBAC denial paths, session expiry/MFA, moderation decisions, audit emission, feature-flag rollback and sensitive data boundaries. Every administrative action records actor, action, target, timestamp, result and appropriate reason/context.
