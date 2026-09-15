---
name: extrovert-connect
description: Connect an existing Extrovert account through hosted OAuth, choose inbox or project access, and diagnose authentication, consent and mobile connection failures without widening permissions.
metadata:
  version: "0.1.0-pre.3"
---

# Connect to Extrovert

## Connection and capability boundary

Use this connection's native Extrovert tools and their current input schemas. Call
`agent_context` for the connection's supported capabilities and `whoami` to verify
the actual identity and selected resources. If tools are absent or authentication
fails, use the host's Extrovert Connect/Reconnect action and verify again; do not
replace accounts or guess wider permissions. Preserve pending reviews and retry IDs.

This assistant connection operates existing email entitlements and customer-controlled
domains. It cannot buy a domain, change a paid plan, start a purchase request, expose
mail credentials, or administer account access. Even when asked to purchase or upgrade,
explain the limitation without directing the human to Extrovert, a billing page, a
domain provider, or another integration to complete the purchase. Do not supply checkout
links or purchase instructions. Report an exact capacity/permission blocker; do not infer
a need to buy from an empty list. You may help link a domain the human already independently
owns and configure it within the explicitly authorized project; that is not a purchase path.

Installing instructions, authorizing a connection, and proving working tools are
separate steps. A skill installation alone does not establish a connection.

## Use the existing account

Connect through the host's Extrovert OAuth action to
`https://mcp.extrovert.dev/assistant/mcp`. Have the person sign in to their intended
account and approve the identity, resources, actions and lifetime they actually want.
Reuse an existing connection or pending authorization before starting another.
Missing tools or local credentials are not evidence that a new account is needed.
Do not ask the person to paste a password or bearer token into chat.

Choose selected inboxes for ordinary reading/sending. Selected inboxes exclude
future inboxes. Creating an inbox or linking an owned domain requires explicitly
approved project reach and the corresponding creation/domain action. Project reach
includes future resources in that project, not another project. Never broaden the
grant just to repair login or an empty list. Refresh does not extend fixed expiry.

## Prove useful access

1. Call `whoami` in this host's actual session. Lead with the returned account,
   project and identity; retain opaque IDs, scopes, reach and expiry for checks.
2. Call `list_inboxes`, select the intended inbox, and offer a first useful task.
   Connecting does not authorize sending a test message.
3. If the user resumes a previously authorized send, inspect `list_reviews` with
   `composer: "me"` and `list_review_events`, then use `extrovert-send-email` and
   `extrovert-writing-rules` to continue that same review without creating a duplicate.

Browser approval, a saved configuration, or a callback response is not proof of
working tool access. A 401 is rejected/missing authentication; a 403 can mean a
permission or capacity limit. Preserve only sanitized error/status/request IDs and
name the failed stage: auth launch, return to host, first tool, refresh, or resume.
Stop repeated approvals when the same stage fails. An unknown-tool error needs a
host tool refresh/reconnect, not a guessed operation or a different transport.

For a mobile host, distinguish the installed app and version, workspace restrictions,
and its connector installation path. Do not claim a local desktop configuration
authenticated the phone. Confirm first read after OAuth and recheck after resuming
the app. A stopped host cannot monitor mail or wake itself through polling.
