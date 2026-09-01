---
name: configure-himalaya
description: Configure Himalaya or another standard mail client for an Extrovert inbox from export_email_config output. Use when an agent runtime needs IMAP and SMTP settings, a mailbox login, a terminal email client, or raw credentials, and make the direct-SMTP review and compliance bypass explicit before enabling outbound mail.
---

# Configure Himalaya

Call `export_email_config` for the inbox only with an explicitly granted `mailbox:credentials` key on a paid account. Free accounts cannot export these credentials. Never guess a host, username, port, encryption mode, or password. Treat the response as a secret.

<!-- authorization:start -->
| Row | Tools | Required scope | Boundary |
|---|---|---|---|
| inbox-credentials | `export_email_config` | `mailbox:credentials` plus a paid plan | Owner-only portable secret export; free accounts cannot export IMAP/SMTP credentials even if a key carries the scope. |
<!-- authorization:end -->

For Himalaya, request `format: "himalaya"`. Back up an existing `~/.config/himalaya/config.toml`, then merge the returned account block instead of overwriting the file. Restrict file permissions to the current user. Test IMAP by listing a folder before attempting SMTP.

## Critical outbound warning

Direct SMTP sends do not pass through Extrovert review, suppression or contact-list checks, List-Unsubscribe injection, or Extrovert billing and accounting. Prefer Extrovert MCP/API send, reply, and forward tools whenever those controls matter. Do not describe Himalaya SMTP as equivalent to an Extrovert reviewed send.

If the task only requires reading mail, configure IMAP and leave SMTP unused. If direct SMTP is genuinely required, confirm the user understands the bypass, keep recipient scope narrow, and never use it to evade a failed or pending review.

## Credential safety

- Do not print the generated configuration in shared logs.
- Do not commit it or include it in a prompt.
- Do not copy credentials between inboxes.
- Rotate credentials if the file or terminal output may have been exposed.
- Remove temporary copies after installation.

Use `extrovert-send-email` for governed outbound work and `extrovert-read-inbox` for API/MCP reading and triage.
