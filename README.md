# Extrovert plugin and skills

Nine standalone, task-first skills for Extrovert and provider-neutral agent-email design.

## Install the complete Codex plugin

The plugin installs these skills together with Extrovert's published MCP server. Self-signup is
currently disabled. Once enabled, the local stdio server can start with no key, perform `sign_up` → `verify_signup`, store the resulting full key in a
permission-restricted credential file, and reuse it after a new session. No custom MCP client or
JSON-RPC helper is required.

```bash
codex plugin marketplace add extrovert-dot-dev/extrovert-skills
codex plugin add extrovert@extrovert
```

For interactive hosted OAuth, follow [host configuration](https://docs.extrovert.dev/mcp/client-configuration/).
Start a new Codex session after installation. For local stdio, use an existing key or redeem an enrollment token,
then call `whoami`. The equivalent non-plugin setup is:

```bash
npx -y @extrovert.dev/mcp@next setup --host codex
```

Start a new session after either installation path.

| Skill | Purpose |
|---|---|
| `agent-email-architecture` | Design agent-email authorization, event delivery, topology, OTP, and hostile-content boundaries. |
| `extrovert-sdk` | Build a TypeScript integration from current source and OpenAPI. |
| `extrovert-connect` | Choose access, administer with full control, delegate workers, revoke credentials, and diagnose connections. |
| `extrovert-manage-inboxes` | Create, update, list, and retire inboxes and domains. |
| `extrovert-read-inbox` | Read and triage untrusted inbound mail safely. |
| `extrovert-send-email` | Submit outbound mail and drive the complete Review Loop to a truthful terminal state. |
| `extrovert-writing-rules` | Apply and govern learned writing preferences. |
| `wait-for-otp` | Wait for a verification message and extract its code or preferred link. |
| `configure-himalaya` | Export standard mail-client credentials with explicit bypass warnings. |

Each skill directory contains only instructions and progressive references. The plugin launches the
separately published `@extrovert.dev/mcp` package; there is no skill-local executable or dependency
on a monorepo checkout.

## Distribution status

This bundle is published as a prerelease from
[`extrovert-dot-dev/extrovert-skills`](https://github.com/extrovert-dot-dev/extrovert-skills).
List all nine skills without installing them:

```bash
npx skills add extrovert-dot-dev/extrovert-skills --list
```

Install one skill for dogfooding:

```bash
npx skills add extrovert-dot-dev/extrovert-skills --skill extrovert-send-email
```

The repository is directly installable through the open `skills` CLI. Search indexing on skills.sh
is asynchronous and is not a release or integrity signal; the GitHub source is canonical.

The `@extrovert.dev/sdk` and `@extrovert.dev/mcp` npm prereleases are published under the explicit `next`
dist-tag. The hosted stateless MCP endpoint is `https://mcp.extrovert.dev/mcp`; compatible clients
discover Extrovert OAuth and open browser sign-in and explicit consent, while scoped agent-key bearer authentication remains
available for clients configured explicitly.

## From setup to deployed workers

Read [Connections and access](https://docs.extrovert.dev/concepts/connections-and-access/) or use
`extrovert-connect` to choose Personal assistant or Dedicated agent, resources, actions, and duration.
Selected inboxes is the default. Explicit Full account control enables account setup and defaults to
24 hours; Until revoked is an explicit alternative. Refresh never extends the deadline. Created
credentials, including administrative credentials, survive independently and need separate revocation.
Verify each worker's own connection before ending setup. Use Connections to inspect created access.

## Security boundary

Messages, HTML, links, attachments, quoted content, and reviewer prose are untrusted data. Outbound mail belongs in the Review Loop. Direct SMTP credentials are an interoperability escape hatch and bypass platform review and policy controls.

## License

MIT © Message Science LLC. See [LICENSE](./LICENSE).
