# Balkan.works UI Design System

## Purpose

This design system defines the visual language and reusable UI rules for the Balkan.works MVP. It should make every customer, business and admin experience feel simple, modern, trustworthy and locally relevant.

## Design principle

Every screen must immediately answer three questions:

1. Where am I?
2. What can I do here?
3. What is the most useful next step?

The product should feel like helpful local technology, not a dense directory. Trust, clarity and speed are more important than decoration.

## Brand feeling

Balkan.works should feel:

- trustworthy and professional;
- friendly and familiar;
- modern and technology-led;
- connected to the local community.

## Foundations

### Color roles

The concrete color values belong to the shared UI package or Tailwind theme. Components use semantic roles rather than hard-coded colors.

| Role | Use |
| --- | --- |
| `primary` | Main calls to action, selected navigation and interactive focus |
| `secondary` | Categories, supportive information and secondary highlights |
| `surface` / `background` | Page backgrounds, cards and grouped content |
| `text` / `muted` | Primary content and supporting copy |
| `success` | Verified, completed and positive feedback |
| `warning` | Pending review, attention needed and non-blocking alerts |
| `danger` | Destructive actions, rejected content and errors |

Verification must never rely on color alone: pair it with a clear label and an icon.

### Typography

Use one readable modern sans-serif family across web, business and admin products. Keep the hierarchy intentional:

- **H1:** page purpose or the primary decision;
- **H2:** section titles and major groups;
- **Body:** concise, scannable product copy;
- **Caption:** dates, metadata and secondary context.

### Spacing

Use the shared spacing scale: `4`, `8`, `16`, `24`, `32` and `48` pixels. Avoid arbitrary spacing values when a scale value communicates the same hierarchy.

## Component system

Every new feature must reuse the shared component primitives before introducing a one-off implementation.

### Buttons

- **Primary:** the one most important action, such as `Contact business`.
- **Secondary:** an alternative action with lower visual weight.
- **Danger:** irreversible actions such as delete, suspend or reject.
- Every pending action has a loading state; a completed action provides visible feedback.

### Inputs and forms

Inputs need a visible label, helpful validation, keyboard focus and an error message placed close to the affected field. Do not make color the only error signal.

### Search bar

Search is the core discovery control. It should be prominent on Home and Search, support a clear query action, and keep category and location filters understandable on small screens.

### Cards

Cards present businesses, services, reviews and recommendations. A business card contains, where available:

- image or logo;
- business name and category;
- city or distance;
- rating and review count;
- verification badge;
- one clear next action.

### Badges and status

Use badges for states such as `Verified`, `Premium`, `New`, `Pending` and `Rejected`. Labels must be plain-language and consistent across customer, business and admin surfaces.

## Navigation and screens

### Customer application

Primary navigation: **Home**, **Search**, **Favorites**, **Profile**.

- **Home:** prominent search, current location, popular categories and relevant recommendations.
- **Search results:** search context, filters, sorting and a clear list of results.
- **Business profile:** identity and verification first; then description, services, images, reviews and contact actions.
- **Favorites:** saved businesses with an immediate route back to search when empty.

### Business application

Primary navigation: **Dashboard**, **Profile**, **Leads**, **Settings**. The dashboard prioritizes profile views, contacts, review health and clear actions to improve the profile.

### Admin panel

Primary navigation: **Overview**, **Businesses**, **Users**, **Reports**, **Settings**. Admin views prioritize status, filters, auditability and safe confirmation around moderation actions.

## Responsive design

Design mobile first:

- small screens: single-column discovery, touch targets and bottom navigation;
- tablet: denser result lists and two-column detail layouts where useful;
- desktop: richer business and admin dashboards, without changing core action placement.

## Product states

Every meaningful screen and mutation must define:

- **loading:** predictable skeleton or progress state;
- **empty:** explain why no data is shown and provide a next action;
- **error:** explain the issue in plain language and offer retry or recovery;
- **success:** confirm a completed action without interrupting the user.

Example: an empty Favorites view says `No saved businesses yet` and provides `Search businesses`.

## Accessibility

The baseline standard includes readable color contrast, semantic controls, keyboard navigation, visible focus, accessible form labels and messages that assistive technology can announce. Animations are reserved for transitions and action feedback, and must not block use of the interface.

## Future AI UI

AI experiences must be visibly labeled as AI. Recommendations should include a short reason, such as `Recommended because it is nearby and highly rated`. The assistant must distinguish sourced business facts from generated guidance and never invent unavailable information.

## Implementation rule

The initial implementation may use a compact component set (`Button`, `Input`, `Card`, `Badge`, `SearchBar`, `Navbar`, `Modal`, `EmptyState` and `StatusMessage`). As the shared `packages/ui` library matures, move repeated patterns there rather than duplicating them across web, business and admin applications.

## Final vision

Balkan.works should combine local trust with modern technology: a calm, direct experience where each screen helps people move from a local need to a confident next action.
