# Core TypeScript client

## Prerelease setup

Install the explicit prerelease tag:

```bash
npm install @extrovert.dev/sdk@next
```

Pin `@extrovert.dev/sdk@0.1.0-pre.3` when a test needs a reproducible contract. The public REST fallback
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
