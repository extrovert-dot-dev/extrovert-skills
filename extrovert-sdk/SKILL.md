---
name: extrovert-sdk
description: Build or troubleshoot a TypeScript integration against the Extrovert REST API using the current SDK source and OpenAPI contract. Use for delegated administrative workflows, client construction, org/project/inbox addressing, thread workflows, pagination, error handling, commerce requests, reviewed sends, OTP waits, webhooks, streams, signature verification, or offline fixture tests.
metadata:
  version: "0.1.0-pre.24"
---

# Extrovert TypeScript SDK

## Check current guidance

On first Extrovert use in this session, after one hour (or a shorter returned freshness interval),
and after an unknown-tool or schema error, inspect the current tool catalog. Call `agent_context`
only if present; otherwise fetch
https://mcp.extrovert.dev/.well-known/agent-contract.json, then https://docs.extrovert.dev/llms.txt.
An installed or pinned CLI can run `agent status --json` if supported. Only when normal installation
policy permits an unpinned CLI, use
`npx --yes --prefer-online @extrovert.dev/mcp@next agent status --json`.
Read the live guide for current product behavior and use the host's current tool schemas. If a
schema remains stale, refresh the catalog or reconnect before continuing; inspect state before
retrying an uncertain mutation.

Compare this skill's `metadata.version` with its version in live context. A difference signals a
refresh to consider, not incompatibility, permission to downgrade, or authorization to install.
Preserve explicit pins, local edits, the installation manager, and scope; refresh only the installed
Extrovert skills when permitted. Updating files requires two separate reloads: reload and re-read each changed `SKILL.md`, then
restart changed local MCP processes or refresh hosted discovery. If a new session is needed, report
that pending step; use live guidance for this task. If freshness is unavailable, report
that condition without treating it as disabled signup or permission to guess new behavior. See
[updates](https://docs.extrovert.dev/operating/agent-updates/) for targeted refresh instructions.

The prerelease package is published under the explicit `next` dist-tag. Use
`npm install @extrovert.dev/sdk@next`, or pin `@extrovert.dev/sdk@0.1.0-pre.13` for reproducible dogfood
tests. The public REST API and served OpenAPI remain the underlying contract. Do not imply that a
hosted MCP route substitutes for the SDK; use the SDK for direct TypeScript application integration.

## Choose the smallest mode

- Basic client, authentication, inbox handles, thread reads/search, project addressing, pagination, metadata, commerce requests, or errors: read [references/core-client.md](references/core-client.md).
- Customer administration, credential handoff, and revocation: read [references/administration.md](references/administration.md).
- Sending, replying,- Sending, replying, forwarding, durable review events, revisions, or rules: read [references/review-loop.md](references/review-loop.md).
- Webhooks, signature verification, SSE, or offline fixtures: read [references/events-and-testing.md](references/events-and-testing.md).

Use `whoami()` as the authority source. Prefer the canonical `projects.inboxes.*` chain when project breadth matters; inbox ids and cursors are opaque. A body `project_id` asserts the active project. Legacy keys keep their fixed project; a connection can select a project only within its consented reach. Use `whoami.connection` when present instead of applying legacy ownership assumptions.

Keep the SDK, current OpenAPI, and backend behavior in lockstep. Parse typed problem responses rather than branching on message strings. Pass stable `idempotency_key` values for retryable mutations, and never report a queued review as delivered.
