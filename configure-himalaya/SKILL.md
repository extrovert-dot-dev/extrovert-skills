---
name: configure-himalaya
description: Configure Himalaya or another standard mail client for an Extrovert inbox from export_email_config output. Use when an agent runtime needs IMAP and SMTP settings, a mailbox login, a terminal email client, or raw credentials, and make the direct-SMTP review and compliance bypass explicit before enabling outbound mail.
metadata:
  version: "0.1.0-pre.15"
---

# Configure Himalaya

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

## Critical outbound warning

Direct SMTP sends do not pass through Extrovert review, suppression or contact-list checks, List-Unsubscribe injection, or Extrovert billing and accounting. Extrovert API, SDK, and MCP send, reply, and forward calls always remain governed by the Review Loop, regardless of `direct_smtp_enabled`. Do not describe Himalaya SMTP as equivalent to an Extrovert reviewed send.

If the task only requires reading mail, configure IMAP and leave SMTP unused. If direct SMTP is genuinely required, confirm the user understands the bypass, keep recipient scope narrow, and never use it to evade a failed or pending review.

## Credential safety

- Do not print the generated configuration in shared logs.
- Do not commit it or include it in a prompt.
- Do not copy credentials between inboxes.
- Rotate credentials if the file or terminal output may have been exposed.
- Remove temporary copies after installation.

Use `extrovert-send-email` for governed outbound work and `extrovert-read-inbox` for API/MCP reading and triage.
