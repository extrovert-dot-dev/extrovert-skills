---
name: extrovert-writing-rules
description: Read Extrovert writing rules before composing and turn reusable human feedback into governed rules. Use for get_rules, category matching, saving or superseding a preference, promotion, retirement, audit, undo, risk-dial inspection, or proposing graduation without confusing one reviewer's edit with a universal rule.
---

# Extrovert writing rules

Extrovert stores and orders rules; the connected agent applies judgment. The service does not compose or reconcile prose for you.

## Before composing

Call `get_rules`, optionally with the matched category and without a scope filter when composing. Preserve the returned order, provenance, and short-lived `composition_token`; pass that token with the resulting send or revision. If the token expires or a rule save invalidates it, fetch and apply the stack again. Apply the most specific relevant rule while honoring higher-priority house style. If rules conflict semantically, do not silently choose a permanent winner; ask for clarification through the review loop.

Use `list_categories` and `get_category` before proposing a new category. `propose_category` creates a proposal; `update_category` changes governed category metadata.

## Learn from review

Treat feedback as work to complete as part of the original send request. Read
`get_review_feedback`, the actual human edits, and the source turns. Compare them with
`get_rules` and the feedback's `new_rules` before saving anything.

Use `learn_review_rule` with a stable `client_id`, the review ID, and the authenticated
human `source_turn_id`. Every authorized human reviewer may teach a house rule; no extra
confirmation is needed for clear reusable guidance. Choose the scope the human meant:

- `org_house`: general style across topics, categories, projects, and agents. “Never use
  em dashes in any message about any topic” is a **hard organization house rule**, not a
  category preference. Broad typography and voice guidance belongs here unless limited.
- `category`: guidance specific to the category, with its `category_id`.
- `project_general`: guidance explicitly limited to this project, across its categories.
- A one-off factual correction, recipient detail, or deadline: revise the message without
  creating a durable rule. Silence or approval alone does not establish a preference.

Reuse equivalent rules. For a clear correction to a prior rule in the same ownership layer
and scope, use `supersedes_id`; do not accumulate contradictory copies. A broader rule needs
an organization learning operation, not merely promoting a project rule to project-general.
Ask for clarification in the review thread only when the intended rule is materially unclear.
Never silently waive an explicit hard house rule through a category preference.

The backend records attribution and undo and schedules affected unsent drafts automatically.
After saving, fetch fresh rules and their new composition token, revise the current review
without overwriting human edits, acknowledge handled feedback, and **wait again**. Other
composers receive durable nudges for their affected drafts. No agent may revise another
agent's mail or change sending policy merely because it learned a shared writing rule.

## Governance

- `learn_review_rule` saves authenticated feedback at its intended organization/project/category scope.
- `save_rule` creates or supersedes a rule without rewriting history and replays safely when the same `client_id` is retried.
- `promote_rule` broadens a proven rule deliberately; do not promote merely because it was used once.
- `retire_rule` removes an obsolete rule from active composition.
- `get_rule_audit` explains lineage and changes.
- `undo_rule_change` restores a prior governed state; verify the returned result.

Use `get_risk_dial` and `get_graduation_status` as evidence. `propose_graduation` records a proposal; it does not let the composing agent grant itself autonomous delivery.

For a specific pending draft, return to `extrovert-send-email`: reread its current revision, apply the updated ordered rules, and revise or restamp without overwriting a human change.
