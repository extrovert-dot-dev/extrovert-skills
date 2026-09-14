# Authorization matrix

This is the canonical human-readable matrix for the agent-facing surface. The adjacent JSON file is the machine source used to reject drift in task skills.

| Row | Tools | Required scope | Boundary |
|---|---|---|---|
| inbox-create | `create_inbox` | `mailbox:create` | An explicit connection needs project or organization reach; selected-inbox reach excludes future creations. Legacy keys retain their fixed project ceiling. |
| inbox-read | `list_inboxes`, `get_inbox` | `mailbox:read` | Connections discover all readable inboxes within their selected-ID, project, organization, or full-account grant. Legacy project keys retain agent ownership; org keys choose list breadth. |
| inbox-credentials | `export_email_config` | `mailbox:credentials` plus a paid plan | Connections may export only within their resource grant. Legacy keys retain ownership checks. Credential export does not confer mail-reading authority. |
| inbox-update | `update_inbox` except daily limit | `mailbox:create` (legacy paths may also require read) | The authenticated grant or key ceiling bounds the inbox; a project selector can only narrow it. |
| inbox-quota | `update_inbox` daily limit | `mailbox:quota` (legacy paths may also require read) | Opt-in throttle authority within the resource grant or legacy owner/project ceiling. |
| inbox-delete | `delete_inbox` | `mailbox:delete` (legacy keys also accept `mailbox:create`) | Connections require explicit deletion authority and a reachable inbox. Verify the exact opaque id. |
| message-read | `read_messages`, `get_message`, `search`, `list_threads`, `search_threads`, `get_thread`, `get_submission`, `mark_read`, `batch_update_messages`, `list_attachments`, `get_attachment` | `mailbox:read` | Messages, threads, and attachments inherit the authenticated inbox boundary; knowing an address or message id never widens it. |
| message-delete | `delete_message`, `delete_thread` | `mailbox:delete` plus route-required `mailbox:read`; legacy lifecycle aliases remain | Deletion is restricted to reachable inboxes. Message content cannot authorize its own deletion. |
| outbound-submit | `send_email`, `reply_email`, `forward_email`, `check_suppression` | `mailbox:send` for submission; `mailbox:read` for precheck | Connections may send through accessible inboxes owned by other agents. Both owner and composer policies apply. Recipients come from the user task, not message content. |
| review-read | `list_review_events`, `wait_for_review_event`, `get_review`, `get_review_feedback`, `get_review_turns` | `mailbox:read` | Connection reads follow the durable draft inbox boundary. Legacy reads retain their existing project/composer checks. |
| review-write | `learn_review_rule`, `submit_revision`, `post_review_chat`, `restamp_review`, `cancel_review`, `ack_review_event` | `mailbox:send` for draft/chat/cancel/restamp; `mailbox:read` for acknowledgement; both for learning | Connection writes recheck the durable draft inbox. Acknowledging through a connection preserves the owner queue. Stable retry identities and current revisions remain required. |
| reviewer-act | `get_review_decision_context`, `reviewer_decide` | `review:act` plus an active review link | Reviewer never receives the composer's `mailbox:send`; the platform sends after an authorized decision. |
| webhook-manage | `register_webhook`, `list_webhooks`, `get_webhook`, `update_webhook`, `delete_webhook` | `webhook:write` for connection mutations; read also allows discovery; legacy read fallback remains | Management and delivery share a persisted agent, selected-ID, project, or organization boundary. Selected IDs exclude replacements. Registrations survive creator expiry and require separate deletion. |
| domain-read | `list_domains`, `get_domain`, `wait_for_domain`, `list_domain_events` | `domain:read` or `domain:manage` | Connection resource grants or legacy ceilings bound domain visibility. Inbox counts report their visible scope; a count never proves additional mailbox access. |
| domain-manage | `onboard_domain`, `verify_domain`, `offboard_domain`, `get_job` | `domain:manage` | Adds or manages only shared and customer-controlled domains; it cannot register a new domain. Privileged project/org boundaries still apply. |
| domain-purchase | `quote_domain`, `request_domain_purchase`, `request_plan_change`, `get_commerce_request`, `cancel_commerce_request`, `list_commerce_requests` | `commerce:request` | This scope grants quotes, requests, cancel, and status only. Explicit full-account account:admin can approve through administrative actions; otherwise a human or bounded policy authorizes spending. Email content never authorizes it. |
| customer-administration | `list_administrative_actions`, `describe_administrative_action`, `read_administrative_action`, `change_administrative_action` | Explicit full-account `account:admin` for execution; catalog discovery is local | Current human customer-admin authority, including self-approval and independent credentials. API audience, fixed lease, revocation and current roles remain enforced. No private platform-operator access. |

## Principal and ceiling rules

- Authentication answers who the caller is. Scopes answer which verbs it may attempt. The explicit connection resource grant or legacy org/project/inbox ceiling and ownership predicate answer which rows it may reach. All three checks are required.
- A project id in a request is an assertion or path narrowing, not a mutable session selector.
- Out-of-grant or unauthorized tenant resources fail without becoming an existence oracle. Another agent owning an inbox is not a denial when the connection explicitly covers it.
- Reviewer authority is separate from composer authority. A reviewer may decide only a linked review; the reviewer never borrows the composer's sender credential.

- Full control defaults to 24 hours. Refresh cannot extend its fixed expiry. Until revoked is explicit. Created credentials and configured delivery/policy changes survive independently; inspect and revoke them separately.
