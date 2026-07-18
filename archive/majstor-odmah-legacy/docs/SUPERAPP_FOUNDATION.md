# Balkan.works Super App Foundation

## Product hierarchy

`Balkan.works` is the only platform root. It owns the Balkan ID account,
navigation, trust system, location, notifications, rewards, wallet and admin.

Native modules live under that root:

- Deals and digital flyers
- Save Food
- Market (jobs, craftsmen, services and marketplace)
- Balkan Local
- Rewards, Wallet and Balkan Assistant

## Future connectors

The following products are **not** separate entry points inside the app. They
will connect only through explicit opt-in APIs after their contracts, security
model and data mappings are approved:

| Future connector | Balkan.works destination | Connection rule |
| --- | --- | --- |
| `sacuvaj-hranu.rs` | Save Food | opt-in API connector |
| `opsnestone.com` | Business Cloud | opt-in API connector |
| `stock-radar.com` | Money Cloud | opt-in API connector |

No external user data, payments, credentials or content are fetched before a
connector is deliberately configured. Every user continues to use one Balkan
ID; external systems never become an alternative primary login.

## Rollout order

1. Harden the Core, mobile shell, location, Inbox, trust and moderation.
2. Grow Deals, Save Food, Local and Market as native modules.
3. Enable Rewards and Wallet with a regulated payment provider.
4. Add each external connector behind its own feature flag and audit trail.
