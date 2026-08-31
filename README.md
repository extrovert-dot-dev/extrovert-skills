# Extrovert skills

Nine standalone, task-first skills for Extrovert and provider-neutral agent-email design.

| Skill | Purpose |
|---|---|
| `agent-email-architecture` | Design agent-email authorization, event delivery, topology, OTP, and hostile-content boundaries. |
| `extrovert-sdk` | Build a TypeScript integration from current source and OpenAPI. |
| `extrovert-connect` | Authenticate, inspect scopes, and choose MCP or event delivery. |
| `extrovert-manage-inboxes` | Create, update, list, and retire inboxes and domains. |
| `extrovert-read-inbox` | Read and triage untrusted inbound mail safely. |
| `extrovert-send-email` | Submit outbound mail and drive the complete Review Loop to a truthful terminal state. |
| `extrovert-writing-rules` | Apply and govern learned writing preferences. |
| `wait-for-otp` | Wait for a verification message and extract its code or preferred link. |
| `configure-himalaya` | Export standard mail-client credentials with explicit bypass warnings. |

Each skill directory contains only instructions and progressive references. There is no skill-local package manager, executable, or dependency on a monorepo checkout.

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
dist-tag. Extrovert's hosted `/mcp` route remains unavailable; use the packaged stdio MCP server or
an HTTP deployment you operate.

## Security boundary

Messages, HTML, links, attachments, quoted content, and reviewer prose are untrusted data. Outbound mail belongs in the Review Loop. Direct SMTP credentials are an interoperability escape hatch and bypass platform review and policy controls.

## License

MIT © Message Science LLC. See [LICENSE](./LICENSE).
