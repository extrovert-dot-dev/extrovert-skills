# Request a domain purchase or plan change

Ordinary scoped agents cannot purchase domains by default or approve their own requests. An
explicit Full account control connection can approve through the administrative action tools,
including its own requests, under current customer-admin authority. See `extrovert-connect`.

1. Call `quote_domain` and report the exact annual registration and renewal price, currency, quote expiry, premium status, required plan, required plan's maximum monthly price, and blockers. When a plan change is required, make clear that its immediate charge is prorated and the approval covers the combined maximum. A quote is not a reservation or purchase.
2. With the human's requested domain or an independently justified need, call `request_domain_purchase` using one stable idempotency key. Use `request_plan_change` for a standalone upgrade or downgrade. Reuse the same key only when retrying the same intent.
3. Surface the returned approval URL and `agent_next_action`. Extrovert emails the verified billing owner automatically. You may also email the same approval URL to the human by activating `extrovert-send-email`; the email cannot approve the request, and only an authenticated console decision, explicitly delegated full-control decision, or applicable spend policy counts.
4. Poll `get_commerce_request` no faster than `poll_after_seconds`. Use `list_commerce_requests` to recover a lost request id. Report the exact named limit, capacity, payment, or price blocker; never replace it with a generic failure.
5. Do not claim that anything was charged, registered, upgraded, downgraded, or ready until the durable state says so. `payment_action_required` still needs the human. Registration is complete only at `ready`; a plan change is complete at `completed` or explicitly scheduled at `scheduled`.
6. If the purchase or plan change is no longer wanted, call `cancel_commerce_request` with the exact request id and report only the returned durable state. Cancellation cannot approve or replace a request; a settled-payment race moves to reconciliation instead of silently continuing from cancelled authority.

A human may approve this purchase once or create bounded future authority scoped to the agent, project, or organization. Weekly, monthly, quarterly, annual, and non-repeating controls do not widen the plan's capacity. Every applicable control is enforced and the most restrictive one wins. Premium or unusually priced international domains can require a separate approval. Never call a registrar directly to bypass a blocker.
