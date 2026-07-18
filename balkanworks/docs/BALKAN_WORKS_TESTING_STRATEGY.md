# Balkan.works Testing Strategy

## Principle

Quality is a delivery practice, not a final phase. Test functionality, business outcomes, security, user experience, performance and recoverability across development, staging and production monitoring.

## Test pyramid

`Unit tests → API tests → integration tests → E2E journeys`

Unit tests protect service rules and validation. API tests protect contracts, authentication, authorization and errors. Integration tests cover real Core relationships and migrations. E2E tests simulate the user and business outcomes that matter.

## Required MVP coverage

| Area | Minimum scenarios |
| --- | --- |
| Auth | registration, login, duplicate identity, invalid password, expired/revoked session |
| Users | current profile, update validation, privacy/ownership boundaries |
| Businesses | create/update, owner vs non-owner permissions, admin approval/suspension |
| Offers | create, read/filter, expiry/status, favorite behavior and validation |
| Search | text/category/city filtering, empty/error states and bounded pagination |
| Notifications | own-user access, read status and permission checks |
| Database | migrations, constraints, indexes, tenant isolation and rollback plan |

## End-to-end journeys

- Consumer: open → register → choose location → find business/offer → save offer → see state persisted.
- Business: register → create business profile → publish offer → see permitted performance data.
- Admin: authenticate with privileged account → review/approve/suspend content with audit trail.

## Security and privacy testing

Test brute-force/rate-limit behavior, token expiry, RBAC bypass attempts, cross-tenant access, input validation, error leakage, secret handling, dependency vulnerabilities and audit generation. Conduct qualified penetration testing before public launch or high-risk integrations.

## Performance and resilience

Profile the real critical paths: auth, offer discovery, search, business dashboard and uploads. Define staging load scenarios before scale claims (for example concurrent browsing/search), measure latency/error rates/database pressure and test queue/cache failure behavior. Validate backups through restore exercises.

## Mobile and UX testing

Test supported iOS/Android devices and versions, navigation, loading/empty/error states, accessibility, connectivity/offline recovery and app update behavior. UAT includes consumers, businesses and admins from the pilot city.

## Automation and release gate

`Commit → lint → unit/API/integration tests → build → security checks → staging E2E/smoke → reviewed deploy`

Every release records tested version, migration state, known risks, monitoring dashboard and rollback owner. Production contributes monitoring and controlled security checks, not experiments against users.

## Defect discipline

Classify defects as Critical, High, Medium or Low. A report includes title, reproducible steps, expected/actual result, environment, evidence, owner and priority. Critical security/data-integrity defects block release.

## Metrics

Track meaningful coverage of risk-critical flows, test pass rate, production escape defects, bug resolution time, migration success, incident rate and restore-test success. Avoid optimizing for raw test count alone.
