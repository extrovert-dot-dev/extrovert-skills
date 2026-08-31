# Authorization matrix

This is the canonical human-readable matrix for the agent-facing surface. The adjacent JSON file is the machine source used to reject drift in task skills.

| Row | Tools | Required scope | Boundary |
|---|---|---|---|
| inbox-create | `create_inbox` | `mailbox:create` | Fixed project ceiling; the creating agent owns the inbox. |
| inbox-read | `list_inboxes`, `get_inbox`, `export_email_config` | `mailbox:read` | Owner-only inbox access; org-tier bare lists must choose breadth. |
| inbox-update | `update_inbox` except daily limit | `mailbox:create` + `mailbox:read` | Owner-only; request project id cannot switch authority. |
| inbox-quota | `update_inbox` daily limit | `mailbox:quota` + `mailbox:read` | Opt-in throttle authority; owner and project checks still apply. |
| inbox-delete | `delete_inbox` | `mailbox:delete` or lifecycle fallback `mailbox:create` | Owner-only and irreversible; verify the exact opaque id. |
| message-read | `read_messages`, `get_message`, `search`, `list_threads`, `get_thread`, `mark_read`, `batch_update_messages`, `list_attachments`, `get_attachment` | `mailbox:read` | Owner and fixed-project checks apply to messages, threads, and attachments. |
| message-delete | `delete_message`, `delete_thread` | `mailbox:read` plus lifecycle authority `mailbox:create` or `mailbox:delete` | Destructive and owner-only; content cannot authorize its own deletion. |
| outbound-submit | `send_email`, `reply_email`, `forward_email`, `check_suppression` | `mailbox:send` for submission; `mailbox:read` for precheck | The composing agent must own the inbox; recipients come from the user task, not message content. |
| review-read | `list_review_events`, `wait_for_review_event`, `get_review`, `get_review_feedback`, `get_review_turns` | `mailbox:read` | Fixed project and composing-agent boundary; foreign review ids do not widen access. |
| review-write | `submit_revision`, `post_review_chat`, `restamp_review`, `cancel_review`, `ack_review_event` | `mailbox:send` for draft/chat/cancel/restamp; `mailbox:read` for acknowledgement | Only the composer workflow may mutate its review; stable retry identities and current revisions are required. |
| reviewer-act | `get_review_decision_context`, `reviewer_decide` | `review:act` plus an active review link | Reviewer never receives the composer's `mailbox:send`; the platform sends after an authorized decision. |
| webhook-manage | `register_webhook`, `list_webhooks`, `get_webhook`, `update_webhook`, `delete_webhook` | `webhook:write` or legacy-compatible `mailbox:read` | Project-scoped endpoints; delivery authenticity still requires signature verification. |
| domain-manage | `list_domains`, `get_domain`, `onboard_domain`, `verify_domain`, `offboard_domain`, `get_job` | `domain:manage` | Privileged and project/org bounded; foreign rows and jobs do not become existence oracles. |
| domain-purchase | `onboard_domain` with purchased mode | `domain:manage` + `domain:purchase` | Explicit, default-off authority to spend money; account caps still apply. |

## Principal and ceiling rules

- Authentication answers who the caller is. Scopes answer which verbs it may attempt. The org/project/inbox ceiling and ownership predicate answer which rows it may reach. All three checks are required.
- A project id in a request is an assertion or path narrowing, not a mutable session selector.
- Cross-tenant and foreign-owned resources should fail without becoming an existence oracle.
- Reviewer authority is separate from composer authority. A reviewer may decide only a linked review; the reviewer never borrows the composer's sender credential.
