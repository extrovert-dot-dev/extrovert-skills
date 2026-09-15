# Installation and updates

## Check current guidance

On first Extrovert use in this session, after one hour (or a shorter returned freshness interval),
and after an unknown-tool or schema error, inspect the current tool catalog. Call `agent_context`
only if present; otherwise fetch
https://mcp.extrovert.dev/.well-known/agent-contract.json, then https://docs.extrovert.dev/llms.txt.
An installed or pinned CLI can run `agent status --json` if supported. Only when normal installation
policy permits an unpinned CLI, use
`npx --yes --prefer-online @extrovert.dev/mcp agent status --json`.
Read the live guide for current product behavior and use the host's current tool schemas. If a
schema remains stale, refresh the catalog or reconnect before continuing; inspect state before
retrying an uncertain mutation.

Compare this skill's `metadata.version` with its version in live context. A difference signals a
refresh to consider, not incompatibility, permission to downgrade, or authorization to install.
Preserve explicit pins, local edits, the installation manager, and scope; refresh only the installed
Extrovert skills when permitted. Updating files requires two separate reloads: reload each changed skill and read its complete updated `SKILL.md` body (not just metadata), then
restart changed local MCP processes or refresh hosted discovery. If a new session is needed, report
that pending step; use live guidance for this task. If freshness is unavailable, report
that condition without treating it as disabled signup or permission to guess new behavior. See
[updates](https://docs.extrovert.dev/operating/agent-updates/) for targeted refresh instructions.

For an authorized unpinned local MCP update, inspect and refresh the saved host
launch entry to use `npx --yes --prefer-online @extrovert.dev/mcp`, preserving
its other arguments, environment and scope. For an explicitly selected preview,
retain `@next` or `@beta` instead; a routine refresh does not authorize switching channels.
Running a newer standalone CLI does
not update the host's saved launch entry; restart that MCP connection afterward.

## Connect in this order

1. Read live context as above. With no Extrovert MCP, fetch the HTTPS contract; do not call
   unavailable `agent_context`. This read needs no account or MCP installation.
2. Check this host for Extrovert tools. If absent, run the supported setup command below when
   installation is allowed. Follow its host-selection or native-command handoff in this same host.
3. Complete authentication: setup only configures MCP. A pending signup takes precedence over browser login: resume `check_activation` and `verify_signup` after proof for incoming email, or `verify_signup` with the human-supplied code for legacy OTP. The CLI equivalent is `extrovert verify`. Do not start `auth login` or OAuth for that pending profile. Otherwise follow its returned native sign-in command
   or host OAuth action (Claude Code: `/mcp`). Have the person sign in to the existing account and
   approve access before `whoami`. Local stdio/CLI uses `extrovert auth login`; this does not
   authenticate the host's separate hosted OAuth connection.
   Address the handoff to the person in this chat. Name a human email only when they supplied it
   or the current Extrovert flow returned it; a local or model-provider login is not their Extrovert identity.
4. Reload the MCP connection when required and call `whoami` in that actual session before work.
   For CLI-only work, use its `whoami`. Saved configuration or pending login is not connected.

```bash
npx --yes --prefer-online @extrovert.dev/mcp setup --host auto
```

Automatic selection prefers hosted MCP. If selection is ambiguous, choose the intended host
explicitly with `--transport hosted`; an explicit host without a transport retains the stdio default.
Preserve existing server entries and profile credentials. Installing a skill alone does not configure
MCP. Do not build a custom JSON-RPC transport or install a similarly named product.
See [host setup](https://docs.extrovert.dev/mcp/client-configuration/) for exact adapters and plugins.

For local access, use `npx --yes --prefer-online @extrovert.dev/mcp auth login`.
Without an interactive terminal, use `auth login --no-browser --json`, show the returned
`authorization_url` when pending, then run `auth complete --json` in the same profile with the
website's completion code on private stdin. Never put the code in arguments, chat, or logs.
Follow [current login guidance](https://docs.extrovert.dev/quickstart/authentication/#local-cli-and-stdio-sign-in)
for browser fallback, cancellation, existing credentials, and recovery. A completion code is not an
access token or proof that login succeeded; verify the completed connection.

If configuration is not writable, report that exact blocker and use the packaged CLI as the explicit
fallback. Never create a second account or replace an existing identity to repair access. Read live
signup availability before offering account creation.
