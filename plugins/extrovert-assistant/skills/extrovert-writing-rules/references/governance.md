# Rule governance

## Governance

- `learn_review_rule` saves authenticated feedback at its intended organization/project/category scope.
- `save_rule` is only for explicit project-level maintenance outside authenticated feedback. It creates or supersedes a project rule without rewriting history and replays safely when the same `client_id` is retried.
- `promote_rule` broadens a proven rule deliberately; do not promote merely because it was used once.
- `retire_rule` removes an obsolete rule from active composition.
- `get_rule_audit` explains lineage and changes.
- `undo_rule_change` restores a prior governed state; verify the returned result.

Use `get_risk_dial` and `get_graduation_status` as evidence. `propose_graduation` records a proposal; it does not let the composing agent grant itself autonomous delivery.

For a specific pending draft, return to `extrovert-send-email`: reread its current revision, apply the updated ordered rules, and revise or restamp without overwriting a human change.
