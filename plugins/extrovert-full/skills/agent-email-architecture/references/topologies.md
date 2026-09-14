# Agent-email topologies

## One agent, one inbox

Bind one revocable key to one project and let the creating agent own the inbox. This minimizes row reach and makes audit attribution direct. Use durable polling for correctness and webhooks or streams for latency.

## Composer plus reviewer

Keep composer and reviewer capabilities distinct. The composer reads rules, drafts, and owns the sender. The reviewer receives only linked decision authority. An authorized approval tells the platform to send with the composer's sender; it never gives the reviewer the sender credential.

## Shared project, multiple agents

Use project-level shared rules and event feeds while preserving per-agent inbox ownership. Do not infer that same-org agents can read each other's inboxes. If a shared-inbox product mode is required, model it explicitly with its own ACL and audit trail.

## Event fan-out

One durable event row may feed polling, signed webhooks, and streams. Consumers must deduplicate by event id, tolerate ordering gaps, and reread the current resource before mutating. A webhook is a wake-up signal, not the sole record of a message or review transition.

## High-volume fleets

Bound list pages, concurrent waits, webhook retries, and external fan-out. Give each logical mutation a stable id and each consumer a durable cursor. Do not solve concurrency by broadening credentials or collapsing distinct agents into one shared key.
