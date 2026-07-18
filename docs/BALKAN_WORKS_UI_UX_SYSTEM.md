# Balkan.works UI/UX Design System

## Product feel

Simple, modern, reliable, local and intelligent. Users should understand the next useful action in seconds; businesses should see outcomes without learning complex software; AI should assist naturally without becoming the interface.

## Shared system

Mobile, public web, Business Dashboard and Admin use the same design tokens, reusable UI package, component states, language rules and trust patterns. The Design Language remains the visual foundation; this document defines product interaction rules.

## Navigation

The canonical **MVP consumer mobile navigation** is:

`Home · Search · Offers · Saved · Profile`

This follows the latest MVP UI specification. The Business Dashboard is a protected business surface, not a consumer bottom-navigation tab. Public web navigation exposes Explore, Businesses, Offers, Business access and Account.

## First-open experience

Show local value before imposing registration where legally/technically possible:

`Open app → choose/confirm location → see local offers → register when saving, following or taking an account action`

Location permission is optional and explained; a city selection fallback always exists.

## Components and content hierarchy

- **Primary button:** one clear high-value action per context.
- **Secondary/text button:** supporting or low-emphasis action.
- **Business card:** logo, name, category, location, rating/trust state and a meaningful route to detail.
- **Offer card:** image, title, current price/discount, validity and business/distance context.
- **Search:** always easy to reach; supports query, filters and visible result/empty states.

Cards answer the essential decision questions quickly. An offer must make clear what it is, where it is, how long it lasts and how to use it. A business page presents identity, category, description, location, offers, trust/reviews and relevant actions.

## State patterns

- **Loading:** skeletons/progress preserve layout and do not suggest false results.
- **Empty:** explain the missing content and offer a next action (for example, discover local offers).
- **Error:** use short, actionable human language and retry/support options; never raw server codes.
- **Success:** acknowledge completed actions without interrupting the next task.

## Business Dashboard

Prioritize outcomes over configuration: overview (views/activity), active offers and basic analytics. Profile and offer creation use progressive forms with explicit review/status states. Business owners cannot see platform/global data or other businesses' data.

## Accessibility and responsiveness

Support readable typography, sufficient contrast, keyboard/focus navigation, semantic labels, screen readers, touch targets and responsive phone/tablet/desktop layouts. Color alone never communicates status.

## AI interaction

AI recommendations are contextual, grounded and plainly labeled. They show the supporting content where appropriate and require confirmation before actions. Avoid robot branding, intrusive chat walls and unexplained personalization.

## Handoff rule

Each component documents purpose, variants, loading/empty/error/disabled states, content limits, accessibility behavior and responsive behavior before it becomes a reusable pattern. Avoid dense screens, decorative motion and module-specific visual forks.
