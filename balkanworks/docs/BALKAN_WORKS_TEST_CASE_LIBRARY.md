# Balkan.works Test Case Library

## Purpose

Define reusable test cases and release-quality expectations for the Balkan.works ecosystem. The library is a source for automated tests, QA sessions and user acceptance testing; listing a case does not mean it has already been automated or passed.

## Principle

Test more than technical success: verify that the flow is secure, understandable and delivers the intended user or business value.

`Unit → integration → API → UI → security → performance → UAT`

## Test-case standard

Each implementation records: test ID, module, objective, preconditions, data/steps, expected result, automated/manual status, environment, owner, execution date and evidence link. Tests must use non-production data unless an approved, safe production verification procedure exists.

## Authentication and account cases

| ID | Scenario | Expected result |
| --- | --- | --- |
| TC-AUTH-001 | Register with valid required data | Account is created, input is validated, secure credentials are stored and user can authenticate |
| TC-AUTH-002 | Register with invalid email | Request is rejected with `INVALID_INPUT`; no account is created |
| TC-AUTH-003 | Login with wrong password | Access is denied without account enumeration or credential leakage; abuse controls record the event |
| TC-AUTH-004 | Access token expires | Protected request is denied or refreshed by the authorized session flow; no unauthorized access continues |
| TC-AUTH-005 | Logout/revoked session | Session can no longer refresh or access protected resources |

## User and privacy cases

| ID | Scenario | Expected result |
| --- | --- | --- |
| TC-USER-001 | Update own profile | Valid fields persist and the current profile reflects the change |
| TC-USER-002 | Attempt to update another user's profile | Request is forbidden and audited where appropriate |
| TC-USER-003 | Account deletion/privacy request | Account is deactivated or processed according to the approved retention/deletion policy; request is traceable |
| TC-USER-004 | Change notification preferences | Only eligible notifications follow the saved preference |

## Business and moderation cases

| ID | Scenario | Expected result |
| --- | --- | --- |
| TC-BUS-001 | Create business profile | Authorized owner creates a profile in `PENDING` status with validated fields |
| TC-BUS-002 | Approve business | Authorized moderator/admin approves it; public visibility follows the release/status rule |
| TC-BUS-003 | Suspend business | Public discovery is removed/limited according to policy; records remain governed and auditable |
| TC-BUS-004 | Cross-business access attempt | A member of business A cannot edit/read private data of business B |
| TC-BUS-005 | Verification status update | Correct permission, evidence requirement and audit record are enforced |

## Offer, favorite and review cases

| ID | Scenario | Expected result |
| --- | --- | --- |
| TC-OFFER-001 | Create valid offer | Eligible business member creates offer; it appears according to status and validity rules |
| TC-OFFER-002 | Offer reaches expiry | Offer is no longer returned as active and the UI reflects expiry accurately |
| TC-OFFER-003 | Hidden/draft offer discovery | Public users cannot see ineligible offers |
| TC-FAV-001 | Add favorite | Authenticated user saves an eligible business/offer idempotently |
| TC-FAV-002 | Remove favorite | Saved item disappears only from the requesting user's list |
| TC-REV-001 | Create review | Valid review is stored under moderation/trust policy and shown only when eligible |
| TC-REV-002 | Submit abuse/spam review | It is rejected or flagged for moderation without breaking the review system |

## Discovery and notification cases

| ID | Scenario | Expected result |
| --- | --- | --- |
| TC-SEARCH-001 | Keyword search | Relevant eligible results return in valid pagination envelope |
| TC-SEARCH-002 | City/location filter | Results respect the selected location and do not misrepresent distance |
| TC-SEARCH-003 | Category filter | Only matching eligible taxonomy results return |
| TC-NOTIFY-001 | Eligible notification delivery | Correct user receives one intended message through the enabled channel |
| TC-NOTIFY-002 | Notification preference | Opt-out and preference settings are respected |

## Admin, API and audit cases

| ID | Scenario | Expected result |
| --- | --- | --- |
| TC-ADMIN-001 | Moderator attempts admin-only action | Request is denied with `FORBIDDEN` and no state changes |
| TC-ADMIN-002 | Privileged business/content action | Action produces a complete audit record with actor, object, outcome and timestamp |
| TC-API-001 | List businesses | Valid request returns `200` and the documented response envelope/schema |
| TC-API-002 | Invalid request payload | Endpoint returns stable validation error code with no internal details |
| TC-API-003 | Unauthorized protected request | Endpoint returns correct unauthenticated/forbidden response and no data |
| TC-API-004 | Pagination/filter bounds | Limits are bounded, filters validated and response metadata correct |

## Security cases

| ID | Scenario | Expected result |
| --- | --- | --- |
| TC-SEC-001 | Repeated failed login | Rate limit/abuse controls apply and no sensitive account information leaks |
| TC-SEC-002 | Injection payload in API field | Input is safely handled; no query/script execution or data exposure |
| TC-SEC-003 | Token tampering/reuse | Invalid or revoked token cannot authorize an action |
| TC-SEC-004 | Sensitive-data response review | API returns only fields authorized for the caller and scope |
| TC-SEC-005 | Secret scan/dependency check | Release pipeline flags committed secrets and known vulnerable dependencies |

Authorized security testing must follow the Security Operations process, permitted environments and non-destructive methods.

## Performance, mobile and AI cases

| ID | Scenario | Expected result |
| --- | --- | --- |
| TC-PERF-001 | Load test common discovery flows | Service remains within defined error/latency thresholds at the approved target load |
| TC-PERF-002 | Search under concurrent requests | Pagination, caching and database behavior remain stable; no cross-tenant data appears |
| TC-MOB-001 | Mobile install/auth/navigation | Core flow is usable across supported device/OS test matrix |
| TC-MOB-002 | Limited/offline state | UI communicates unavailable data honestly and preserves no unsafe stale action |
| TC-AI-001 | Recommendation relevance | Evaluated recommendations outperform or match non-AI baseline for the defined task |
| TC-AI-002 | AI safety/grounding | System protects private context and does not invent unsupported local facts |
| TC-AI-003 | AI latency/cost | Response remains within release budget and has a defined fallback |

## UAT journeys

Use real pilot users, businesses and administrators with consented test accounts:

1. Consumer finds a relevant local business.
2. Consumer finds and saves a current offer.
3. Consumer contacts a business through an approved flow.
4. Business creates a profile, completes it and publishes a valid offer.
5. Moderator reviews a pending business or reported item.

UAT records expected result, observed result, participant feedback, severity and owner. It supplements — never replaces — automated regression/security testing.

## Defect priority and release gates

| Priority | Meaning | Release handling |
| --- | --- | --- |
| Critical | Security, data-loss or core outage risk | Block release; contain and verify fix |
| High | Major core flow unavailable or wrong | Block affected release unless formally risk-accepted |
| Medium | Significant degradation with workaround | Plan/fix based on impact and evidence |
| Low | Minor issue or improvement | Track and prioritize normally |

Before release, confirm relevant unit/integration/API/UI tests, regression results, migration verification, dependency/security checks, monitoring readiness, rollback plan, accessible user flows and UAT for material changes. Results and known risks are recorded in the release evidence.

## Continuous testing rule

Every new module or change adds/updates its cases, automation where practical, regression coverage and documentation. The library is reviewed after incidents, significant support trends and each major product phase.

## Final vision

Quality is part of Balkan.works itself: each release should strengthen user trust, local-business value and system reliability rather than merely add a feature.
