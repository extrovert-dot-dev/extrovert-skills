# New-account signup and ownership proof

## Optional Startup gift

Ask for **human email**: the address the person personally reads, and pass it as
`human_email`. If they supplied a gift code, pass optional `gift_code` during the
same signup. The CLI accepts `--gift-code`, `--source`, and `--referrer`. Preserve
these fields with the existing pending signup. SDK and MCP integrations supply
truthful integration attribution; never guess the underlying model identity.

A gift result of **pending human claim** is not **gift active**. Email activation
only activates the existing agent credentials. Direct the human to sign up or
sign in with that same human email, then **Connect workspace and claim gift**.
The human explicitly claims 30 days of Startup for the existing workspace. No
credit card is required. Invalid or expired gift codes do not prevent ordinary
signup or workspace connection; correct the code in Billing. Never create a
second account, inbox identity, or workspace to retry a gift.

The gift includes up to 150 inboxes and 10 projects, normally $200/month. Domain
registration is separate. At the deadline, the account returns to Free and keeps
its stored resources unless the human explicitly chooses a paid plan. Only report
**gift active** after Billing or the claim response confirms activation. Saving a
card for another purpose is not renewal consent.

## New accounts and human verification

Read `signup.status` from live context: `enabled` permits offering self-signup; `disabled` means use
the console or an enrollment invitation; `unavailable` means the check failed, not that signup is
enabled. Preserve credentials on errors. A generic forbidden response does not prove an existing account; do not invent that diagnosis or delete credentials. For maintenance, honor Retry-After and retry within a bounded active session. Use the current onboarding guide to resolve status.
For bootstrap without an existing credential, use the packaged local stdio server or CLI's `signup`
and `verify` commands; hosted OAuth signs into an existing console account. Inspect installed CLI
help for its exact inputs and preserve any existing profile rather than replacing it.

In an interactive session, obtain the human's email if it is not already supplied and use `sign_up`
only for the intended new account. Follow the activation method returned by signup. In an unattended worker,
use the human email supplied by its authorized setup; never invent one. Prefer an already issued
scoped credential or enrollment token for unattended work. If human verification is needed, retain
the pending state and report the human action through the configured interaction channel. Do not
promise to wake up later without a running task, or send a separate email without authorization.

When `activation_method` is `incoming_email`, signup reserves the inbox for 24 hours. Keep the
limited key and tell the human: "Send an email from {human_email} to {address} to activate your
agent's inbox and link it to your human email." Use the returned addresses; any subject or body works.
Also offer the browser alternative: visit https://extrovert.dev -> **Sign up**, use that same human email, and **Connect workspace** if prompted. Already registered console users choose **Sign in**. This connects the existing agent workspace; it does not reserve another inbox.
Give the human these instructions before waiting. While the session is active, call
`check_activation` with `wait_seconds: 55`, repeating pending waits while the authorized host remains active.
On a host supporting the negotiated MCP Tasks extension, this same tool can return
a durable observer handle. Let the host retrieve its result; completion is evidence
to inspect, not permission to skip `verify_signup`. Without Tasks, an available
packaged CLI's `verify --wait-seconds 86400` watches quietly across short requests.
Keep the agent turn active and collect the process result. Cancelling or expiring
the observer does not discard the reservation or extend its original expiry.
A timeout preserves the reservation; explain how to resume with the same profile. If the human
says they sent it, check immediately. Only after `proven`, call `verify_signup` without an OTP.
If a resumed `whoami` has only `signup:verify`, finish this same exchange first, even when a practice review already exists. Use `check_activation`, then `verify_signup` after proof; the CLI equivalent is `extrovert verify`. Missing mail permissions at this stage do not require OAuth, broader access, or a full host restart.
No verification email is sent to the human in this flow. Do not ask them to find a code or try to
read the pending inbox. Its key cannot read or send mail, export messages, or configure forwarding
or webhooks. A reservation is not a verified account or a sent first message.

A mismatched sender does not replace the expected human. Before proof, to correct a typo, use
`correct_activation_email` with the current revision, then request a fresh matching email; the
original expiry stays fixed. Same-email console signup or sign-in with explicit workspace connection is an
alternative. Existing account owners enroll agents through their console.

For a **legacy response that actually issued an OTP**, use the human-supplied code with
`verify_signup` before its original expiry. If that verification email is missing, confirm the
returned destination and suggest **Spam or Junk**. Use the returned sender or signup `address`,
not a guessed no-reply address. Consult the current response and recovery guidance before a resend;
do not assume another signup issues an OTP or extends the reservation.

Preserve the same profile and pending account throughout. Successful verification exchanges the
temporary key for a durable credential; check `whoami` afterward before mailbox work. Never create
a different account or bypass activation to recover missing mail.

Signup accepts `display_name` separately from the address `username`. Preserve the human's chosen
sender name; omit it for the validated Agent {username} default. Show the actual returned sender,
plan, console URL and onboarding guidance after verification. Verify `whoami` in the actual host.
The packaged local stdio process and CLI share both the pending and durable credentials in the
selected profile. An explicit environment key still overrides that profile. In Hermes, continue
through the packaged CLI during initial setup while native MCP discovery is pending. Incoming
CLI `signup` displays the instructions and watches for up to 30 minutes by default, completing verification
when proof arrives. `verify --wait-seconds 86400` resumes that bounded watch. Do not require a human
"I sent it" nudge or a full Hermes restart. Keep your agent turn active until the terminal command completes: a background CLI process cannot resume your conversation. If the host returns a running process ID, use its process polling tool to read completion, then continue with whoami and the practice review. Do not end the turn by promising that a background watch will continue the review for you. Hermes can reload MCP configuration while idle;
`/reload-mcp` is its manual fallback. Verify MCP `whoami` when the tools become available; CLI
identity alone only verifies the CLI connection.

Extrovert automatically prepares one deliberately fluffy practice draft when ownership proof is
accepted, even if the agent is offline. The draft belongs to this agent; the system template is
identified separately. Recover `onboarding.starter` from verification or `signup_starter` from
`whoami`. Use its exact review ID/path/status, `list_reviews` with `composer: "me"`, and
`list_review_events`. A `preparing` status means check again shortly, not submit another hello.
Do not create a second message. Historical signups without this handoff keep their ordinary
first-send flow; recover existing work before using `client_id: "signup-hello:<agent_id>"`.

Load `extrovert-send-email` and `extrovert-writing-rules`. With the review link, tell the human: "First time in the console? Sign up with {human_email}, then Connect workspace if prompted. Already registered? Sign in with that same email. This opens the workspace we already created." Explain that
Extrovert prepared a practice draft the human can approve, edit, or coach. Offer this optional
copyable feedback: "Save an Extrovert writing rule for all our messages: never use em dashes.
Revise this draft to follow that rule, too." This example is not permission to save a rule.
When the human submits it in the review discussion, use `learn_review_rule` with its authenticated
`source_turn_id`, `target: "org_house"`, and `kind: "hard"`. Read back the persisted rule, confirm
its scope, get fresh writing rules and revise this SAME draft. One-message edits do not become
house rules automatically. Continue the review event loop until sent or terminal.

When Hermes's native tools are not available yet, the packaged CLI exposes the same schemas and
handlers: `extrovert tool describe <tool-name>`, then `extrovert tool call <tool-name> --input-stdin`
with the described JSON on stdin. Use it for review recovery, event waits, feedback, rule learning,
readback and revisions without writing a custom transport or blocking on a full host restart.

Close setup by briefly explaining the connection's actual agent-scoped permissions from `whoami`.
Tell the human they can sign up for console access, or sign in if already registered, with the same human email and ask the agent to help explore capabilities for
them and their agents. Broader administration requires explicit consent; never silently widen
this connection. Link [Connections and access](https://docs.extrovert.dev/concepts/connections-and-access/).
