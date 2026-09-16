# Morning constraint report bot

A scheduled Claude routine that scans Richard's business every morning, works out the single primary constraint on throughput (Theory of Constraints), and emails a short report to richbowdler@gmail.com before the day starts.

## What it does

Every day at 05:00 UTC (06:00 BST in summer, 05:00 GMT in winter) a fresh Claude Code session starts with the prompt in `PROMPT.md` and Gmail, Google Calendar and Google Drive access. It:

1. Checks whether today's report already exists (so it never sends twice) and reads yesterday's report for continuity.
2. Sweeps six sources in parallel with sub-agents: inbox obligations, the commercial pipeline, calendar time allocation, Drive strategy documents, the founder's own notes, and product repos when GitHub tools are present.
3. Has four judges propose constraint hypotheses through different lenses (strict Goldratt, offer and traffic, survival and obligations, founder capacity).
4. Merges the hypotheses and tries to refute each one three ways (is it a symptom, would relieving it raise throughput within 30 days, does the evidence hold up).
5. Picks exactly one constraint, writes the report in the format in `REPORT_TEMPLATE.md`, and sends it. The subject line always starts with `Morning constraint report`, so all reports can be found in Gmail with that search.

Each report ends with a `CONSTRAINT-KEY` footer. The next morning's run reads it, so the report can say whether the constraint is the same as yesterday and whether yesterday's one action got done.

## Files

- `PROMPT.md`: the exact prompt the routine sends each morning. This is the source of truth for the bot's behaviour. It is deliberately self-contained: the fresh session has no memory and may not have this repository checked out.
- `REPORT_TEMPLATE.md`: the report format, extracted for reference.
- `workflow.js`: the multi-agent workflow script used for the first, deeper scan on 17 September 2026. It is a reference implementation of the same method for a session that has the Workflow tool; the daily routine achieves the same shape with the Agent tool.

No private business data lives in this folder. Investor names, amounts, personal details and document IDs are looked up live from Gmail and Drive each run and never committed here, because this repository is public.

## Operating it

- Pause or resume: ask Claude to disable or enable the "Morning constraint report" routine, or use the Routines list in claude.ai.
- Change the time: the schedule is a cron expression in UTC. 05:00 UTC lands the email around 06:30 London time in summer and 05:30 in winter, because the scan takes roughly 20 to 40 minutes. Ask Claude to update the routine's cron expression to move it.
- Change what it scans or how it writes: edit `PROMPT.md` here, then ask Claude to update the routine's prompt to match. The routine holds its own copy, so editing this file alone changes nothing until the routine is updated.
- Test without sending: fire the routine with the extra message `TEST MODE`. It runs the whole scan and saves the report as a Gmail draft with a `[TEST]` prefix instead of sending.
- Access: the routine is granted the Gmail, Google Calendar and Google Drive connectors on every firing. It is read-only except for the one send. If that grant should be narrowed, ask Claude to recreate the routine with fewer connectors and update this note.

## Routine details

- Name: Morning constraint report
- Trigger id: `trig_01C9gvkan8evDssMDCiqZxwF`
- Schedule: `0 5 * * *` (UTC), daily
- Mode: fires into the Claude Code session that built it (session `session_01TYGPWThMBK9xGWKVrXULp4`), because that session holds the Gmail, Google Calendar and Google Drive connectors. Routines created from inside a session cannot carry connector grants into a fresh session on this account, so a fresh-session routine would run blind. Do not archive that session while the routine is in use.
- If a fresh session per morning is preferred, create the routine from the Routines page in claude.ai, paste `PROMPT.md` as the prompt, tick Gmail, Google Calendar and Google Drive as its connectors, and delete the session-bound one. Nothing else changes.
