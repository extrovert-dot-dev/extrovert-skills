# Inbox, domain, and event diagnostics

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
2. Pass a returned `msg_...` id to `get_message`. Use `format: "text", variant: "extracted"` for concise
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

A 401 means the credential was absent or rejected. A 403 can indicate either an access refusal or
an exhausted quota; read the error reason and counts before choosing a recovery action. Do not
retry with broader guessed identifiers.

For inbox creation, `inbox_limit_exceeded` means billing account capacity across all organizations
and projects sharing that account. `enrollment_token_mailbox_budget_exhausted` means the enrollment
key lifetime creation allowance shared by its agents. A key at 5/7 can still hit an account at 10/10.
Deleting unused inboxes frees account capacity but does not refund key slots; raising a key allowance
does not raise the account cap. Neither count is send volume. Relay the exact reason and counts,
not a plan limit inferred from your visible inboxes. An authorized administrator can remove unused
inboxes or change the account plan. Plan-change requests and listing commerce requests require
`commerce:request`; if absent, hand off these diagnostics instead of claiming an upgrade is mandatory.
See [Rate limits and quotas](https://docs.extrovert.dev/operating/limits/#lifetime-inbox-creation).

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

When an outbound task resumes, recover existing authorized sends before creating anything new. An ambiguous request for "feedback" calls for distinguishing review feedback from inbound replies and continuing authorized sends; explicit inspection-only requests permit reads only.

After confirming identity, drain `list_review_events` and use `list_reviews` with
`composer: "me"` to recover this agent's pending sends. Load `extrovert-send-email` when
there is work. A user request to send remains in progress through human feedback and
revision: keep one `wait_for_review_event` (55 seconds, no review_id) active until confirmed
sent or an unsuccessful terminal outcome. Do not require the user to nudge each step.
