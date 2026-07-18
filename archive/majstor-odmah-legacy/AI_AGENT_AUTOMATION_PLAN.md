# Balkan.works AI Agent Automation Plan

## Principle

An agent is not a chat box. It understands a permitted goal, uses authorized platform data, proposes an action and performs an action only after the correct human approval. Balkan AI never bypasses Balkan ID, module permissions, feature flags or audit logs.

## AI Core

`Balkan AI Core → User AI, Sales AI, Business AI, Data AI, Support AI`

Every agent is composed of: model, knowledge base, approved tools, permission policy, scoped memory and audit trail.

## Agent catalog

| Agent | Purpose | Controlled tools |
| --- | --- | --- |
| Balkan Assistant | Find offers, products, services, businesses and jobs; plan shopping and reminders | Search, location-aware discovery, draft reservation |
| Business Growth Agent | Propose campaigns, offers and performance actions | Draft campaign and offer only |
| Sales Agent | Help identify leads, reply to inquiries and summarize contacts | Opsnestone CRM actions after owner approval |
| Marketing Agent | Draft posts, emails, flyers and ads | Digital Flyer drafts and campaign drafts |
| Accounting Assistant | Categorize costs, reminders and business summaries | Read-only approved business records |
| Inventory Agent | Monitor stock, predict shortages and propose purchases | Read-only inventory plus draft purchase proposal |
| Save Food Agent | Forecast surplus, timing and discounts | Draft Save Food offer |
| Stock Radar Agent | Trends, reports and opportunities | Authorized market-information tools only |
| Support Agent | Guide users and triage issues | Knowledge base, ticket draft and escalation |
| City Intelligence Agent | Analyze local supply, events and community needs | Aggregated, privacy-safe regional data |
| Partner Agent | Reports, campaign tracking and partner analytics | Partner-scoped analytics only |

## Permissions and human control

- Agents have explicit per-tool permissions.
- Agents can recommend and draft by default.
- A human approves critical changes: publishing campaigns, creating offers, spending money, modifying data, sending bulk communication or any regulated action.
- No agent may independently spend funds, move wallet money, publish externally, or access another user or business scope.
- Every proposed and executed action is auditable.

## Memory boundaries

User memory contains only consented preferences, interests and habits. Business memory contains authorized products, results and history. Memory is scoped to Balkan ID, purpose and retention policy; it is never silently shared between users, firms or connectors.

## Automation event pattern

`BusinessCreated → Marketing Agent proposes campaign → Owner approves → Campaign is published`

Events trigger drafts and recommendations, not autonomous irreversible outcomes.

## Delivery phases

1. **Chat + Search** — permission-aware Balkan Assistant over native platform search.
2. **Recommendations** — explicit opt-in personalization.
3. **Business Agents** — draft campaigns, reports and operational suggestions.
4. **Automation** — approved event workflows.
5. **Autonomous workflows** — only for non-critical, pre-authorized actions with monitoring and instant revocation.

## Monetization

- User Premium: advanced assistant.
- Business Premium: marketing agent, analysis and automation.
- Enterprise: custom agents, scopes and reporting.

## Release rule

The AI layer is feature-flagged and postponed until the Foundation/MVP network is validated and secure model-provider credentials are configured. The first release is search and chat only; no automation or external-platform connection is implied.
