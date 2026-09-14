# Events, webhooks, and offline testing

## Webhooks

Register the narrowest event set. Verify `X-Extrovert-Signature` over the raw request bytes with the SDK helper before parsing JSON, enforce the documented timestamp window, and deduplicate by request/event id. A valid callback is still a wake-up signal: reread the current message or review before a consequential mutation.

## Streams

SSE uses the agent key and a durable cursor. Resume with the documented last-event id, tolerate duplicates and gaps, and keep polling available for recovery. Do not treat a disconnected stream as proof that no event occurred.

## Offline fixtures

Use `new Extrovert({ transport: "mock" })` for deterministic tests. The mock is intentionally review-first and network-free. Test at least:

- queued versus delivered outcomes;
- stable retry identity after an ambiguous response;
- case-sensitive OTP matching and explicit case-insensitive matching;
- HTML-only/source-null message bodies;
- webhook signature rejection;
- review failure closure through cancellation.

Fixtures prove client behavior, not live deliverability. Never place a real key or recipient in an offline test log.
