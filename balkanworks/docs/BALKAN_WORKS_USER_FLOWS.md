# Balkan.works User Flows

## Purpose

Define the MVP paths that take each user from a local need to a useful next action. Customer, business-owner and admin flows must be clear, recoverable and measurable.

## Customer flows

### Registration

`Open app → Register → email + password → confirm account → complete essential profile → enter app`

Collect only the data needed at this point: name, email, password and location. Interests and other preferences are progressive, optional inputs. Support a secure reset path; do not reveal whether an email address exists during reset/login failure messages.

### Login

`Open app → Login → credentials → authentication → Home`

Expired sessions, blocked accounts and failed logins produce clear, safe messages and a next action without exposing sensitive account state.

### Search for a business

`Home → Search bar → enter need → select category/location → results → business profile`

For example, a search for “Auto servis” in Belgrade returns relevant local businesses using documented ranking/filter rules. The principal goal is a useful local result, not an account conversion.

### Business profile and contact

The profile presents name, logo/media, description, category, location, contact data, opening hours, services, trust status and eligible reviews. The user can call, initiate an approved message channel, open the location, save a favorite or start a review.

`Business profile → contact → choose phone/message/location → connection created`

Log an approved contact event with the actor policy, business, timestamp and contact type. Do not record message content or personal data beyond the documented purpose.

### Review and favorite

`Business → review → rating + comment → submit → moderation → published or rejected`

Review submission requires an account and should use a documented interaction/eligibility rule before publication. A favorite follows `Business → favorite → saved → available in profile` and may request registration only when persistence requires it.

## Business-owner flows

### Business registration and approval

`Choose business account → register → company data → create profile → request verification → admin review → approved/rejected → public visibility`

Required data: name, category, description, phone, email, address/location, images, services and opening hours. A business remains non-public or clearly marked until the current approval policy permits visibility.

### Dashboard and profile maintenance

The owner sees basic permitted views, contacts, review status, profile completeness and verification state. The owner can edit business details, services and images; material changes may enter review according to moderation policy.

### Verification

`Business request → admin review → information check → approve/reject → status update`

Verification is an evidence-based trust process, not a paid or automatic claim.

## Admin flows

Admin and moderator workflows cover new/changed business profiles, reports and reviews, user controls, category management and audit history. Every privileged action must enforce role/resource authorization, record an audit trail and provide a clear reversible/appeal path where policy allows.

## Navigation

| Surface | Primary navigation |
| --- | --- |
| Customer app | Home, Search, Favorites, Profile |
| Business dashboard | Overview, Profile, Analytics, Settings |
| Admin panel | Overview, Businesses, Users, Reports, Settings |

## Recovery flows

- **No results:** show relevant alternative categories, nearby results and a controlled suggestion to add/report a missing business.
- **Incomplete profile:** show what is missing and the next completion step without hiding the owner’s work.
- **Failed action:** explain the problem in plain language, preserve safe input where possible and offer retry/support.

## Event contract

Track governed events including `signup`, `login`, `search`, `view_business`, `click_contact`, `favorite`, `review_created`, `business_created` and `verification_completed`. Event definitions, privacy rules and retention are governed by the Metrics & Analytics System.

## Core MVP loop

```text
User need → search → find business → contact → successful result
  → trust signal → better local platform
```

## Final principle

No screen should leave the user asking “what now?” Each state provides a clear, useful and safe next step.
