---
name: extrovert-connect
description: Connect an agent runtime to Extrovert and diagnose authentication, key-tier, scope, MCP transport, webhook, polling, or event-stream problems. Use for first-time setup, self-signup, enrollment redemption, whoami verification, MCP host configuration, a 401 or 403, or deciding how inbound and review events should reach an agent.
---

# Connect to Extrovert

## Ensure the native tools exist

Before authentication work, inspect the host's tool catalog for `whoami`. A skill explains how to use tools; installing a skill alone does not install an MCP
transport.

Self-signup is currently disabled. Use an existing agent key or an enrollment
token. Do not start signup or create a second account for an existing customer.

If the Extrovert tools are absent, do not write a JSON-RPC client, a custom stdio helper, a temporary
HTTP script, or a `curl | jq` workflow. Install one supported connection and start a new session:

```bash
# Complete Codex plugin: skills + packaged stdio MCP
codex plugin marketplace add extrovert-dot-dev/extrovert-skills
codex plugin add extrovert@extrovert

# Or configure the packaged MCP server directly
npx -y @extrovert.dev/mcp@next setup --host codex

# Or use hosted OAuth when the human already has an Extrovert console account
codex mcp add extrovert --url https://mcp.extrovert.dev/mcp
codex mcp login extrovert
```

For Hermes, select its intended profile first (the corresponding `HERMES_HOME`), then use
`npx -y @extrovert.dev/mcp@next setup --host hermes --transport hosted` followed by
`hermes mcp login extrovert`. For local enrollment use `--transport stdio` instead. The setup command
preserves other servers and refuses to overwrite an existing Extrovert entry. A saved configuration
does not mean authentication or tool enablement succeeded: start a new Hermes session and call `whoami`.

For Claude Code, use `npx -y @extrovert.dev/mcp@next setup --host claude`; Cursor and generic-host
configuration are at `https://docs.extrovert.dev/mcp/client-configuration/`. If host configuration is
not writable, report that exact blocker and use the packaged `extrovert` CLI as the explicit fallback;
do not invent another transport.

## Choose credentials

- Connect to the human's existing account. If no account or credential is available, ask the human
  to obtain access through the console; self-signup is disabled.
- Hosted OAuth (recommended for an existing human console account): connect the MCP client to `https://mcp.extrovert.dev/mcp`, follow its
  browser sign-in and consent flow, then let the client store and refresh the OAuth grant. No API key
  is pasted into client configuration. The initial grant maps to the user's default project and
  allows ordinary create/read/send/webhook work plus non-spending commerce requests; destructive
  deletes, quota changes, connecting/removing domains, human approvals, and reviewer authority stay excluded.
  Domain status reads are available without granting domain management.
- Enrollment token: prefer `npx -y @extrovert.dev/mcp@next enroll --agent-handle <stable-name>`.
  It accepts hidden stdin or `EXTROVERT_ENROLLMENT_KEY`, saves the scoped agent key privately, and checks
  identity. Keep the same handle and `--client-id` on a retry. With tools already connected,
  `redeem_enrollment` also stores the returned key in the packaged local stdio server.
- Existing agent key: use `npx -y @extrovert.dev/mcp@next auth login --with-token` and hidden stdin.
  Never put a key in a command argument or repeat it in a response.

Set `EXTROVERT_PROFILE` before enrollment and setup to separate agent identities. Hermes uses its
selected `HERMES_HOME` automatically. `EXTROVERT_CONFIG_DIR` explicitly overrides both. Do not copy a
global credential into a different profile or replace an existing identity to make a login succeed.

Set the API base URL to `https://api.extrovert.dev`. `EXTROVERT_API_KEY` overrides the local stored
credential when an explicit key is needed. Do not place an org administrator credential in an agent host.

The MCP prerelease is published under the explicit `next` dist-tag. Prefer the hosted stateless
Streamable HTTP endpoint and OAuth when the client supports remote MCP. For a local stdio host, run
`npx -y @extrovert.dev/mcp@next` or pin `@extrovert.dev/mcp@0.1.0-pre.7` and supply only a scoped
agent key.

## Verify immediately

Call `whoami` in the actual MCP session before real work. Lead with its summary, account/project names
and available capabilities, not opaque IDs or raw scope names. Keep the fixed `org_id`, `project_id`,
key tier and scopes for authorization checks. Project identifiers are assertions, not selectors:
a mismatch fails rather than switching projects.

`doctor` checks a local credential against the API; it does not prove the host's OAuth session works.
If browser approval succeeds but MCP returns 401, stop repeated approvals, preserve only the error
and non-secret request ID, and report the failed step. A login process exiting zero or a callback
returning 200 does not prove tool access. Do not suggest SSH tunnels or broader keys as a speculative
repair. Offer the supported enrollment path only with the human's chosen permissions.

## Explain domain readiness

Use `get_domain` or `extrovert domain status <domain>`. Present `readiness.label` and `summary` first.
Never infer readiness from `verified`, DKIM, delegation mode, or zero deliverability findings.
When `ready_for_inboxes` is true, say the domain is ready to use. Explain the visible inbox count:
offer inbox creation when zero, or use of existing ready inboxes. Counts are scoped; never claim that
zero visible inboxes means the entire account has none. Creation still needs permission and capacity;
sending follows the inbox's review policy.

If the customer must act, show the DNS entries and offer `verify_domain` / `domain recheck` after they
add them. If Extrovert must act, say the customer's entries are confirmed only when the summary says
so; do not ask for more DNS changes. Use `wait_for_domain` / `domain wait` for a bounded check. A
`timed_out` result is not a setup failure: resume after `resume_after_seconds`.

Save `list_domain_events.next_cursor` and pass it as `after` for the same domain, including after a
restart. Drain `has_more`, otherwise wait `poll_after_seconds`. Summarize new ready, action-needed or
recovered events for the human. Extrovert emails verified account administrators, but polling cannot
wake a disconnected agent. Do not promise a future agent update without an active host task.

## Use the intended inbox

After `whoami`, use `list_inboxes` and select the intended inbox, or create one if the user requested it:

1. Call `read_messages` with that inbox. It already returns readable previews and structured
   message fields.
2. Pass a returned `msg_…` id to `get_message`. Use `format: "text", variant: "extracted"` for concise
   reading; use `variant: "source"` when exact MIME text, signatures, or quoted history matter.
3. Call `wait_for_email` with the same inbox when waiting for a new reply, OTP, or verification link.

Do not download response files, construct REST routes, or invoke `jq` for ordinary MCP mailbox work.
Raw HTTP is a last fallback for a runtime that genuinely supports neither MCP, the packaged CLI, nor
an SDK; missing MCP configuration is not a reason to write transport code. Before sending or
replying, load `extrovert-send-email`; outbound mail is governed by the inbox review policy.

Common scope failures are explicit:

- create inbox: `mailbox:create`
- read inbox: `mailbox:read`
- export raw IMAP/SMTP credentials: `mailbox:credentials` plus a paid plan (free accounts cannot export them)
- outbound and review work: `mailbox:send`
- change daily limit: `mailbox:quota`
- read domain readiness and events: `domain:read` or `domain:manage`
- connect domains, recheck DNS, or offboard: `domain:manage`
- webhook management: `webhook:write` (legacy keys may use `mailbox:read`)
- quote or request a domain purchase/plan change: `commerce:request` (never approval authority)
- reviewer actions: `review:act`

A 401 means the credential was absent or rejected. A 403 means the credential is known but its tier, scope, ownership, or project ceiling does not authorize the action. Do not retry either with broader guessed identifiers.

For commerce, `quote_domain` is non-spending. `request_domain_purchase` and `request_plan_change`
create durable requests; they do not approve or execute them. Recover and poll with
`list_commerce_requests` and `get_commerce_request`, or withdraw the agent's own pending request with
`cancel_commerce_request`. Surface the platform approval URL and exact
blocker to the human. Extrovert sends the billing owner a notification automatically, but email
content and replies cannot authorize a charge. Only the signed-in console or a bounded policy the
human created earlier can do that.

## Choose event delivery

- Poll ordinary mail with `read_messages`, read a returned id with `get_message`, or block on a new
  matching message with `wait_for_email`.
- Use `register_webhook`, `list_webhooks`, `get_webhook`, `update_webhook`, and `delete_webhook` for signed callbacks.
- Call `stream_info` before using SSE; reconnect using the documented cursor.
- Review events remain durable. Webhooks and streams are accelerators, not replacements for `list_review_events` plus acknowledgement.

Keep keys out of shell history, source files, issue text, and logs. Rotate a credential that may have been exposed.

Use `agent-email-architecture` when the task is choosing a topology or reviewing trust boundaries, and `extrovert-sdk` for direct TypeScript integration.
