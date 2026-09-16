# Report template

Subject: `Morning constraint report, <Ddd D Mon YYYY>: <one line, at most 70 characters>`

Plain British English, second person, direct and warm, no hype, no em-dashes, no lecturing. Main body 600 to 900 words; the appendix may be longer. Headings in this order, exactly:

1. **The constraint.** One bold sentence naming the single primary constraint, then two or three short paragraphs on the mechanism and the dated evidence, citing source and date inline, for example "(Drive, ongoing thoughts, 15 Sep)". Say what throughput it blocks in the owner's own terms. Include the day-over-day line: "Same constraint as yesterday (day N)" or "Changed from X because Y".
2. **Why not the other candidates.** Two to four runners-up, one short paragraph each, each ending with why it is downstream, a symptom, or not binding today.
3. **Exploit it today.** What to do with the constraint today, what to stop or subordinate this week (specific calendar items and inbox threads to say no to), and what elevating it would look like. Then a bold line **Today's one action**: one task finishable in under four hours, with its first physical step and a definition of done.
4. **Housekeeping (urgent, not the constraint).** Dated items due this week that do not unlock throughput, each with a deadline. Only the ones that matter.
5. **Signals to watch.** Three to five observable signals that the constraint is moving, and what would change the verdict.
6. **How this was produced.** Two sentences on the sources scanned and any source that was unavailable, plus the comparison with the previous report.
7. **Evidence appendix.** 10 to 20 compact dated facts.

Footer, one line, machine-readable: `CONSTRAINT-KEY: <kebab-case-slug> | CONFIDENCE: <0 to 1> | DATE: <YYYY-MM-DD>`. The slug stays stable from day to day while the constraint is the same.

The email carries both an HTML body (self-contained, inline CSS only, max-width 640px, system fonts, a light grey box around "Today's one action", no images) and the markdown as the plain-text body.
