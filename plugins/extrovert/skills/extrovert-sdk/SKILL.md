---
name: extrovert-sdk
description: Build or troubleshoot a TypeScript integration against the Extrovert REST API using the current SDK source and OpenAPI contract. Use for client construction, org/project/inbox addressing, pagination, error handling, reviewed sends, OTP waits, webhooks, streams, signature verification, or offline fixture tests.
---

# Extrovert TypeScript SDK

The prerelease package is published under the explicit `next` dist-tag. Use
`npm install @extrovert.dev/sdk@next`, or pin `@extrovert.dev/sdk@0.1.0-pre.6` for reproducible dogfood
tests. The public REST API and served OpenAPI remain the underlying contract. Do not imply that a
hosted MCP route substitutes for the SDK; use the SDK for direct TypeScript application integration.

## Choose the smallest mode

- Basic client, authentication, inbox handles, project addressing, pagination, metadata, or errors: read [references/core-client.md](references/core-client.md).
- Sending, replying, forwarding, durable review events, revisions, or rules: read [references/review-loop.md](references/review-loop.md).
- Webhooks, signature verification, SSE, or offline fixtures: read [references/events-and-testing.md](references/events-and-testing.md).

Use `whoami()` as the authority source. Prefer the canonical `projects.inboxes.*` chain when project breadth matters; inbox ids and cursors are opaque. A body `project_id` is an assertion and never changes the key's fixed project.

Keep the SDK, current OpenAPI, and backend behavior in lockstep. Parse typed problem responses rather than branching on message strings. Pass stable `idempotency_key` values for retryable mutations, and never report a queued review as delivered.
