# Access, delegation, and credential diagnostics

## Choose credentials

- Connect to the human's existing account. If no account or credential is available, use the
  [new-account flow](signup.md) only when live signup availability is enabled and account creation is intended.
- Hosted OAuth (recommended for interactive setup): connect to `https://mcp.extrovert.dev/mcp` and
  follow browser sign-in and explicit consent. Choose Personal assistant or a named Dedicated agent;
  select inboxes (default), a project, an organization, or Full account control. Choose actions separately.
  Selected inboxes exclude future inboxes. Project and organization reach include future resources
  within the chosen boundary. Sign-in alone never grants access.
  Full account control is an explicit setup option: it can administer customer resources, access
  other agents' inboxes, approve requests including its own, and create independent credentials.
  It expires after 24 hours by default; Until revoked is an explicit alternative. Refresh does not
  extend that deadline. Created credentials, including admin credentials, survive independently.
  Private platform access is always excluded. Existing hosted OAuth sessions must reconnect through
  consent; do not infer broader permissions from their old display name.
- Local CLI/stdio OAuth: `auth login` signs in to an existing account and saves a separate local
  connection. Refresh respects the granted identity, reach, actions, and expiry. Hosted MCP OAuth
  remains managed by the host; do not copy its tokens into local API credentials.
- Enrollment token: prefer `npx -y @extrovert.dev/mcp enroll --agent-handle <stable-name>`.
  It accepts hidden stdin or `EXTROVERT_ENROLLMENT_KEY`, saves the scoped agent key privately, and checks
  identity. Keep the same handle and `--client-id` on a retry. With tools already connected,
  `redeem_enrollment` also stores the returned key in the packaged local stdio server.
- Existing agent key or independently issued connection credential (`ev_credential_...`): use `npx -y @extrovert.dev/mcp auth login --with-token` and hidden stdin.
  Never put a key in a command argument or repeat it in a response.

Set `EXTROVERT_PROFILE` before login, enrollment, and setup to separate agent identities. Hermes uses its
selected `HERMES_HOME` automatically. `EXTROVERT_CONFIG_DIR` explicitly overrides both. Do not copy a
global credential into a different profile or replace an existing identity to make a login succeed.

Set the API base URL to `https://api.extrovert.dev`. `EXTROVERT_API_KEY` overrides the local stored
credential when an explicit key is needed. Use the scope the human chose. A persistent administrator
credential is a deliberate full-control choice, not a routine workaround for a failed inbox list.

The MCP prerelease is published under the explicit `next` dist-tag. Prefer the hosted stateless
Streamable HTTP endpoint and OAuth when the client supports remote MCP. For an unpinned local stdio
host, run `npx --yes --prefer-online @extrovert.dev/mcp`; preserve deliberate version pins.
Supply only the agent key or independently issued connection credential intended for that worker.

## Verify immediately

Report the observed milestone with one next action. **Inbox claimed** means human
ownership is proven; exchange the limited credential and verify the connection.
**Agent connected** requires successful `whoami` in that actual connection; check
the intended inbox access and recover its draft. **Draft awaiting review** means
show the review link before waiting for feedback. **Message sent** requires a
confirmed sent outcome; ask the human to check receipt. Avoid "setup complete."
Saved configuration and a local CLI identity do not verify a separate hosted MCP.

Call `whoami` in the actual MCP session before real work. Lead with its summary, account/project names
and available capabilities, not opaque IDs or raw scope names. Keep the fixed `org_id`, `project_id`,
key tier, connection ID, reach, expiry, and scopes for authorization checks. A project-bound key
cannot switch projects. A broader connection may explicitly select a project within its granted reach.

`doctor` checks a local credential against the API; it does not prove the host's OAuth session works.
Use CLI `whoami --json` to verify local access without opening, reading or printing credential
files or any key/token fragment. The CLI reads its saved profile privately.
If browser approval succeeds but MCP returns 401, stop repeated approvals, preserve only the error
and non-secret request ID, and report the failed step. A login process exiting zero or a callback
returning 200 does not prove tool access. Do not suggest SSH tunnels or broader keys as a speculative
repair. Offer the supported enrollment path only with the human's chosen permissions.

Read `extrovert-admin` for administrative action discovery, independent credential lifecycle, and full-control setup handoff.

### Storage and connection diagnostics

Storage warnings are structured from 90% usage. Mention cleanup or asking the human
for more space when first warned, when pressure increases, or when an operation is
blocked. Do not repeat upgrade suggestions on every mail read. Reads and deletion
remain available when storage is full.

When comparing a hosted OAuth connection with a local CLI profile, call `whoami`
through each separately and retain the stable agent/key IDs and scope fields.
A successful CLI health check does not establish the hosted connection's identity.
If direct inbox lookup succeeds while its complete list is empty, treat that as a
possible contract/authorization inconsistency, not proof that addresses are hidden
by a special list permission. Report the actual results and request IDs.


## Explicit connection grants

When `whoami.auth_method` is `connection`, use `whoami.connection` as the consent
record: identity, selected resource reach, granted actions, fixed expiry, and any
creator connection. A Personal assistant acts for the authorizer; a Dedicated
agent retains its selected identity. Switching the console's default project does
not change either grant. Read the supported breadth from this response rather
than applying an agent-key ownership assumption.

Selected inboxes excludes future inboxes. Project and Organization grants include
future resources inside their named boundary. Full account control explicitly
permits customer administration, other agents' inboxes, policy/access changes,
credential creation, and approvals including its own requests. It never includes
private platform-operator access or exceeds the authorizer's current role.

Full control expires after 24 hours by default; Until revoked is an explicit
alternative. Refresh does not extend the grant. Created credentials, including
administrative credentials, survive independently. Explain that distinction when
helping someone set up workers. Never switch to a created credential silently to
continue after the parent expires. Point the person to account -> Connections to
inspect and separately revoke created access.

Legacy hosted sign-ins need one new consent flow after the grant-system rollout.
Reconnect through the host; do not retry old tokens, invent resource permissions,
or infer that a local CLI credential represents the same connection.


For project-manager delegation and project or account transfers, read `extrovert-admin`. These operations need explicit authority beyond ordinary email access.
