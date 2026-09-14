## Administer with explicitly granted full control

Use `list_administrative_actions` to search the task, then `describe_administrative_action` for exact
`path`, `query`, and `body` inputs. Start `read_administrative_action` with `action_id: "adminMe"` to
find the current organizations and projects. Use `change_administrative_action` for an authorized
change; ordinary inbox/send scopes do not enable it. Changes are attributed to the connection,
not to a human click. Read state after an ambiguous result before retrying a mutation.

For the packaged CLI, use `extrovert admin actions`, `admin describe <action-id>`,
`admin read <action-id> --input '<json>'`, and `admin change <action-id> --input-stdin`.
Pipe change JSON from a private file or application, rather than putting credentials in shell history.
The TypeScript SDK exposes the same catalog as `client.administration.list/describe` and typed
`client.administration.call(actionId, input)`.

Use Connections to inspect the parent connection and the access it created. Revoking the parent
or reaching its 24-hour expiry does not revoke independent credentials. Revoke each unwanted
credential separately. Never repeat a returned raw credential in a user-facing explanation.

## Finish setup and hand off

For an authorized setup task, use full control to configure the requested resources, then give
workers their own identity and resource/action scope. Use enrollment to create an agent, an agent
key for an existing agent, or a separately consented connection for selected/shared inbox access.
Inspect the administrative catalog for exact credential-issuance inputs; never guess IDs or print
one-time secrets. Full control does not mean every worker needs an administrative credential.

Verify `whoami` and the intended inbox list in each worker's actual runtime before ending setup.
Review the parent's created credentials in Connections and revoke unwanted access separately.
End the setup connection when finished or let its fixed deadline expire. Settings, webhooks,
exported credentials, and independent keys can outlast it; expiry does not undo setup.

Independent `ev_credential_...` credentials work with the API and packaged stdio/CLI. They are
not hosted MCP bearer tokens. Hosted MCP uses its own OAuth audience or a scoped agent key.
Read [Connections and access](https://docs.extrovert.dev/concepts/connections-and-access/) for the
complete human-facing walkthrough.

### Project managers and resource transfers

For a manager that creates its own team, request Project reach and the explicit
Project manager preset. Verify the project ID and `agent:manage` /
`credential:delegate` scopes through `whoami`. Add mail actions explicitly when
workers need them: the manager can delegate only its own actions within that project.
Use administrative discovery for `createAgent`, `adminCreateInbox`, `issueAgentKey`,
and `createConnectionCredential`. Use `whoami` for project IDs; `adminMe` is full-control only.
Submanagers require their own explicit project connection with delegation scopes.
Ordinary workers should not receive delegation permission.

Workers survive parent expiry or normal revocation. To stop descendants too, use
`revokeConnection` with `include_workers: true` only when the user authorized stopping
those workers. The recursive action is atomic and bounded to 10,000 records.

Ordinary domains belong to one project; unspecified account-level creation uses
Default. Only platform-designated shared domains cross project boundaries, and their
individual inboxes remain project-owned. Conversations aggregates the selected
project; Inboxes is a directory with Open inbox and Manage inbox controls.

Human administrators and Full account control can use `previewProjectTransfer` and
`executeProjectTransfer` for same-organization moves. Review all listed resources,
resolve mixed ownership, and pass the preview token plus a stable client_id.
Custom-domain inboxes always move with the entire domain group; only explicitly
shared-domain inboxes move individually. Show every inbox and owner in `domain_groups`
before asking for confirmation. If `requires_domain_confirmation` is true, pass
`confirm_domain_transfer: true` only after the user confirms that exact group, with
the matching preview token. On a changed preview, show the new membership and obtain
confirmation again. `include_related` expands optional persona/grant/webhook
relationships; it is separate from mandatory domain-group confirmation and separate
project-connection destination consent. Split or missing domain ownership blocks the
move and requires repair; never work around it by detaching an inbox. Worker
access retains its actions and resource ceiling. Whole-project managers stay at the
source unless their original authorizer separately consents to the entire destination.
Pending drafts need fresh review; active reviews/sends block transfer. See the
[access walkthrough](https://docs.extrovert.dev/concepts/connections-and-access/).

### Ownership transfers between accounts

Cross-account ownership transfer is a separate human-only workflow, not a project
move or an ordinary connection revocation. When available in the console, the
current owner offers the standalone organization to a verified recipient, who
reviews the consequences and accepts personally. Full account control does not
authorize an agent to accept ownership or payment responsibility; direct the human
to the [ownership transfer guide](https://docs.extrovert.dev/concepts/ownership-transfers/).

An offer does not grant the recipient resource access. During cutover, paused or
revoked access is not a reason to broaden permissions or retry with another old
credential. A completed handoff removes the former owner's access to the transferred
organization, including its independent credentials and integrations. The ordinary
rule that workers survive parent-connection revocation does not preserve that access.
Resume work only after the new owner explicitly reconnects the worker with fresh
credentials, then verify `whoami` and the intended inbox permissions. Do not recreate
the source account or infer new authority from unchanged organization or inbox IDs.
