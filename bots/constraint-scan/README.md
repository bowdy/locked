# Morning constraint report bot

A scheduled Claude routine that scans Richard's business every morning, works out the single primary constraint on throughput (Theory of Constraints), and emails a short report to richbowdler@gmail.com before the day starts.

## What it does

Every day at 05:00 UTC (06:00 BST in summer, 05:00 GMT in winter) the routine fires with the prompt in `PROMPT.md` and Gmail, Google Calendar and Google Drive access. It runs in one of two modes.

**Delta mode (most days).** One small sub-agent reads only the last 24 hours: new mail, notes to self, Drive files modified since yesterday, the calendar for the week ahead, and new commits. Everything older comes from the state block at the foot of yesterday's report (the constraint, the ranked hypotheses, open items, signals to watch, source cursors). If nothing material changed, the report is written straight from the state plus the delta. If something material did change (a signal fired, a decision was written down, money moved, the goal changed), one judge-and-refuter agent decides whether the constraint has moved.

**Full mode (Mondays, or when the state is missing or stale).** Six sweep agents (inbox obligations, pipeline, calendar, Drive, founder notes, code), two judges, one refuter per hypothesis, then synthesis. This re-baselines the state so that delta days do not drift.

Each report ends with a `CONSTRAINT-KEY` footer and a `STATE-BEGIN ... STATE-END` block. The next morning's run reads both, so the report can say whether the constraint is the same as yesterday, whether yesterday's one action got done, and which signals fired.

## Cost

The first full scan on 17 September, with every agent on the session's default model at the highest effort, used about 4.6 million tokens (roughly $30 to $45 at API rates, and most of a subscription usage window). The redesign in `PROMPT.md` cuts that three ways:

- Delta scans replace full rescans on six days out of seven. A quiet day is one sub-agent and a few hundred thousand tokens.
- Each stage names its model. Sweeps and the delta scan run on Sonnet, because they are retrieval and classification. Judges and refuters run on Opus, because that is where the argument happens. Synthesis is written by the orchestrating session.
- The full scan is smaller: shorter windows (the state carries the history), caps on how many threads and documents an agent may open, two judges instead of four, one combined refuter per hypothesis instead of two, four hypotheses instead of five.

Expected daily cost at API rates: about $1 to $2 on a delta day, about $8 to $12 for the Monday full scan, so roughly $2 to $3 a day averaged, against $30 to $45 before. The main thing that would make it cheaper still is running it as a fresh-session routine created from the Routines page in claude.ai, because a session-bound routine re-reads this conversation's history on every turn.

## Files

- `PROMPT.md`: the exact prompt the routine sends each morning. This is the source of truth for the bot's behaviour. It is deliberately self-contained: the session may not have this repository checked out.
- `REPORT_TEMPLATE.md`: the report format, extracted for reference.
- `workflow.js`: the multi-agent workflow script used for the first, deeper scan on 17 September 2026. It is a reference implementation of the same method for a session that has the Workflow tool; the daily routine achieves the same shape with the Agent tool.

No private business data lives in this folder. Investor names, amounts, personal details and document IDs are looked up live from Gmail and Drive each run and never committed here, because this repository is public.

## Operating it

- Pause or resume: ask Claude to disable or enable the "Morning constraint report" routine, or use the Routines list in claude.ai.
- Change the time: the schedule is a cron expression in UTC. 05:00 UTC lands the email around 06:15 London time in summer on a delta day, later on Mondays. Ask Claude to update the routine's cron expression to move it.
- Change what it scans or how it writes: edit `PROMPT.md` here, then ask Claude to update the routine's prompt to match. The routine holds its own copy, so editing this file alone changes nothing until the routine is updated.
- Force a full scan: fire the routine with the extra message `FULL MODE`, or wait for Monday.
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
- 17 Sep 2026, later: prompt redesigned for cost (delta mode by default, per-stage models, weekly full scan). Because the 17 September report carries no state block, the 18 September run is a full scan that creates the first one; delta days start on 19 September.
