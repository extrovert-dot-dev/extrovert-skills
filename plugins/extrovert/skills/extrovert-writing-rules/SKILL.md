---
name: extrovert-writing-rules
description: Read Extrovert writing rules before composing and turn reusable human feedback into governed rules. Use for get_rules, category matching, saving or superseding a preference, promotion, retirement, audit, undo, risk-dial inspection, or proposing graduation without confusing one reviewer's edit with a universal rule.
---

# Extrovert writing rules

Extrovert stores and orders rules; the connected agent applies judgment. The service does not compose or reconcile prose for you.

## Before composing

Call `get_rules`, optionally with the matched category. Preserve the returned order and provenance. Apply the most specific relevant rule while honoring higher-priority house style. If rules conflict semantically, do not silently choose a permanent winner; ask for clarification through the review loop.

Use `list_categories` and `get_category` before proposing a new category. `propose_category` creates a proposal; `update_category` changes governed category metadata.

## Learn from review

After a human edit or rejection:

1. Read `get_review_feedback`, the actual diff, and reviewer comments.
2. Decide whether the feedback is reusable beyond this message.
3. If it is reusable, call `save_rule` at the narrowest correct scope with accurate provenance.
4. If it applies only to this recipient, moment, or draft, revise the message but do not create a durable rule.

Do not infer a global preference from silence, an approval, or a one-off factual correction.

## Governance

- `save_rule` creates or supersedes a rule without rewriting history.
- `promote_rule` broadens a proven rule deliberately; do not promote merely because it was used once.
- `retire_rule` removes an obsolete rule from active composition.
- `get_rule_audit` explains lineage and changes.
- `undo_rule_change` restores a prior governed state; verify the returned result.

Use `get_risk_dial` and `get_graduation_status` as evidence. `propose_graduation` records a proposal; it does not let the composing agent grant itself autonomous delivery.

For a specific pending draft, return to `extrovert-send-email`: reread its current revision, apply the updated ordered rules, and revise or restamp without overwriting a human change.
