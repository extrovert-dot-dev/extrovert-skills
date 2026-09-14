# Rule skill freshness

## Check current guidance

On first Extrovert use in this session, after one hour (or a shorter returned freshness interval),
and after an unknown-tool or schema error, inspect the current tool catalog. Call `agent_context`
only if present; otherwise fetch
https://mcp.extrovert.dev/.well-known/agent-contract.json, then https://docs.extrovert.dev/llms.txt.
An installed or pinned CLI can run `agent status --json` if supported. Only when normal installation
policy permits an unpinned CLI, use
`npx --yes --prefer-online @extrovert.dev/mcp@next agent status --json`.
Read the live guide for current product behavior and use the host's current tool schemas. If a
schema remains stale, refresh the catalog or reconnect before continuing; inspect state before
retrying an uncertain mutation.

Compare this skill's `metadata.version` with its version in live context. A difference signals a
refresh to consider, not incompatibility, permission to downgrade, or authorization to install.
Preserve explicit pins, local edits, the installation manager, and scope; refresh only the installed
Extrovert skills when permitted. Updating files requires two separate reloads: reload and re-read each changed `SKILL.md`, then
restart changed local MCP processes or refresh hosted discovery. If a new session is needed, report
that pending step; use live guidance for this task. If freshness is unavailable, report
that condition without treating it as disabled signup or permission to guess new behavior. See
[updates](https://docs.extrovert.dev/operating/agent-updates/) for targeted refresh instructions.
