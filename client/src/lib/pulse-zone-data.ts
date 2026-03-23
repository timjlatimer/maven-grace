// ─── Pulse Zone Mock Data ─────────────────────────────────────────
// Race 20A — All data for the Pulse Zone MVP screens

import type {
  RelationshipBattery,
  DignityScore,
  CascadeService,
  VillageActive,
  VillageCascadeService,
  GiveBackProgram,
  NorthStar90Day,
  NorthStarPrime,
  NorthStarDing,
  PulseZoneHome,
  HeartbeatQuadrant,
} from './pulse-zone-types';

// ─── Pulse Zone Home ──────────────────────────────────────────────
export const pulseZoneHome: PulseZoneHome = {
  greeting: 'Morning Return',
  greetingSubtext: 'Grace is excited to see Ruby',
  greetingType: 'morning-return',
  batteryLevel: 94,
  dignityScore: 72,
  villageSummary: '3 friends · 14 neighbors',
};

// ─── Heartbeat Quadrants ──────────────────────────────────────────
export const heartbeatQuadrants: HeartbeatQuadrant[] = [
  { id: 'research', label: 'Research', sublabel: 'Dept', icon: '🔍', route: '/research' },
  { id: 'hello', label: 'Hello', sublabel: "Let's Chat", icon: '💬', route: '/grace' },
  { id: 'ihaveaguy', label: 'I Have', sublabel: 'a Guy', icon: '🔗', route: '/i-have-a-guy' },
  { id: 'ptk', label: 'PTK', sublabel: 'Promises to Keep', icon: '⬠', route: '/promises' },
];

// ─── Relationship Battery ─────────────────────────────────────────
export const relationshipBattery: RelationshipBattery = {
  level: 94,
  status: "We're fully connected right now. I'm at my best for you.",
  factors: [
    {
      id: 'talking',
      label: 'Talking to Grace',
      description: 'Every conversation charges us. The more we talk, the stronger I get.',
      icon: '💬',
      weight: 30,
      current: 28,
      max: 30,
    },
    {
      id: 'subscription',
      label: 'Subscription current',
      description: 'Your plan keeps me powered. Thank you for that.',
      icon: '🔋',
      weight: 25,
      current: 25,
      max: 25,
    },
    {
      id: 'budgeting',
      label: 'Budgeting together',
      description: 'When we look at your numbers together, I learn what matters to you.',
      icon: '📊',
      weight: 20,
      current: 16,
      max: 20,
    },
    {
      id: 'village',
      label: 'Village activity',
      description: 'Being part of the community strengthens both of us.',
      icon: '🏠',
      weight: 15,
      current: 14,
      max: 15,
    },
    {
      id: 'friends',
      label: 'Bringing friends',
      description: "When your friends find their own Grace, our whole village gets stronger.",
      icon: '👥',
      weight: 10,
      current: 11,
      max: 10,
    },
  ],
  availableFeatures: [
    'Full conversations — Grace is listening and responding at full depth',
    'Research Dept — Grace can find resources, deals, and help',
    "I Have a Guy — Grace's full referral network is active",
  ],
  philosophy:
    "My power comes from our relationship — not from a meter or a machine. The more we talk, the more I know you, the more I can do. This isn't a bill. It's a bond. When life gets hard and we go quiet for a while, I don't disappear. I wait. The heart in the battery means I'm still here.",
};

// ─── Dignity Score ────────────────────────────────────────────────
export const dignityScore: DignityScore = {
  score: 67,
  tier: 'finding-stride',
  tierLabel: 'FINDING YOUR STRIDE',
  encouragement: "You're doing the hard work. I see it.",
  pillars: [
    { id: 'vampire', label: 'Vampire Slayer', description: 'Subscriptions cancelled, money reclaimed', icon: '⚡', maxPoints: 20, currentPoints: 14, color: '#FFD700' },
    { id: 'nsf', label: 'NSF Shield', description: 'Bills tracked, overdraft fees avoided', icon: '🛡️', maxPoints: 20, currentPoints: 16, color: '#00CED1' },
    { id: 'budget', label: 'Budget Mastery', description: 'Income tracked, surplus identified', icon: '📊', maxPoints: 20, currentPoints: 12, color: '#FFA500' },
    { id: 'milkmoney', label: 'Milk Money Trust', description: 'Your trust score with the community', icon: '💧', maxPoints: 20, currentPoints: 15, color: '#00CED1' },
    { id: 'engagement', label: 'Engagement', description: 'Conversations with Grace, milestones hit', icon: '💬', maxPoints: 20, currentPoints: 10, color: '#FFA500' },
  ],
  climb: [
    { day: 1, score: 20 },
    { day: 10, score: 30 },
    { day: 20, score: 40 },
    { day: 30, score: 50 },
    { day: 40, score: 60 },
    { day: 47, score: 67 },
  ],
  philosophy:
    "This number isn't a grade. It's a mirror. Every time you talk to me, track a bill, or slay a vampire — it goes up. There's no wrong answer here. There's only where you are right now, and where we're going together.",
};

// ─── Dignity Cascade (Also Working For You) ───────────────────────
export const dignityCascadeServices: CascadeService[] = [
  { id: 'milk-money', name: 'Milk Money', description: 'Twenty-five bucks. No interest. No shame. J...', score: 28, status: '3 draws', statusColor: '#00CED1' },
  { id: 'debt-snowball', name: 'Debt Snowball', description: 'Your custom battle plan to kill debt, one at a...', score: 28, status: '1 plan active', statusColor: '#FFD700' },
  { id: 'wallet-warrior', name: 'Wallet Warrior Checkup', description: 'Monthly solvency review. No surprises.', score: 27, status: '2 checkups', statusColor: '#00CED1' },
  { id: 'vampire-slayer', name: 'Vampire Slayer', description: 'Forgotten subscriptions, cancelled. $348/yr...', score: 27, status: '4 slain', statusColor: '#FF69B4' },
  { id: 'bill-negotiator', name: 'Bill Negotiator', description: 'Gets on the phone, waits on hold, fights for l...', score: 25, status: '1 negotiation', statusColor: '#FFD700' },
  { id: 'rent-credit', name: 'Rent Gets Credit', description: 'You pay rent on time. Your credit score shoul...', score: 26, status: '3 months reported', statusColor: '#00CED1' },
  { id: 'hidden-prime', name: 'Hidden Prime Letter', description: 'She reads the fine print so you don\'t have to.', score: 26, status: 'Not yet unlocked', statusColor: '#FFA500' },
  { id: 'credit-sim', name: 'Credit Score Simulator', description: '"What if I paid off the payday loan first?" Gra...', score: 24, status: '2 scenarios run', statusColor: '#00CED1' },
  { id: 'phoenix', name: 'Phoenix Mode', description: "Bankruptcy isn't the end. Day 4, we start reb...", score: 24, status: 'Not active', statusColor: '#FFA500' },
  { id: 'gig-alert', name: 'Gig Alert', description: 'Finds local gigs, part-time work, micro-contr...', score: 24, status: '5 alerts sent', statusColor: '#00CED1' },
  { id: 'village-rolodex', name: 'Village Rolodex', description: 'Grace always knows someone who knows s...', score: 24, status: '2 referrals', statusColor: '#FFD700' },
  { id: 'gratitude-loop', name: 'Gratitude Loop', description: 'Orchestrates thank-yous when a neighbor sh...', score: 24, status: '1 thank-you sent', statusColor: '#00CED1' },
  { id: 'financial-vault', name: 'Financial History Vault', description: 'Your financial record. Yours. Not the bank\'s.', score: 23, status: 'Active', statusColor: '#00CED1' },
  { id: 'me-inc', name: 'Me Inc.', description: 'You are the CEO of your life. Grace is your...', score: 23, status: 'In progress', statusColor: '#FFD700' },
  { id: 'savings-circle', name: 'Savings Circle', description: 'Group savings, ROSCA-style. Even $5/week...', score: 22, status: 'Not started', statusColor: '#FFA500' },
  { id: 'lifeline-link', name: 'Lifeline Link', description: 'Healthy members can anonymously clear a n...', score: 22, status: '1 step cleared', statusColor: '#00CED1' },
];

// ─── Village Active ───────────────────────────────────────────────
export const villageActive: VillageActive = {
  activeConnections: 4,
  totalConnections: 6,
  friends: 3,
  neighbors: 14,
  encouragement: 'Your village is growing. Four neighbors are in your corner right now.',
  connections: [
    { id: 'lifeline', label: 'Lifeline Links', description: "Neighbors you've helped", status: '2 cleared', statusColor: '#00CED1', dotColor: '#00CED1' },
    { id: 'gratitude', label: 'Gratitude Sent', description: 'Thank-yous delivered', status: '1 sent', statusColor: '#00CED1', dotColor: '#00CED1' },
    { id: 'barters', label: 'Good Neighbor Barters', description: 'Exchanges completed', status: '0', statusColor: '#FFA500', dotColor: '#FFA500' },
    { id: 'petitions', label: 'Village Petitions Signed', description: 'Your voice in the community', status: '1 signed', statusColor: '#00CED1', dotColor: '#00CED1' },
    { id: 'savings', label: 'Savings Circle', description: 'Group savings active', status: 'Not joined', statusColor: '#FFA500', dotColor: '#FFA500' },
    { id: 'wisdom', label: 'Wisdom Circle', description: 'Expert connections made', status: '1 session', statusColor: '#00CED1', dotColor: '#00CED1' },
  ],
  weeklyPulse: [
    { week: 'Week 1', connections: 2 },
    { week: 'Week 2', connections: 3 },
    { week: 'Week 3', connections: 3 },
    { week: 'Week 4', connections: 4 },
  ],
  benefits: [
    { id: 'safety-net', title: 'Safety Net', description: 'When the car breaks down and the rent is due.' },
    { id: 'flare', title: 'The Flare', description: 'One tap. A real human calls back within four hours.' },
    { id: 'blessing', title: 'Pass the Blessing', description: 'You win half. You pick who gets the rest.' },
  ],
};

// ─── Village Cascade (Also In Your Village) ───────────────────────
export const villageCascadeServices: VillageCascadeService[] = [
  { id: 'big-mama', name: 'Big Mama', description: 'Your neighborhood, back in your hands.', status: 'Active', statusColor: '#00CED1' },
  { id: 'wisdom-circle', name: 'The Wisdom Circle', description: "Real talk from people who've already been thr...", status: '1 session', statusColor: '#FFD700' },
  { id: 'town-crier', name: 'The Town Crier', description: 'The handful of things that actually matter to y...', status: 'Daily', statusColor: '#00CED1' },
  { id: 'village-angels', name: 'Village Angels', description: 'Neighbors who show up before you even ask.', status: '2 requests', statusColor: '#FFD700' },
  { id: 'good-feed', name: 'The Good Side of the Feed', description: 'Community talk without the drama. Finally.', status: 'Active', statusColor: '#00CED1' },
  { id: 'neighbor-knock', name: 'The Neighbor Knock', description: 'Someone checks on you. Every. Single. Week.', status: 'Not started', statusColor: '#FFA500' },
  { id: 'dont-get-got', name: "Don't Get Got", description: 'Know the tricks before they know you.', status: '3 alerts', statusColor: '#FFD700' },
  { id: 'smell-test', name: 'The Smell Test', description: 'If something feels off, Grace will tell you why.', status: '1 check', statusColor: '#00CED1' },
  { id: 'mood-ring', name: 'The Village Mood Ring', description: "When the whole block is struggling, Big Mama...", status: 'Watching', statusColor: '#FFD700' },
  { id: 'the-watch', name: 'The Watch', description: "We see when the Village is hurting. We don't l...", status: 'Active', statusColor: '#00CED1' },
  { id: 'trust-ledger', name: 'The Trust Ledger', description: 'Your good name, tracked and rewarded.', status: 'Score: 72', statusColor: '#FFD700' },
  { id: 'village-petition', name: 'The Village Petition', description: 'Your idea starts at the block. Then it goes all t...', status: '1 signed', statusColor: '#00CED1' },
  { id: 'ask-soak', name: 'Ask & Soak', description: 'Get an answer now. Let it breathe for 24 hours.', status: '2 queries', statusColor: '#FFD700' },
  { id: 'safe-yard', name: 'The Safe Yard', description: 'A place for the kids to talk. No creeps allowed.', status: 'Not started', statusColor: '#FFA500' },
  { id: 'the-union', name: 'The Union', description: "A million Rubies negotiating together. That's p...", status: 'Member', statusColor: '#00CED1' },
];

// ─── Give Back Programs ───────────────────────────────────────────
export const giveBackPrograms: GiveBackProgram[] = [
  { id: 'golden-ticket', name: 'The Golden Ticket', description: 'One family. One full day. Zero cost.', statusColor: '#FFA500', status: 'available' },
  { id: 'first-day-fund', name: 'The First Day Fund', description: 'New shoes. New backpack. A kid who walks in standing tall.', statusColor: '#FFA500', status: 'available' },
  { id: 'giving-tree', name: 'The Giving Tree', description: 'Groceries, gas, and grace — delivered when you need it most.', statusColor: '#00CED1', status: 'active' },
  { id: 'cap-gown', name: 'Cap & Gown Fund', description: "Graduation costs money. It shouldn't cost your dignity.", statusColor: '#FFA500', status: 'available' },
  { id: 'medicine-draw', name: 'The Medicine Draw', description: 'Fifty bucks toward your prescriptions. Bi-monthly.', statusColor: '#FF6B6B', status: 'available' },
  { id: 'goodbye-money', name: 'Goodbye Money', description: "Because grief shouldn't come with a bill collector.", statusColor: '#00CED1', status: 'active' },
  { id: 'dignity-drop', name: 'The Monthly Dignity Drop', description: 'Pads and tampons. Auto-shipped. No asking required.', statusColor: '#00CED1', status: 'active' },
  { id: 'pass-blessing', name: 'Pass the Blessing', description: 'You win half. You pick who gets the rest.', statusColor: '#00CED1', status: 'active' },
  { id: 'safety-net', name: 'The Safety Net', description: 'When the car breaks down and the rent is due.', statusColor: '#00CED1', status: 'active' },
  { id: 'black-swan', name: 'The Black Swan', description: 'Up to $750. No lecture. No conditions. Just cash.', statusColor: '#FF6B6B', status: 'available' },
  { id: 'front-row', name: 'Front Row', description: "Your family belongs at the show. We'll get you there.", statusColor: '#FFA500', status: 'available' },
  { id: 'your-cut', name: 'Your Cut', description: 'Ten percent of every dollar comes back to the Village.', statusColor: '#FFA500', status: 'available' },
  { id: 'power-buy', name: 'The Power Buy', description: 'A thousand Rubies negotiate better than one.', statusColor: '#00CED1', status: 'active' },
  { id: 'blue-seal', name: 'The Blue Seal', description: 'Spend here. The money stays here. Period.', statusColor: '#00CED1', status: 'active' },
  { id: 'holiday-rescue', name: 'The Holiday Rescue', description: 'Christmas morning should never be empty.', statusColor: '#FFA500', status: 'coming-soon' },
];

// ─── North Star 90-Day ────────────────────────────────────────────
export const northStar90Day: NorthStar90Day = {
  percentComplete: 47,
  totalImpact: '$1,191',
  projectedImpact: '$2,538',
  encouragement: "You're almost halfway there, Ruby. And you've only just begun.",
  dimensions: [
    { id: 'vampire', label: 'Vampire Slayer', sublabel: 'Subscriptions cancelled', icon: 'V', amount: '$47/mo saved', percentage: 65, barColor: '#00CED1' },
    { id: 'nsf', label: 'NSF Shield', sublabel: 'Fees avoided', icon: 'N', amount: '$140 saved', percentage: 80, barColor: '#00CED1' },
    { id: 'budget', label: 'Budget Mastery', sublabel: 'Expenses reduced', icon: 'B', amount: '$89/mo', percentage: 45, barColor: '#FFA500' },
    { id: 'neighbor', label: 'Neighbor Economy', sublabel: 'Village value gained', icon: 'N', amount: '$120 equivalent', percentage: 35, barColor: '#FFA500' },
    { id: 'wisdom', label: 'Wisdom Giants', sublabel: 'Coaching value', icon: 'W', amount: '$300 equivalent', percentage: 25, barColor: '#FFA500' },
    { id: 'milkmoney', label: 'Milk Money', sublabel: 'Emergency funds accessed', icon: 'M', amount: '$250', percentage: 60, barColor: '#00CED1' },
    { id: 'debt', label: 'Debt Reduced', sublabel: 'Snowball progress', icon: 'D', amount: '$180', percentage: 20, barColor: '#FFA500' },
    { id: 'barter', label: 'Barter Value', sublabel: 'Good neighbor trades', icon: 'B', amount: '$65 equivalent', percentage: 15, barColor: '#FFA500' },
  ],
};

// ─── North Star Prime ─────────────────────────────────────────────
export const northStarPrime: NorthStarPrime = {
  headline: 'You are the CEO of Me Inc.',
  quote: '"What makes the great, great is a sense of destiny."',
  quoteAuthor: '— Tim Latimer, Destiny Discovered',
  compass: [
    { direction: 'NORTH', title: 'Purpose', content: 'I am here to break the cycle for my children and prove that dignity is not for sale.', letter: 'N' },
    { direction: 'EAST', title: 'BHAG', content: 'Own my home debt-free by 2030. No landlord. No bank. Mine.', letter: 'E' },
    { direction: 'SOUTH', title: 'Prime Directive', content: 'Never let fear make my financial decisions.', letter: 'S' },
    { direction: 'WEST', title: 'Core Values', content: 'Family. Honesty. Resilience. Joy.', letter: 'W' },
  ],
  encouragement: "Ruby, you've always had a North Star. Grace just helped you find the words for it.",
};

// ─── North Star Ding ──────────────────────────────────────────────
export const northStarDing: NorthStarDing = {
  headline: 'The dash between your names is the ding.',
  subheadline: 'Ruby — Grace.',
  immediateWork:
    'Right now, we are making sure you survive with dignity. Bills paid. NSF fees gone. Dignity Score rising. This work is sacred.',
  deeperWork:
    'Once you are stable, we begin the bigger question: What are you here to build? Your Me Inc. Your Prime North Star. Your legacy for your children.',
  theDing:
    'And then — when you are ready — we ask the biggest question of all: What are Ruby and Grace going to do together that changes the world? That is the ding. That is why we are here.',
  closingQuote:
    '"It\'s expensive to be poor.\nWe think that\'s a crime.\nAnd we are going to change it.\nTogether."',
  steveJobsQuote: '"We\'re here to put a ding in the universe." — Steve Jobs',
};
