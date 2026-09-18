# Morning constraint report bot

A scheduled Claude routine that scans Richard's business every morning, works out the single primary constraint on throughput (Theory of Constraints), and emails a short report to richbowdler@gmail.com before the day starts.

## What it does

Every day at 05:00 UTC (06:00 BST in summer, 05:00 GMT in winter) the routine fires with the prompt in `PROMPT.md` and Gmail, Google Calendar and Google Drive access. Every day is a quiet delta day, by design, to keep the cost under $1.

The orchestrating session makes three guard calls (today's date, has today's report already been sent, fetch yesterday's report) and launches exactly one sub-agent on Sonnet with a cap of 12 tool calls. That agent reads only the last 24 hours (new mail, notes to self, Drive files modified since yesterday, the calendar for the week ahead), checks each "signal to watch" and yesterday's one action, decides whether anything material happened, writes the report from yesterday's state block plus today's delta, refreshes the state block, and sends the email itself. If something material did happen it judges the move in the same pass and, if the constraint has moved, says so with lowered confidence.

Nothing older than 24 hours is re-read. The state block at the foot of each report (constraint, ranked hypotheses, open items, signals to watch, yesterday's action, source cursors) is the memory. A deeper multi-agent full scan exists in the prompt but never runs on its own: fire the routine with the message `FULL MODE` when you want one.

## Cost

The first full scan on 17 September, with every agent on the session's default model at the highest effort, used about 4.6 million tokens (roughly $30 to $45 at API rates). The daily run is now:

| Piece | Tokens | Cost at API rates |
|---|---|---|
| Orchestrator guard calls (this session's model, mostly cached context) | 4 to 5 short turns | about $0.20 |
| One Sonnet agent: scan, write, send | 100,000 to 200,000, mostly tool results | $0.25 to $0.50 |
| Total per day | | $0.50 to $0.75 |

On a subscription this is a small fraction of one usage window. A manual `FULL MODE` run costs about $8 to $12 and is the only way to spend more. The orchestrator line would drop further if the routine were a fresh-session routine created from the Routines page, because a session-bound routine re-reads this conversation on every turn.

## Files

- `PROMPT.md`: the exact prompt the routine sends each morning. This is the source of truth for the bot's behaviour. It is deliberately self-contained: the session may not have this repository checked out.
- `REPORT_TEMPLATE.md`: the report format, extracted for reference.
- `workflow.js`: the multi-agent workflow script used for the first, deeper scan on 17 September 2026. It is a reference implementation of the same method for a session that has the Workflow tool; the daily routine achieves the same shape with the Agent tool.

No private business data lives in this folder. Investor names, amounts, personal details and document IDs are looked up live from Gmail and Drive each run and never committed here, because this repository is public.

## Operating it

- Pause or resume: ask Claude to disable or enable the "Morning constraint report" routine, or use the Routines list in claude.ai.
- Change the time: the schedule is a cron expression in UTC. 05:00 UTC lands the email around 06:10 London time in summer. Ask Claude to update the routine's cron expression to move it.
- Change what it scans or how it writes: edit `PROMPT.md` here, then ask Claude to update the routine's prompt to match. The routine holds its own copy, so editing this file alone changes nothing until the routine is updated.
- Deeper scan: fire the routine with the extra message `FULL MODE`. It never runs automatically. Use it after a big change, or every few weeks if the daily reports feel stale.
- Test without sending: fire the routine with the extra message `TEST MODE`. It runs the scan and saves the report as a Gmail draft with a `[TEST]` prefix instead of sending.
- Access: the routine uses the Gmail, Google Calendar and Google Drive connectors held by its session. It is read-only except for the one send.

## Routine details

- Name: Morning constraint report
- Trigger id: `trig_01C9gvkan8evDssMDCiqZxwF`
- Schedule: `0 5 * * *` (UTC), daily
- Mode: fires into the Claude Code session that built it (session `session_01TYGPWThMBK9xGWKVrXULp4`), because that session holds the Gmail, Google Calendar and Google Drive connectors. Routines created from inside a session cannot carry connector grants into a fresh session on this account, so a fresh-session routine would run blind. Do not archive that session while the routine is in use.
- If a fresh session per morning is preferred (cheaper, and it lets you pick the orchestrating model), create the routine from the Routines page in claude.ai, paste `PROMPT.md` as the prompt, tick Gmail, Google Calendar and Google Drive as its connectors, and delete the session-bound one. Nothing else changes.

## Run log

- 17 Sep 2026: first report sent at 06:00 UTC (subject "Morning constraint report, Thu 17 Sep 2026: no frozen, priced offer a parent can pay for", key `no-frozen-priced-offer`). Produced by the reference workflow: six sweeps, four judges, merge, one combined refuter for each of the top four hypotheses, synthesis, critic and one revision, about 4.6 million tokens. The first attempt at the verification stage hit the account's usage limit and was resumed from cache after the limit reset at 04:30 UTC.
- 17 Sep 2026, later: prompt redesigned for cost, twice. First to a weekly full scan plus delta days, then to delta-only with a hard budget of one Sonnet sub-agent and 12 tool calls per day, targeting under $1 a day. The 18 September run derives its first state block from the 17 September report's sections; no full scan is needed.
- 18 Sep 2026: first delta-only run. One Sonnet sub-agent, Gmail, Drive and Calendar all read cleanly, report sent at about 06:15 London time. Constraint unchanged (`no-frozen-priced-offer`, day 2); the overnight About-page edit set a price but left the old free version in place, so the action carried over.
