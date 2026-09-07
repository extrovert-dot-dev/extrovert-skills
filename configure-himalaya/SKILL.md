---
name: configure-himalaya
description: Configure Himalaya or another standard mail client for an Extrovert inbox from export_email_config output. Use when an agent runtime needs IMAP and SMTP settings, a mailbox login, a terminal email client, or raw credentials, and explain SMTP review holds, delivery status and safe retries before enabling outbound mail.
metadata:
  version: "0.1.0-pre.20"
---

# Configure Himalaya

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

Call `export_email_config` for the inbox only with an explicitly granted `mailbox:credentials` key on a paid account. Free accounts cannot export these credentials. Never guess a host, username, port, encryption mode, or password. Treat the response as a secret.

Receiving credentials does not enable direct SMTP. Check the inbox's
`direct_smtp_enabled` value first. It defaults to false; an authorized customer administrator
or explicitly granted Full account control connection can change it per inbox. Ordinary mail
permissions cannot. It is effective only while paid entitlement remains
active. The same password can authenticate IMAP and SMTP, but the mail server
rejects raw SMTP when the effective setting is false.

<!-- authorization:start -->
| Row | Tools | Required scope | Boundary |
|---|---|---|---|
| inbox-credentials | `export_email_config` | `mailbox:credentials` plus a paid plan | Connections may export only within their resource grant. Legacy keys retain ownership checks. Credential export does not confer mail-reading authority. |
<!-- authorization:end -->

For Himalaya, request `format: "himalaya"`. Back up an existing `~/.config/himalaya/config.toml`, then merge the returned account block instead of overwriting the file. Restrict file permissions to the current user. Test IMAP by listing a folder before attempting SMTP.

## Outbound review and delivery

Direct SMTP follows the inbox and account review policies. A required human review
is held in the Extrovert review thread; approval, edits, rejection and feedback
happen there. An SMTP `250` response means accepted custody, not delivery. Check
review status before describing the message as sent. A client's original Sent
copy is not proof of delivery, and review edits do not rewrite that local copy.

Keep the same Message-ID and content when retrying an uncertain SMTP submission.
The retry resolves to the same review, including after approval or rejection.
Changed content needs a new Message-ID. Never work around a pending or rejected
review by submitting a new identity without authorization for a new message.

SMTP supports up to 8 MiB of plain text/HTML MIME and ordinary attachments.
Signed/encrypted messages, inline/CID content, embedded messages and unsupported
MIME are refused before acceptance. To/Cc/Bcc and supported attachment bytes are
preserved. Recipient restrictions, suppression, unsubscribe policy and billing
apply at final dispatch. SMTP does not supply the structured intent, category or
writing-rule attestation available through API/MCP composition tools.

If the task only requires reading mail, configure IMAP and leave SMTP unused.

## Credential safety

- Do not print the generated configuration in shared logs.
- Do not commit it or include it in a prompt.
- Do not copy credentials between inboxes.
- Rotate credentials if the file or terminal output may have been exposed.
- Remove temporary copies after installation.

Use `extrovert-send-email` for governed outbound work and `extrovert-read-inbox` for API/MCP reading and triage.
