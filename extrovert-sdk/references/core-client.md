# Core TypeScript client

## Prerelease setup

Install the explicit prerelease tag:

```bash
npm install @extrovert.dev/sdk@next
```

Pin `@extrovert.dev/sdk@0.1.0-pre.7` when a test needs a reproducible contract. The public REST fallback
is `https://api.extrovert.dev/v1`; obtain the current schema from the service's OpenAPI endpoint
rather than copying a stale schema.

## Client and authority

```ts
import { Extrovert } from "@extrovert.dev/sdk";

const client = new Extrovert({
  apiKey: process.env.EXTROVERT_API_KEY!,
  baseUrl: "https://api.extrovert.dev",
});

const me = await client.whoami();
const page = await client.projects.inboxes.list(me.project_id!, { limit: 50 });
for await (const inbox of page) console.log(inbox.id);
```

The key fixes the org, project, tier, and scopes. An org-tier key uses an explicit project or `"-"` wildcard; a bare org list fails with `breadth_required`. Never parse cursors or opaque ids.

Use `ApiError.problemCode` and typed subclasses such as `ForbiddenScopeError` and `BreadthRequiredError`. Propagate request cancellation. Keep bounded pages and use `collect()` only when an intentionally bounded complete result is required.

## Thread-first reads

Use the top-level thread resource when the inbox is selected dynamically. The list and search methods
return `next_cursor`; pass it back unchanged.

```ts
let cursor: string | undefined;
do {
  const page = await client.threads.search(inboxId, {
    q: "deployment",
    limit: 25,
    cursor,
  });
  for (const summary of page.items) console.log(summary.id, summary.subject);
  cursor = page.next_cursor;
} while (cursor);

const thread = await client.threads.get(inboxId, threadId);
await client.threads.reply(inboxId, {
  thread_id: thread.id,
  expected_last_message_id: thread.last_message_id,
  text: "The deployment is complete.",
  intent: { summary: "Answer the operator's deployment question." },
  idempotency_key: operationId,
});
```

An `InboxHandle` provides the same workflow as `inbox.threads(...)`,
`inbox.searchThreads(...)`, `inbox.thread(...)`, `inbox.reply(...)`, and
`inbox.deleteThread(...)`. Fetch the complete oldest-first thread before replying. Prefer each
message's `extracted_text` / `extracted_html` for concise reasoning and fall back to `text` / `html`
when extraction is absent or exact source evidence is required. Do not derive reply recipients or
RFC threading headers yourself; reply with `thread_id` and let the service derive them.
Pass `last_message_id` back as `expected_last_message_id` to detect a thread that advanced after your
read. On 409, fetch the thread and reconsider the reply. The guard is checked at submission; it is not
an atomic lock through review and delivery.

## Domain and plan requests

Use `client.domains.get(domain)` for `readiness.label`, `summary`, `ready_for_inboxes`, the responsible
party and next action. Legacy verification/signing fields are diagnostics, not readiness. Optional
inbox counts are caller-scoped, so zero visible inboxes does not establish account-wide absence.

`client.domains.wait(domain, { timeout_seconds: 45, signal })` returns a bounded outcome: ready,
action_required, needs_attention, timed_out, or status_unavailable. Timeout does not cancel setup;
resume after `resume_after_seconds`. `domains.verify(domain)` rechecks DNS immediately and may return
a retryable rate-limit error. Do not repeatedly trigger verification during automatic setup.

Resume durable domain updates with `client.domains.events(domain, { after, limit: 50 })`. Save the
returned `next_cursor` for that same domain. Drain `has_more`, otherwise respect `poll_after_seconds`.
This requires an active poller or a resumed session; it cannot wake a disconnected agent.

`client.domains.list({ page, limit: 50 })` accepts the previous `next_cursor` as `page`. Keep pagination
bounded and fail visibly on repeated cursors; do not claim a single page is the whole account.

The commerce resource separates a non-spending quote from a durable request. There is deliberately no
SDK method for an agent to approve a financial request.

```ts
const quote = await client.commerce.quoteDomain({ domain: "example.com" });
console.log(quote.quote_cents, quote.renewal_cents, quote.required_plan_price_cents, quote.quote_expires_at);

const request = await client.commerce.requestDomainPurchase({
  domain: quote.domain,
  scope: "project",
  rationale: "A dedicated support identity",
  idempotency_key: "support-domain-example-com-v1",
});

console.log(request.approval_url, request.agent_next_action);
const current = await client.commerce.get(request.id);
// If the request is no longer wanted and its state still allows withdrawal:
const cancelled = await client.commerce.cancel(request.id);
```

Reuse the same `idempotency_key` only for an ambiguous retry of the same intent. A request and its
approval URL are not proof of approval, payment, registration, or readiness. Poll no faster than
`poll_after_seconds`; report exact blockers and stop only on the relevant durable terminal state.
Plan upgrades and downgrades use `client.commerce.requestPlanChange(...)` with the same rules.
If `required_plan` is present, show `required_plan_price_cents` separately from the annual domain
price: the approval binds both values and the combined maximum, while the immediate plan charge is prorated.
