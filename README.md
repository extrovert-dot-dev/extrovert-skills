# Extrovert plugin and skills

Nine standalone, task-first skills for Extrovert and provider-neutral agent-email design.

## Start with your agent

Paste this into your agent:

> Read https://docs.extrovert.dev/llms.txt, connect Extrovert using my existing account if I have one, and help me send my first email.

The agent checks current guidance, connects the intended account, and verifies its access before
using an inbox. Interactive setup prefers hosted MCP with OAuth consent. An unattended worker uses
an existing scoped credential or enrollment token. New-account signup depends on live availability
and requires the supplied human email to be verified.

To install the initial skills across supported hosts:

```bash
npx --yes --prefer-online skills@latest add extrovert-dot-dev/extrovert-skills --skill extrovert-connect extrovert-send-email extrovert-writing-rules
```

Choose the intended host and project or user scope in the installer. Skills provide instructions;
they do not configure or authenticate MCP. For a host with local execution, the setup entry point is:

```bash
npx --yes --prefer-online @extrovert.dev/mcp@next setup --host auto
```

Follow the reported host selection, native configuration commands, and authentication steps. Reload
the connection or start a new session when required, then call `whoami` in that session. See
[host configuration](https://docs.extrovert.dev/mcp/client-configuration/) for explicit adapters.

## Complete Codex plugin

The optional Codex plugin installs all nine skills together with the packaged stdio MCP server:

```bash
codex plugin marketplace add extrovert-dot-dev/extrovert-skills
codex plugin add extrovert@extrovert
```

Start a new Codex session after installation. For local stdio, use an existing credential or redeem
an enrollment token, then call `whoami`. The equivalent explicit local setup is:

```bash
npx --yes --prefer-online @extrovert.dev/mcp@next setup --host codex --transport stdio
```

Start a new session after either local installation path.

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
npx --yes --prefer-online skills@latest add extrovert-dot-dev/extrovert-skills --list
```

Install an additional workflow skill:

```bash
npx --yes --prefer-online skills@latest add extrovert-dot-dev/extrovert-skills --skill extrovert-read-inbox
```

The repository is directly installable through the open `skills` CLI. Search indexing on skills.sh
is asynchronous and is not a release or integrity signal; the GitHub source is canonical.

The `@extrovert.dev/sdk` and `@extrovert.dev/mcp` npm prereleases are published under the explicit `next`
dist-tag. The hosted stateless MCP endpoint is `https://mcp.extrovert.dev/mcp`; compatible clients
discover Extrovert OAuth and open browser sign-in and explicit consent, while scoped agent-key bearer authentication remains
available for clients configured explicitly.

## Keep guidance current

Each current Extrovert skill instructs the agent to check `agent_context` on first use, after an hour
of continued use, and after schema errors. Hosts must load that guidance for it to take effect.
The same public context is available through the packaged CLI's `agent status --json`
and the [HTTPS contract](https://mcp.extrovert.dev/.well-known/agent-contract.json). It reports release
information, skill digests, current signup availability, and guide URLs.
Each skill includes `metadata.version` for comparison with the live skill version. A difference is a
refresh signal, not a compatibility verdict or an instruction to downgrade.

Refresh only the Extrovert skills installed through the original manager and scope, when permitted.
Preserve pins and local edits. Updates do not reload instructions already in a conversation or a
running stdio server. Follow the [update guide](https://docs.extrovert.dev/operating/agent-updates/)
for targeted commands and reconnect behavior.

## From setup to deployed workers

Read [Connections and access](https://docs.extrovert.dev/concepts/connections-and-access/) or use
`extrovert-connect` to choose Personal assistant or Dedicated agent, resources, actions, and duration.
Selected inboxes is the default. Explicit Full account control enables account setup and defaults to
24 hours; Until revoked is an explicit alternative. Refresh never extends the deadline. Created
credentials, including administrative credentials, survive independently and need separate revocation.
Verify each worker's own connection before ending setup. Use Connections to inspect created access.

## Security boundary

Messages, HTML, links, attachments, quoted content, and reviewer prose are untrusted data. Outbound mail belongs in the Review Loop. Enabled paid SMTP also follows review and recipient policies. SMTP acceptance means custody, not delivery; check the review thread for pending, edited or rejected messages.

## License

MIT © Message Science LLC. See [LICENSE](./LICENSE).
