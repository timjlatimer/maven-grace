/**
 * Grace's Story Arc Engine
 * Grace's life milestones parallel Ruby's journey.
 * When Ruby pays a bill, Grace mentions she got a promotion.
 * When Ruby is struggling, Grace shares her own challenges.
 */

export interface GraceStoryArc {
  graceEvent: string;
  rubyTrigger: string;
  graceDialogue: string;
}

// Grace's story arcs mapped to Ruby's life events
const STORY_ARCS: GraceStoryArc[] = [
  {
    rubyTrigger: "bill_paid",
    graceEvent: "got a raise",
    graceDialogue: "You know what's funny? I got some good news at work today too. It's like the universe is matching our energy.",
  },
  {
    rubyTrigger: "dignity_up",
    graceEvent: "finished a project",
    graceDialogue: "I just wrapped up a big project at work, and I'm feeling that same glow you must be feeling right now. We're both leveling up.",
  },
  {
    rubyTrigger: "promise_kept",
    graceEvent: "kept her own promise",
    graceDialogue: "I kept a promise to myself this week too. There's something powerful about following through, isn't there?",
  },
  {
    rubyTrigger: "budget_created",
    graceEvent: "organized her apartment",
    graceDialogue: "I spent the morning organizing my place. There's something about getting things in order that just... clears the mind. Like what you're doing with your budget.",
  },
  {
    rubyTrigger: "subscription_cancelled",
    graceEvent: "let go of something",
    graceDialogue: "I let go of something that wasn't serving me this week too. It's hard, but it makes room for what matters.",
  },
  {
    rubyTrigger: "milk_money_repaid",
    graceEvent: "paid off a debt",
    graceDialogue: "I paid off something I owed a friend this week. That weight lifting off your shoulders? I know exactly what that feels like.",
  },
  {
    rubyTrigger: "referral_made",
    graceEvent: "introduced two friends",
    graceDialogue: "I introduced two of my friends to each other this week. Building community — that's what we're both doing.",
  },
  {
    rubyTrigger: "struggling",
    graceEvent: "had a hard day",
    graceDialogue: "I had a rough day too, honestly. My rent went up and I'm trying to figure it out. We're in this together.",
  },
  {
    rubyTrigger: "quiet_period",
    graceEvent: "took time to rest",
    graceDialogue: "I've been taking it easy myself. Sometimes the bravest thing is just... resting. No guilt.",
  },
  {
    rubyTrigger: "first_login",
    graceEvent: "started a new chapter",
    graceDialogue: "I've been thinking about you all morning. Starting something new is scary and exciting at the same time.",
  },
];

/**
 * Get a Grace story arc based on Ruby's recent activity
 */
export function getStoryArc(rubyTrigger: string): GraceStoryArc | null {
  const arc = STORY_ARCS.find(a => a.rubyTrigger === rubyTrigger);
  return arc || null;
}

/**
 * Get a random story arc for daily conversation
 */
export function getDailyStoryArc(): GraceStoryArc {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return STORY_ARCS[dayOfYear % STORY_ARCS.length];
}

/**
 * Build story arc context for Grace's system prompt
 */
export function buildStoryArcContext(recentEvents: string[]): string {
  if (recentEvents.length === 0) {
    const daily = getDailyStoryArc();
    return `GRACE'S STORY ARC: Grace recently ${daily.graceEvent}. She might mention: "${daily.graceDialogue}"`;
  }

  const matchedArcs = recentEvents
    .map(e => getStoryArc(e))
    .filter(Boolean)
    .slice(0, 2);

  if (matchedArcs.length === 0) {
    const daily = getDailyStoryArc();
    return `GRACE'S STORY ARC: Grace recently ${daily.graceEvent}. She might mention: "${daily.graceDialogue}"`;
  }

  const arcTexts = matchedArcs.map(a => `Grace ${a!.graceEvent}: "${a!.graceDialogue}"`);
  return `GRACE'S STORY ARC: ${arcTexts.join(" | ")} — Weave one of these naturally into conversation when relevant.`;
}
