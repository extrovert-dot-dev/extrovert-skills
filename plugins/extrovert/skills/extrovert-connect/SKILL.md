---
name: extrovert-connect
description: Connect an existing Extrovert account, resume signup, or diagnose identity and access. Use for OAuth, enrollment, host setup, and connection recovery; broader administration needs explicit consent.
metadata:
  version: "0.1.0-pre.42"
---

# Connect to Extrovert

Reuse working access. A console handoff means an existing account; missing local
credentials do not mean a new customer. Ask about account intent only when unclear.
Do not create another account to repair a connection or start a test email without
permission. A pending signup takes precedence over a new browser login.

## Choose the shortest working path

1. If this host already has Extrovert tools, use their current schemas. On first
   use, after the returned freshness interval (normally one hour), or after a
   schema error, inspect the catalog and call `agent_context` if available.
   Without it, fetch https://mcp.extrovert.dev/.well-known/agent-contract.json and
   use https://docs.extrovert.dev/llms.txt to select only the needed guide.
2. Prefer the host's remote MCP/OAuth connection when supported: it requires no
   local Node, compiler, SDK, or source checkout. The full endpoint is
   `https://mcp.extrovert.dev/mcp`. Use an already installed plugin's endpoint
   unchanged. Installation of skills alone does not connect tools.
3. If remote MCP is unavailable, reuse an installed CLI. Its published package
   needs Node >=20 but no TypeScript compiler, pnpm, Git, or Docker. Read
   [installation](references/installation.md) only to install, update, or repair
   the host. Do not install a runtime merely because a different path mentioned it.
4. An agent with secure HTTPS execution but no MCP/Node can use the
   [HTTPS recipes](https://docs.extrovert.dev/quickstart/https/). If the host has
   neither authenticated tools nor executable HTTPS, hand off the specific human
   step. Do not invent a transport or confuse the human's laptop with the agent runtime.

## Connect the intended identity

For existing accounts, authorize through this host's native OAuth action. Local
CLI/stdio `auth login` is an alternative, not a second required login and not
proof of a hosted session. Give the sign-in URL/action to the person in this chat;
never infer their Extrovert email from a local or model-provider account.

Recommend Dedicated agent, Selected inboxes, and Read and send for ordinary email.
Identity, resource reach, and actions are separate. Selected inboxes excludes
future inboxes. Creation needs appropriate project/organization reach and
`mailbox:create`, not Full account control. Never widen access to fix an empty list.
For credential enrollment, worker delegation, expiry, or denied access, read
[access and diagnostics](references/access.md). Full account control requires an
explicit administration request; created credentials can outlive that connection.

Call `whoami` in the actual connection, then `list_inboxes` and `get_inbox` for
its intended inbox. Lead with account/project names and capabilities; retain IDs,
scopes, reach and expiry privately. A saved configuration, successful browser
callback, or CLI health check does not prove hosted MCP access. After repeated
401s at the same stage, stop approvals and report its sanitized error/request ID.

## Resume, then do useful work

- New account or pending `signup:verify` credential: read
  [signup](references/signup.md) before acting. Preserve the original account,
  profile and expiry. Wait for actual human proof; never invent a code or approve it.
- Existing authorized send or "any feedback?": use `list_reviews` with
  `composer: "me"` and `list_review_events`, then load `extrovert-send-email`
  and `extrovert-writing-rules`. Resume the same draft. Inspection-only means reads only.
- Missing inboxes, domain readiness, capacity, or event delivery: read
  [inboxes and events](references/inboxes-and-events.md) only for that problem.

Report the proven milestone and next action: connected identity, draft awaiting
review, or confirmed sent message. A claimed inbox still needs credential exchange;
a queued draft is unsent; sent is not proof of receipt. A stopped host cannot wake
itself by polling. Preserve secrets, existing pins, installation scope and retry IDs.
