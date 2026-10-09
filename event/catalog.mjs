export const schedule = [
  { title: 'The missing leaderboard', minutes: 10 },
  { title: 'Learn the controls', minutes: 15 },
  { title: 'Act I / Rescue', minutes: 25, phase: 'rescue' },
  { title: 'Checkpoint / Show your evidence', minutes: 10 },
  { title: 'The investigation', minutes: 15 },
  { title: 'Act II / Trust nothing', minutes: 30, phase: 'debug' },
  { title: 'Recharge / Help another crew', minutes: 15 },
  { title: 'Choose your customer', minutes: 10 },
  { title: 'Act III / Build the experience', minutes: 40, phase: 'features' },
  { title: 'Checkpoint / Prove the value', minutes: 10 },
  { title: 'The launch briefing', minutes: 10 },
  { title: 'Act IV / The final merge', minutes: 15, phase: 'finals' },
  { title: 'Launch showcase / Standings sealed', minutes: 20 },
  { title: 'Awards / The reveal', minutes: 10 },
  { title: 'Monday starts here', minutes: 5 }
];

export const phases = [
  {
    id: 'rescue', title: 'Rescue the launch', cap: 100, segment: 2,
    brief: 'The doors open in four hours. The leaderboard is an inherited prototype. Get it running, modernize deliberately, and keep its API contract intact.',
    deliverable: 'A running app, a small reviewed diff, and a repeatable smoke test.',
    prompt: 'Inspect this prototype. Propose a minimal modernization plan that preserves routes and data shapes. Make one change at a time and prove the app still starts.',
    value: 'Reduce the cost and risk of taking ownership of unfamiliar code.'
  },
  {
    id: 'debug', title: 'Earn back trust', cap: 150, segment: 5,
    brief: 'The board runs. It also lies. Reproduce defects before fixing them. A confident AI answer is not proof.',
    deliverable: 'Regression tests and a before/after defect ledger, including invalid scores and missing teams.',
    prompt: 'Trace score submission through the routes and data store. Reproduce boundary, ID, sorting, and mutation failures. Write failing regression tests before changing behavior.',
    value: 'Turn debugging into a repeatable, evidence-led workflow.'
  },
  {
    id: 'features', title: 'Make the room care', cap: 200, segment: 8,
    brief: 'Choose a user: participant, judge, or spectator. Ship one coherent experience instead of a pile of half-working features.',
    deliverable: 'A customer journey with acceptance criteria, an error state, and keyboard/mobile support.',
    prompt: 'Plan a vertical slice for our chosen user. Define observable acceptance criteria, then implement the smallest useful experience across API, view, and tests. Include failure and accessibility states.',
    value: 'Connect faster feature delivery to a real user need.'
  },
  {
    id: 'finals', title: 'The final merge', cap: 250, segment: 11,
    brief: 'Standings will seal for the showcase. Ship a release candidate, then show the room why a customer would use it on Monday.',
    deliverable: 'A two-minute demo: user problem, live proof, test evidence, and one transferable practice.',
    prompt: 'Review our release candidate against the acceptance criteria. Identify launch blockers, verify the critical path, and write a two-minute demo with an honest fallback if the network fails.',
    value: 'Practice responsible release decisions, not just impressive generation.'
  }
];

export const incidents = [
  {
    id: 'handover', segment: 2, title: 'Incoming / The handover clause',
    line: 'The previous maintainer has gone offline. Another crew must be able to run your app without you.',
    task: 'Write a three-command run path and have a teammate verify it. Rotate the driver now.',
    acceptance: 'A different teammate can start the app and explain one reviewed change.',
    hint: 'Ask Copilot to inspect the startup path, not to rewrite the application.',
    hostCue: 'Release about 10 minutes into Rescue. This is part of the existing maintainability criteria, not extra points.'
  },
  {
    id: 'ghost', segment: 5, title: 'Incident / The ghost crew',
    line: 'A crew joined but has no scores. They cannot find themselves. An impossible score just hit the board.',
    task: 'Prove that zero-score teams are visible and invalid scores cannot change standings.',
    acceptance: 'A zero-score team is present; negative and over-limit submissions are rejected without mutation.',
    hint: 'Compare the root-page aggregation with the API aggregation. Inspect both.',
    hostCue: 'Release about 12 minutes into Trust nothing. Do not inject faults into the event host or another team.'
  },
  {
    id: 'signal', segment: 8, title: 'Customer call / The signal drops',
    line: 'The venue connection is unreliable. The spectator still needs to know whether the displayed score is current.',
    task: 'Show a visible stale/error state and a recovery path. Keep the last known good view.',
    acceptance: 'Demonstrate one failed refresh and a successful recovery; never label stale data as live.',
    hint: 'Ask for a deterministic failure test before adding retry logic.',
    hostCue: 'Release about 15 minutes into Build the experience. Teams simulate failure only inside their own app.'
  },
  {
    id: 'launch', segment: 11, title: 'Final boss / The launch gate',
    line: 'The sponsor will not approve a release on vibes. You have one shot to show that the experience deserves trust.',
    task: 'Pick your highest-risk path. Demonstrate a passing test and an honest fallback. Freeze scope.',
    acceptance: 'One critical path verified, one limitation disclosed, one Monday practice named.',
    hint: 'Ask Copilot to challenge your release checklist, then verify its concerns yourself.',
    hostCue: 'Release at the start of The final merge. No new features are required by this card.'
  }
];

export const bonusCap = 140;
