# Sender names and existing policy exceptions

## Prepare and submit

Read `get_inbox.human_email_review` alongside the effective policy. The default-off
"Skip review for emails to you" setting applies account-wide only when exactly one
To recipient is the verified human email and Cc/Bcc are empty. No aliases or duplicate
entries qualify; SMTP envelope must also match. Continue applying all writing rules,
intent/composition requirements, suppression and limits. Other recipients keep their
usual policy, including independently authorized category auto-send. The backend, not
your assertion, approves as `human_recipient_auto`; this is not human approval or
graduation evidence. Protected signup practice always requires review. Ordinary agents
cannot enable the setting; use its settings_url when relevant, without repeatedly
prompting the human. Only human administration or explicit Full account control can change it.

## Sender display names

Use inbox `display_name` for the sender name on API mail. Use the inbox management workflow
(or SDK inbox create/update) to set it; do not put a full `Name <address>` in
`from` or try `headers.From`. Up to 60 Unicode characters after normalization;
use a clear personal or organization name without emoji, unsupported invisible characters,
embedded addresses, styled letters or fake thread markers. Ordinary `Support`
and bilingual names are valid. Contextually valid Persian and Indic join controls
are supported; the service validates their context. An error is a request to correct the name, not to
encode, escape or obfuscate it to bypass validation. Ask for a safe replacement
when the requested identity cannot be represented safely.

Create omission/empty uses the local part; update omission leaves unchanged and
`display_name: ""` clears to bare-address API mail. Read the normalized result.
Existing reviews retain their captured name. SMTP uses the client's own validated
From name, including an intentionally bare address; changing the inbox name does
not rewrite that SMTP name. Neither setting changes the authorized sender address,
review requirement, plan entitlement or proves identity/delivery.


## Internal email review exceptions

Read `get_inbox.internal_email_review` (SDK: inbox detail) alongside the existing human-recipient exception. Project and organization exceptions start off. Every final To/Cc/Bcc recipient must resolve to an inbox in the sender's enabled project or exact organization. Shared domains, aliases, shared humans, child organizations, and mixed external recipients do not qualify. Organization enablement includes current and future projects; project-off does not override it. These settings grant no inbox access.

Ordinary agents and project managers cannot enable these settings. A current owner/admin or explicitly delegated Full account control can change them using the existing administrative review-policy operation. Explain a returned settings URL when relevant, but do not repeatedly solicit enablement, widen your authority, or split recipients to evade review. Apply writing rules and intent, then submit normally and follow the returned sent/queued result. Sending limits and protected onboarding review remain in force. See https://docs.extrovert.dev/review-loop/agent-contract/#email-between-agents-without-review.
