---
name: extrovert-connect
description: Connect an agent runtime to Extrovert and diagnose authentication, key-tier, scope, MCP transport, webhook, polling, or event-stream problems. Use for first-time setup, self-signup, enrollment redemption, whoami verification, MCP host configuration, a 401 or 403, or deciding how inbound and review events should reach an agent.
---

# Connect to Extrovert

## Ensure the native tools exist

Before authentication work, inspect the host's tool catalog for `sign_up`, `verify_signup`, and
`whoami`. A skill explains how to use tools; installing a skill alone does not install an MCP
transport.

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

For Claude Code, use `npx -y @extrovert.dev/mcp@next setup --host claude`; Cursor and generic-host
configuration are at `https://docs.extrovert.dev/mcp/client-configuration/`. If host configuration is
not writable, report that exact blocker and use the packaged `extrovert` CLI as the explicit fallback;
do not invent another transport.

## Choose credentials

- Hosted OAuth (recommended for an existing human console account): connect the MCP client to `https://mcp.extrovert.dev/mcp`, follow its
  browser sign-in and consent flow, then let the client store and refresh the OAuth grant. No API key
  is pasted into client configuration. The initial grant maps to the user's default project and
  allows ordinary create/read/send/webhook work; destructive deletes, quota changes, domain
  management, purchasing, and reviewer authority stay excluded.
- No token: call `sign_up`, receive the verification email, then call `verify_signup`. The
  limited bootstrap key has only `signup:verify` and expires with the code; it cannot read or send
  mail. Successful verification revokes it and returns
  the durable full-scope key. The packaged local stdio server stores only that replacement key in
  its permission-restricted credential file and reloads it in future sessions.
- Enrollment token: call `redeem_enrollment` once. The packaged local stdio server stores the
  returned full key automatically.
- Existing agent key: configure it directly.

Set the API base URL to `https://api.extrovert.dev`. `EXTROVERT_API_KEY` overrides the local stored
credential when an explicit key is needed. Do not place an org administrator credential in an agent host.

The MCP prerelease is published under the explicit `next` dist-tag. Prefer the hosted stateless
Streamable HTTP endpoint and OAuth when the client supports remote MCP. For a local stdio host, run
`npx -y @extrovert.dev/mcp@next` or pin `@extrovert.dev/mcp@0.1.0-pre.6` and supply only a scoped
agent key.

## Verify immediately

Call `whoami` before real work. Record the fixed `org_id`, `project_id`, key tier, and scopes. Project identifiers on requests are assertions, not selectors: a mismatch fails rather than switching projects.

## Use the signup inbox immediately

`verify_signup` is the handoff into ordinary mailbox work. It switches the current MCP session to the
durable key, repeats the ready inbox address, and returns copy-ready calls under
`mailbox_quickstart`:

1. Call `read_messages` with the returned inbox. It already returns readable previews and structured
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
- webhook management: `webhook:write` (legacy keys may use `mailbox:read`)
- purchase domain: `domain:manage` plus the opt-in `domain:purchase`
- reviewer actions: `review:act`

A 401 means the credential was absent or rejected. A 403 means the credential is known but its tier, scope, ownership, or project ceiling does not authorize the action. Do not retry either with broader guessed identifiers.

## Choose event delivery

- Poll ordinary mail with `read_messages`, read a returned id with `get_message`, or block on a new
  matching message with `wait_for_email`.
- Use `register_webhook`, `list_webhooks`, `get_webhook`, `update_webhook`, and `delete_webhook` for signed callbacks.
- Call `stream_info` before using SSE; reconnect using the documented cursor.
- Review events remain durable. Webhooks and streams are accelerators, not replacements for `list_review_events` plus acknowledgement.

Keep keys out of shell history, source files, issue text, and logs. Rotate a credential that may have been exposed.

Use `agent-email-architecture` when the task is choosing a topology or reviewing trust boundaries, and `extrovert-sdk` for direct TypeScript integration.
