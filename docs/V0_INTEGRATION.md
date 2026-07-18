# v0 UI integration

The supplied v0 project is retained as a visual reference under the local ignored `incoming/` workspace. Its premium light blue design, landing-page information architecture and reusable screen patterns are adopted without replacing Balkan.works' existing NestJS, Prisma, authentication or authorization layers.

The v0 contact form is now a real API flow: `POST /api/v1/support/contact` validates input, uses a honeypot field, applies an email-level hourly limit, persists inquiries and records an audit event. No inquiry data is returned to the browser.

Future visual ports must use the shared design tokens/components and connect to versioned API contracts rather than reintroducing static demo data.
