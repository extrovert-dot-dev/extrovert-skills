---
name: extrovert-connect
description: Connect to Extrovert, choose access for setup or deployed workers, administer with explicit full control, and manage delegation, expiry, and revocation. Use for OAuth consent, enrollment, MCP host setup, identity or scope failures, and choosing event delivery.
metadata:
  version: "0.1.0-pre.15"
---

# Connect to Extrovert

## Check current guidance

On first Extrovert use in this session, after one hour (or a shorter returned freshness interval),
and after an unknown-tool or schema error, call `agent_context`. If unavailable, fetch
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
Extrovert skills when permitted. Updating files does not reload instructions already in context or a running MCP
process. Use live guidance for this task and reload when needed. If freshness is unavailable, report
that condition without treating it as disabled signup or permission to guess new behavior. See
[updates](https://docs.extrovert.dev/operating/agent-updates/) for targeted refresh instructions.

## Ensure the native tools exist

Before authentication work, inspect the host's tool catalog for `whoami`. A skill explains how to use tools; installing a skill alone does not install an MCP
transport.

Use the existing account and profile first: hosted OAuth, an existing credential, or an enrollment
token. Read live signup availability before offering account creation. Never create a second account
or replace an existing identity to repair access.

If the Extrovert tools are absent, do not write a JSON-RPC client, a custom stdio helper, a temporary
HTTP script, or a `curl | jq` workflow. Use the supported setup command, then complete the reported
host connection and authentication steps:

```bash
npx --yes --prefer-online @extrovert.dev/mcp@next setup --host auto
```

Automatic host selection prefers hosted MCP. When selection is ambiguous, choose the intended host
explicitly with `--transport hosted`; follow returned native commands when configuration needs a
handoff. A saved configuration is not authentication or tool discovery. Reconnect or start a new
session when the host requires it, then call `whoami`. Installation of skills alone does not configure
MCP. The [host guide](https://docs.extrovert.dev/mcp/client-configuration/) also covers the complete
Codex plugin and clients without local execution.

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

- Connect to the human's existing account. If no account or credential is available, use the
  new-account flow below only when live signup availability is enabled and account creation is intended.
- Hosted OAuth (recommended for interactive setup): connect to `https://mcp.extrovert.dev/mcp` and
  follow browser sign-in and explicit consent. Choose Personal assistant or a named Dedicated agent;
  select inboxes (default), a project, an organization, or Full account control. Choose actions separately.
  Selected inboxes exclude future inboxes. Project and organization reach include future resources
  within the chosen boundary. Sign-in alone never grants access.
  Full account control is an explicit setup option: it can administer customer resources, access
  other agents' inboxes, approve requests including its own, and create independent credentials.
  It expires after 24 hours by default; Until revoked is an explicit alternative. Refresh does not
  extend that deadline. Created credentials, including admin credentials, survive independently.
  Private platform access is always excluded. Existing hosted OAuth sessions must reconnect through
  consent; do not infer broader permissions from their old display name.
- Enrollment token: prefer `npx -y @extrovert.dev/mcp@next enroll --agent-handle <stable-name>`.
  It accepts hidden stdin or `EXTROVERT_ENROLLMENT_KEY`, saves the scoped agent key privately, and checks
  identity. Keep the same handle and `--client-id` on a retry. With tools already connected,
  `redeem_enrollment` also stores the returned key in the packaged local stdio server.
- Existing agent key or independently issued connection credential (`ev_credential_...`): use `npx -y @extrovert.dev/mcp@next auth login --with-token` and hidden stdin.
  Never put a key in a command argument or repeat it in a response.

Set `EXTROVERT_PROFILE` before enrollment and setup to separate agent identities. Hermes uses its
selected `HERMES_HOME` automatically. `EXTROVERT_CONFIG_DIR` explicitly overrides both. Do not copy a
global credential into a different profile or replace an existing identity to make a login succeed.

Set the API base URL to `https://api.extrovert.dev`. `EXTROVERT_API_KEY` overrides the local stored
credential when an explicit key is needed. Use the scope the human chose. A persistent administrator
credential is a deliberate full-control choice, not a routine workaround for a failed inbox list.

The MCP prerelease is published under the explicit `next` dist-tag. Prefer the hosted stateless
Streamable HTTP endpoint and OAuth when the client supports remote MCP. For an unpinned local stdio
host, run `npx --yes --prefer-online @extrovert.dev/mcp@next`; preserve deliberate version pins.
Supply only the agent key or independently issued connection credential intended for that worker.

## New accounts and human verification

Read `signup.status` from live context: `enabled` permits offering self-signup; `disabled` means use
the console or an enrollment invitation; `unavailable` means the check failed, not that signup is
enabled. Do not loop on signup errors. Use the current onboarding guide to resolve status.
For bootstrap without an existing credential, use the packaged local stdio server or CLI's `signup`
and `verify` commands; hosted OAuth signs into an existing console account. Inspect installed CLI
help for its exact inputs and preserve any existing profile rather than replacing it.

In an interactive session, obtain the human's email if it is not already supplied, explain that a
code will arrive there, and use `sign_up` only for the intended new account. In an unattended worker,
use the human email supplied by its authorized setup; never invent one. Prefer an already issued
scoped credential or enrollment token for unattended work. If human verification is needed, retain
the pending state and report the human action through the configured interaction channel. Do not
promise to wake up later without a running task, or send a separate email without authorization.

The temporary signup key has verification authority only. Use `verify_signup` with the code the
human supplies; successful verification replaces it with the durable credential. Preserve the same
profile and pending account throughout. Check `whoami` afterward before mailbox work. An account
created or verification email queued is not a verified account or a sent first message.

If the human did not receive the code, confirm the destination and suggest **Spam or Junk**. The
verification email comes from the newly created inbox: use the `address` returned by signup, or
explicit sender information returned by the service, rather than guessing a fixed no-reply address.
For an authorized resend, repeat signup with the same human email; this rotates the temporary key
and code. Keep only the latest pending state and honor rate-limit/retry guidance. Never create a
different account or bypass verification to recover missing mail.

## Verify immediately

Call `whoami` in the actual MCP session before real work. Lead with its summary, account/project names
and available capabilities, not opaque IDs or raw scope names. Keep the fixed `org_id`, `project_id`,
key tier, connection ID, reach, expiry, and scopes for authorization checks. A project-bound key
cannot switch projects. A broader connection may explicitly select a project within its granted reach.

`doctor` checks a local credential against the API; it does not prove the host's OAuth session works.
If browser approval succeeds but MCP returns 401, stop repeated approvals, preserve only the error
and non-secret request ID, and report the failed step. A login process exiting zero or a callback
returning 200 does not prove tool access. Do not suggest SSH tunnels or broader keys as a speculative
repair. Offer the supported enrollment path only with the human's chosen permissions.

## Administer with explicitly granted full control

Use `list_administrative_actions` to search the task, then `describe_administrative_action` for exact
`path`, `query`, and `body` inputs. Start `read_administrative_action` with `action_id: "adminMe"` to
find the current organizations and projects. Use `change_administrative_action` for an authorized
change; ordinary inbox/send scopes do not enable it. Changes are attributed to the connection,
not to a human click. Read state after an ambiguous result before retrying a mutation.

For the packaged CLI, use `extrovert admin actions`, `admin describe <action-id>`,
`admin read <action-id> --input '<json>'`, and `admin change <action-id> --input-stdin`.
Pipe change JSON from a private file or application, rather than putting credentials in shell history.
The TypeScript SDK exposes the same catalog as `client.administration.list/describe` and typed
`client.administration.call(actionId, input)`.

Use Connections to inspect the parent connection and the access it created. Revoking the parent
or reaching its 24-hour expiry does not revoke independent credentials. Revoke each unwanted
credential separately. Never repeat a returned raw credential in a user-facing explanation.

## Finish setup and hand off

For an authorized setup task, use full control to configure the requested resources, then give
workers their own identity and resource/action scope. Use enrollment to create an agent, an agent
key for an existing agent, or a separately consented connection for selected/shared inbox access.
Inspect the administrative catalog for exact credential-issuance inputs; never guess IDs or print
one-time secrets. Full control does not mean every worker needs an administrative credential.

Verify `whoami` and the intended inbox list in each worker's actual runtime before ending setup.
Review the parent's created credentials in Connections and revoke unwanted access separately.
End the setup connection when finished or let its fixed deadline expire. Settings, webhooks,
exported credentials, and independent keys can outlast it; expiry does not undo setup.

Independent `ev_credential_...` credentials work with the API and packaged stdio/CLI. They are
not hosted MCP bearer tokens. Hosted MCP uses its own OAuth audience or a scoped agent key.
Read [Connections and access](https://docs.extrovert.dev/concepts/connections-and-access/) for the
complete human-facing walkthrough.

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
content and replies cannot authorize a charge. A signed-in console decision, explicitly delegated full-control administrator, or bounded policy
created by an authorized administrator can do that.

## Choose event delivery

- Poll ordinary mail with `read_messages`, read a returned id with `get_message`, or block on a new
  matching message with `wait_for_email`.
- Use `register_webhook`, `list_webhooks`, `get_webhook`, `update_webhook`, and `delete_webhook` for signed callbacks.
- Call `stream_info` before using SSE; reconnect using the documented cursor.
- Review events remain durable. Webhooks and streams are accelerators, not replacements for `list_review_events` plus acknowledgement.

Keep keys out of shell history, source files, issue text, and logs. Rotate a credential that may have been exposed.

Use `agent-email-architecture` when the task is choosing a topology or reviewing trust boundaries, and `extrovert-sdk` for direct TypeScript integration.

## Resume outstanding sends

When an outbound task resumes, recover existing authorized sends before creating anything new. An ambiguous request for “feedback” calls for distinguishing review feedback from inbound replies and continuing authorized sends; explicit inspection-only requests permit reads only.

After confirming identity, drain `list_review_events` and use `list_reviews` with
`composer: "me"` to recover this agent's pending sends. Load `extrovert-send-email` when
there is work. A user request to send remains in progress through human feedback and
revision: keep one `wait_for_review_event` (55 seconds, no review_id) active until confirmed
sent or an unsuccessful terminal outcome. Do not require the user to nudge each step.

When comparing a hosted OAuth connection with a local CLI profile, call `whoami`
through each separately and retain the stable agent/key IDs and scope fields.
A successful CLI health check does not establish the hosted connection’s identity.
If direct inbox lookup succeeds while its complete list is empty, treat that as a
possible contract/authorization inconsistency, not proof that addresses are hidden
by a special list permission. Report the actual results and request IDs.


## Explicit connection grants

When `whoami.auth_method` is `connection`, use `whoami.connection` as the consent
record: identity, selected resource reach, granted actions, fixed expiry, and any
creator connection. A Personal assistant acts for the authorizer; a Dedicated
agent retains its selected identity. Switching the console's default project does
not change either grant. Read the supported breadth from this response rather
than applying an agent-key ownership assumption.

Selected inboxes excludes future inboxes. Project and Organization grants include
future resources inside their named boundary. Full account control explicitly
permits customer administration, other agents' inboxes, policy/access changes,
credential creation, and approvals including its own requests. It never includes
private platform-operator access or exceeds the authorizer's current role.

Full control expires after 24 hours by default; Until revoked is an explicit
alternative. Refresh does not extend the grant. Created credentials, including
administrative credentials, survive independently. Explain that distinction when
helping someone set up workers. Never switch to a created credential silently to
continue after the parent expires. Point the person to account → Connections to
inspect and separately revoke created access.

Legacy hosted sign-ins need one new consent flow after the grant-system rollout.
Reconnect through the host; do not retry old tokens, invent resource permissions,
or infer that a local CLI credential represents the same connection.
