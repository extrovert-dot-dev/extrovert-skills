# Signup practice draft

<!-- shared:start practice -->
## First signup practice review

A new signup can return `onboarding.starter` or `whoami.signup_starter`. Extrovert prepared this
fixed template, but the connected signup agent is its composer and receives durable feedback.
Do not submit another hello. `preparing` means wait briefly and read `whoami` again. Once the
review ID is available, call `get_review` for that exact ID and read the draft before presenting
it or waiting: the starter summary in `whoami` is not the draft. Tell the human it is unsent,
give its review link, explain approval/editing, and present the optional returned `coaching_prompt`.
Then execute [the shared review wait](review-loop.md); do not end with a promise to monitor. Never save an
example rule without authenticated feedback asking for it. After the human sends
that feedback, load `extrovert-writing-rules`, use `learn_review_rule` with its `source_turn_id`,
and read back the rule. The suggested all-messages no-em-dashes request uses `target: "org_house"`
and `kind: "hard"`. Fetch fresh rules, revise this same draft and keep the review loop active.
<!-- shared:end practice -->
The CLI supports the same review operations through `tool describe <name>` and
`tool call <name> --input-stdin` while the host's MCP tools are still loading.
