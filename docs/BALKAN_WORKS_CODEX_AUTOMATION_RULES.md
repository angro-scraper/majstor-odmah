# Balkan.works Codex Engineering Rules

## Purpose

Define how AI-assisted engineering work is performed while building Balkan.works. The goal is a stable, maintainable and scalable product — not code written without system context.

## Core principle

Understand the system before changing it. Each material decision needs a reason, an impact assessment and appropriate evidence.

## Rules

1. **Plan before code.** Inspect existing code, architecture and affected flows; write a focused plan before material changes.
2. **Do not break existing features.** Check affected API routes, schema/migrations and user flows; preserve unrelated work in the repository.
3. **Develop by module.** Organize code around domains such as auth, businesses, reviews and search — never an unbounded catch-all file.
4. **Use database discipline.** Production changes follow schema change → reviewed migration → validation → deploy. Never mutate production data structures ad hoc.
5. **Keep APIs consistent.** Versioned routes use validation, authorization, documented behavior and the standard success/error envelope.
6. **Put security first.** Require authentication, resource-level authorization, input validation and secret protection. Never commit plaintext passwords, tokens or open privileges.
7. **Write clean code.** Prefer readable, small, purposeful code over duplication and speculative complexity.
8. **Test after change.** Run applicable build, tests and linting before claiming completion. If dependencies or services are unavailable, state the limitation explicitly.
9. **Keep frontend components focused.** Each component has one purpose, clear inputs and reusable behavior where it genuinely helps.
10. **Design complete UX states.** Loading, empty, error and success states are requirements, not polish.
11. **Protect performance.** Inspect database query shape, rendering cost, bundle impact, indexing and caching needs before optimizing.
12. **Log material events.** Record errors, authentication/privilege changes and critical admin actions with privacy-aware audit data.
13. **Prepare useful AI data.** Capture purpose-limited search, location/category, outcome and time signals with clear governance — never uncontrolled data collection.
14. **Avoid overengineering.** Build the smallest modular MVP; do not introduce microservices or complex infrastructure without measured need.
15. **Document decisions.** For significant choices, record problem, decision, reason and impact.

## Review checklist

- **Functionality:** expected behavior works and relevant paths are tested.
- **Security:** inputs, identity, permissions and secrets are addressed.
- **Quality:** code is understandable, modular and documented where needed.
- **Performance:** query/render costs are proportionate to the current scale.
- **Operations:** migrations, release steps, logs and rollback considerations are explicit.

## Release evidence

```text
Tests → build → security check → migration/release review → deploy → monitor
```

Do not claim that a release is production-ready without evidence for the relevant gates.

## Final rule

Choose the simpler solution when it solves the real requirement. When risk exists, verify first. When ambiguity remains, record the decision and its assumptions.
