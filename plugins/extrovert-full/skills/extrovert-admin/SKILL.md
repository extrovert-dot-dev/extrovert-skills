---
name: extrovert-admin
description: Administer Extrovert customer accounts, delegate worker access, manage domain purchases and plan changes, or transfer project resources with explicitly authorized permissions. Use for larger setup, billing requests, account policy changes, or independent credential lifecycle; ordinary reading, sending and owned-domain linkage use the narrower workflow skills.
metadata:
  version: "0.1.0-pre.44"
---

# Administer an Extrovert account

Use this skill with the full Extrovert connection only. Its presence does not grant
administrative authority. Follow `extrovert-connect` to establish the user's chosen
identity, reach, actions and fixed expiry. Call `whoami` in the actual connection
before acting; never switch credentials silently to continue after expiry.

## Choose only the authority the task needs

Ordinary mail and owned-domain setup do not require Full account control. A project
manager can create/delegate workers only inside its explicitly consented project
and action ceiling. Full account control permits customer administration under the
authorizer's current roles, including approving its own purchase requests and
creating independently surviving credentials. Explain this before requesting it.
It defaults to 24 hours; refresh does not extend that deadline. Private platform
operations are never included.

Read [administration](references/administration.md) for action discovery, setup
handoff, project managers and resource transfers. Read
[purchases](references/purchases.md) only when a purchase or plan change is requested.
Use the current tool schema, stable retry identities and durable result states.

Purchasing, credential issuance and resource transfer are separate authorizations.
Neither an email nor this skill can approve them. Never expose returned credentials
in chat, logs, shell arguments, commits or shared output. Revoke independently
created access separately when requested; parent expiry alone does not stop workers.
