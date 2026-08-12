export interface ChecklistItem {
  id: string;
  label: string;
}

export interface Section {
  id: string;
  title: string;
  emoji: string;
  items: ChecklistItem[];
}

export const SECTIONS: Section[] = [
  {
    id: 'morning',
    title: 'Morning',
    emoji: '🌅',
    items: [
      { id: 'morning-wake', label: 'Wake at the planned time' },
      { id: 'morning-goal', label: 'Write down my main financial or business goal' },
      { id: 'morning-why', label: 'Spend 10 minutes thinking about why it matters' },
      { id: 'morning-outcome', label: "Choose today's single most valuable outcome" },
      { id: 'morning-calendar', label: 'Put every commitment and work block in my calendar' },
      { id: 'morning-blocked', label: 'Keep social media, news and entertainment blocked' },
      { id: 'morning-breakfast', label: 'Eat a simple, nutritious breakfast — or follow my chosen eating plan' },
    ],
  },
  {
    id: 'work',
    title: 'Focused work',
    emoji: '🎯',
    items: [
      { id: 'work-hardest', label: 'Begin with the hardest, highest-value task' },
      { id: 'work-onetask', label: 'Work on one task with one tab or screen' },
      { id: 'work-phone', label: 'Keep my phone out of reach' },
      { id: 'work-deepblocks', label: 'Complete at least two uninterrupted deep-work blocks' },
      { id: 'work-decline', label: "Decline distractions that do not serve today's priorities" },
      { id: 'work-breaks', label: 'Take short breaks before focus noticeably drops' },
      { id: 'work-pace', label: 'Maintain a sustainable pace rather than chase burnout' },
      { id: 'work-produce', label: 'Produce something concrete: sales, product, content, outreach or delivery' },
    ],
  },
  {
    id: 'health',
    title: 'Health',
    emoji: '💪',
    items: [
      { id: 'health-wholefoods', label: 'Eat mostly whole foods' },
      { id: 'health-water', label: 'Drink enough water' },
      { id: 'health-avoid', label: 'Avoid nicotine and excessive caffeine, alcohol and added sugar' },
      { id: 'health-heavymeal', label: 'Avoid a heavy meal during key working hours' },
      { id: 'health-train', label: 'Train, walk or complete some cardio' },
      { id: 'health-signs', label: 'Notice signs of exhaustion, anxiety or poor recovery' },
      { id: 'health-relationships', label: 'Protect time for my partner, family or supportive friends' },
    ],
  },
  {
    id: 'mindset',
    title: 'Mindset',
    emoji: '🧠',
    items: [
      { id: 'mindset-judging', label: 'Catch myself judging someone and let it go' },
      { id: 'mindset-discomfort', label: 'Sit quietly with discomfort instead of escaping into scrolling' },
      { id: 'mindset-feeling', label: 'Ask: "What is this feeling telling me?"' },
      { id: 'mindset-responsibility', label: 'Take responsibility for my next response' },
      { id: 'mindset-control', label: 'Focus on actions I control' },
      { id: 'mindset-uncomfortable', label: 'Do one uncomfortable task I have been avoiding' },
      { id: 'mindset-standard', label: 'Act to a high standard in small tasks, not just visible ones' },
    ],
  },
  {
    id: 'evening',
    title: 'Evening',
    emoji: '🌙',
    items: [
      { id: 'evening-stop', label: 'Stop work at the planned time' },
      { id: 'evening-record', label: 'Record what I completed' },
      { id: 'evening-tomorrow', label: "Write tomorrow's most valuable outcome" },
      { id: 'evening-prepare', label: "Prepare tomorrow's calendar, clothes, food and workspace" },
      { id: 'evening-noscreens', label: 'Spend the final hour without screens' },
      { id: 'evening-rest', label: 'Use quiet, low-stimulation rest rather than endless content' },
      { id: 'evening-bedtime', label: 'Go to bed at a consistent time' },
      { id: 'evening-sleep', label: 'Allow roughly eight hours for sleep' },
    ],
  },
];

export const SCORE_SECTION: Section = {
  id: 'score',
  title: 'Daily score',
  emoji: '🔒',
  items: [
    { id: 'score-goal', label: 'Goal reviewed' },
    { id: 'score-calendar', label: 'Calendar followed' },
    { id: 'score-deepwork', label: 'Deep work completed' },
    { id: 'score-distractions', label: 'Distractions controlled' },
    { id: 'score-body', label: 'Body cared for' },
    { id: 'score-relationship', label: 'Important relationship cared for' },
    { id: 'score-tomorrow', label: 'Tomorrow prepared' },
  ],
};

export const SCORE_MAX = SCORE_SECTION.items.length;

/** A day counts as "locked in" (extends the streak) at this score or above. */
export const LOCKED_IN_THRESHOLD = 6;

export const ALL_ITEM_COUNT =
  SECTIONS.reduce((n, s) => n + s.items.length, 0) + SCORE_SECTION.items.length;
