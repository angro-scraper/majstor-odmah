# Balkan.works Design Tokens

## Purpose

`apps/web/app/design-tokens.css` is the central source of visual tokens for the initial Super App implementation. Components use semantic variables rather than duplicating raw colors, spacing or motion values.

## Token groups

| Group | Examples |
| --- | --- |
| Brand and semantic colors | `--color-brand-primary`, `--color-surface`, `--color-text`, `--color-line` |
| Typography | `--font-sans` with Inter/Geist/SF-compatible fallback stack |
| Spacing | `--space-1` through `--space-7` following the 4/8-point scale |
| Radius | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` |
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| Motion | `--duration-fast`, `--duration-normal`, `--duration-slow`, `--ease-standard` |

## Theme behavior

The default theme is light. The header control writes an explicit `data-theme="light"` or `data-theme="dark"` value to the document and stores a user-selected dark preference under `balkanworks-theme` in local storage. Reduced-motion preferences disable nonessential animation.

## Component expectations

Buttons support primary, secondary and ghost variants plus small, medium and large sizes. Badges support neutral, verified/success, premium, new and AI purposes. `Skeleton`, `EmptyState` and `ErrorState` provide the minimum state primitives for data-driven screens.

## Rule

New UI must use semantic design tokens. Raw color, spacing, radius and transition literals are permitted only when adding a new token definition or where a documented visual asset requires it.
