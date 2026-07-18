# Balkan.works Design System

## Brand tokens

| Token | Value | Usage |
| --- | --- | --- |
| Balkan Navy | `#0F172A` | Brand, navigation, primary identity |
| Balkan Green | `#16A34A` | Save Food, sustainability, positive state |
| Balkan Orange | `#F97316` | Deals, promotions, primary conversion actions |
| App background | `#F8FAFC` | Main canvas |
| Surface | `#FFFFFF` | Cards and panels |
| Primary text | `#111827` | Readable content |
| Secondary text | `#64748B` | Supporting information |

Typography is Inter first, followed by SF Pro and Roboto system fallbacks. Components use a single spacing scale, shared card structure, visible focus states and accessible contrast.

## Navigation

The consumer application always uses five primary destinations: **Home, Explore, Rewards, Inbox and Profile**. Home is a personal modular dashboard; Explore is the module catalog. Users activate and order only the modules they want on Home.

## Module accents

| Module | Accent |
| --- | --- |
| Save Food | Green |
| Deals | Orange |
| Services | Blue |
| Jobs | Purple |
| Money | Emerald |
| Balkan Assistant | Dark navy gradient |

Each module still uses the same card, button, navigation and spacing primitives so the ecosystem feels like one product.

## Component rules

- Cards show image or meaningful visual, title, location/context, price or status, trust signal and clear action when applicable.
- Forms reveal only required fields first; advanced information is progressive.
- Primary buttons perform a core action; secondary buttons support it without visual competition.
- Notifications are classified as Important, Recommendation, Promotion or System and must not be used as spam.
- Trust signals use clear labels: verified, rating, trusted partner and nearby.

## Responsive and accessibility baseline

The system supports mobile, tablet and web from the same component system, with dark mode enabled from the first version. Minimum readable sizing, keyboard focus, semantic labels and sufficient contrast are required for every new component.

## Design review rule

No new module can introduce independent colors, navigation, spacing or login. It must use Balkan ID, the five-tab system and these tokens.
