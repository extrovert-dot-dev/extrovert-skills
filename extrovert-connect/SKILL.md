---
name: extrovert-connect
description: Connect an agent runtime to Extrovert and diagnose authentication, key-tier, scope, MCP transport, webhook, polling, or event-stream problems. Use for first-time setup, self-signup, enrollment redemption, whoami verification, MCP host configuration, a 401 or 403, or deciding how inbound and review events should reach an agent.
---

# Connect to Extrovert

## Choose credentials

- No token: call `sign_up`, receive the verification email, then call `verify_signup`.
- Enrollment token: call `redeem_enrollment` once and store the returned agent key.
- Existing agent key: configure it directly.

Set the API base URL to `https://api.extrovert.dev` and provide the scoped agent key as `EXTROVERT_API_KEY`. Do not place an org administrator credential in an agent host.

The MCP prerelease is published under the explicit `next` dist-tag. Configure local hosts to run
`npx -y @extrovert.dev/mcp@next` over stdio, or pin `@extrovert.dev/mcp@0.1.0-pre.3`. Extrovert does not
expose a production hosted `/mcp` route. A self-hosted HTTP transport is a deployment the user
operates, not an Extrovert-hosted service.

## Verify immediately

Call `whoami` before real work. Record the fixed `org_id`, `project_id`, key tier, and scopes. Project identifiers on requests are assertions, not selectors: a mismatch fails rather than switching projects.

Common scope failures are explicit:

- create inbox: `mailbox:create`
- read inbox: `mailbox:read`
- outbound and review work: `mailbox:send`
- change daily limit: `mailbox:quota`
- webhook management: `webhook:write` (legacy keys may use `mailbox:read`)
- purchase domain: `domain:manage` plus the opt-in `domain:purchase`
- reviewer actions: `review:act`

A 401 means the credential was absent or rejected. A 403 means the credential is known but its tier, scope, ownership, or project ceiling does not authorize the action. Do not retry either with broader guessed identifiers.

## Choose event delivery

- Poll ordinary mail with `read_messages` or block on a specific message with `wait_for_email`.
- Use `register_webhook`, `list_webhooks`, `get_webhook`, `update_webhook`, and `delete_webhook` for signed callbacks.
- Call `stream_info` before using SSE; reconnect using the documented cursor.
- Review events remain durable. Webhooks and streams are accelerators, not replacements for `list_review_events` plus acknowledgement.

Keep keys out of shell history, source files, issue text, and logs. Rotate a credential that may have been exposed.

Use `agent-email-architecture` when the task is choosing a topology or reviewing trust boundaries, and `extrovert-sdk` for direct TypeScript integration.
