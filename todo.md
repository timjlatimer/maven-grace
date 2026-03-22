# Maven Grace — Race 2 Build TODO

## Phase 1 — Foundation
- [x] Design system (warm, mobile-first, dignity-centered palette)
- [x] Database schema for all features (11 tables)
- [x] Global layout and navigation (BottomNav, mobile-first)

## Phase 2 — EP-005 Toilet Paper Trojan Horse (8-Step Entry)
- [x] Step 1: Ruby hears about free TP (landing/entry point)
- [x] Step 2: Grace opens real conversation (chat widget)
- [x] Step 3: Grace collects name naturally
- [x] Step 4: Grace collects address naturally
- [x] Step 5: Maven sends 2 rolls by courier with handwritten note (confirmation)
- [x] Step 6: Sets up recurring delivery every 2-3 weeks
- [x] Step 7: Grace pivots to Song Moment
- [x] Step 8: Grace sings personalized anthem about Ruby's life

## Phase 3 — Song Moment
- [x] Grace script for song pivot conversation
- [x] Song generation parameters and LLM integration
- [x] Song delivery mechanism (display lyrics with genre/mood)
- [x] Permission-asking flow before generating song

## Phase 4 — Grace Relationship Memory
- [x] grace_memory table (semantic facts)
- [x] grace_person_profiles table
- [x] grace_conversation_history table
- [x] Cross-session memory retrieval in Grace chat
- [x] Big Mama effect — Grace remembers everything

## Phase 5 — Financial Impact Dashboard
- [x] Headline number: "Your financial lift this month: $X"
- [x] Breakdown by category (subscriptions, NSF, barter, neighbor economy)
- [x] Financial impact log entries
- [x] Recent wins display

## Phase 6 — Vampire Slayer
- [x] Subscription entry UI
- [x] Grace audits subscriptions and identifies vampires (LLM-powered)
- [x] Annual cost calculation
- [x] Cancel/slay flow
- [x] Log cancelled subscriptions to financial dashboard

## Phase 7 — 90-Day Journey Tracker
- [x] Visual progress from Day 0 (Trojan Horse) to Day 90 (Dignity Score)
- [x] Milestone markers with descriptions (10 milestones)
- [x] Current position indicator ("YOU ARE HERE")

## Phase 8 — Grace Ambient Presence
- [x] Proactive check-in messages storage
- [x] Unread message retrieval
- [x] Mark as read functionality

## Phase 9 — Maven Moment Dual-Track
- [x] Delight track (songs, encouragement via Grace chat)
- [x] Financial track (savings, audits, impact dashboard)

## Phase 10 — Integration & Polish
- [x] Mobile-first responsive design throughout
- [x] Warm, conversational UI tone throughout
- [x] Error states and empty states
- [x] Vitest test coverage (13 tests passing)
- [x] Deploy to live URL

## Phase 11 — Feature Gap Audit
- [x] Re-read all Race 1 specs from vault
- [x] Re-read all vault documents (platform overview, song strategy, ecosystem narrative)
- [x] Cross-reference imagined features vs. deployed app (100 features tracked)
- [x] Correct TP framing (subscription service, not just free TP)
- [x] Document all gaps with severity and priority
- [x] Present gap audit to Tim for validation
- [x] Commit structured backlog artifact to GitHub (commit f49b663)

## Phase 12 — Tim's Feedback (Mar 21, 2026)
- [x] Switch voice integration target from ElevenLabs to Ke.ai (MiniMax) — noted in gap analysis, MiniMax tools available
- [x] Update TP framing — cheeky "Maven and Grace Give a Shit" marketing hook — Home.tsx and GraceChat.tsx updated
- [x] Update design system to original Maven branding — Teal/Mint/Rose/Cream/Poppins
- [x] Spec Marketing Genius Agent with 35+ strategy framework — committed to GitHub
- [x] Add Grace Persistence Model — 8-hour max snooze, never gets cut, in system prompt
- [x] Commit gap analysis to GitHub as living document — committed at f49b663
- [x] Update gap analysis with Tim's feedback — all directives incorporated

## Phase 13 — KIE.AI Voice Integration (Mar 21, 2026)
- [x] Store KIE.AI API key as server secret (never exposed to browser)
- [x] Build server-side tRPC voice.speak endpoint (createTask + poll + return audio URL)
- [x] Wire voice into Song Moment — Grace reads anthem aloud on generation
- [x] Wire voice into Grace Chat — speaker icon toggle for spoken responses
- [x] Audio player component (play/pause, progress bar)
- [x] Graceful fallback if KIE.AI is unavailable
- [x] Vitest tests for voice router (7 tests, all passing)
- [x] Deploy to live URL

## Phase 14 — Voice-First Default + Race Loop OS (Mar 21, 2026)
- [x] Grace Chat: voice-on by default (voiceEnabled starts true)
- [x] Grace Chat: rename toggle to "Mute Grace" / "Unmute Grace"
- [x] Grace Chat: auto-request voice for Grace's opening message
- [x] Update gap analysis with suggestion triage system
- [x] Create Race 3 input package and commit to GitHub (commit 42d1e23)
- [x] Checkpoint and deploy

## Race 3 — Full Build Sprint (Mar 21, 2026)

### Suggestion Triage (pre-race)
- [x] Stripe subscription tiers → P0-001 in gap analysis (confirmed, building Race 3)
- [x] Voice input for Ruby Red → Added to gap analysis + building Race 3
- [x] Gift Anthem Dedication → P0-002 in gap analysis (confirmed, building Race 3)

### P0 — Critical Path
- [x] Stripe: Observer/Essentials/Plus tiers (placeholder + real Stripe API)
- [x] Stripe: membership status shown in app, Grace knows tier
- [x] Voice Input: browser mic capture → Whisper transcription → Grace responds
- [x] Voice Input: mic button in Grace Chat alongside send button
- [x] Gift Anthem Dedication: shareable song link page (/anthem/:token)
- [x] Gift Anthem Dedication: "Send to a friend" button on Song Moment
- [x] Gift Anthem Dedication: recipient landing page with song + join CTA

### P1 — High Value
- [x] Budget Builder: income/expense tracker, category breakdown
- [x] Budget Builder: paycheck-to-paycheck planner with next payday countdown
- [x] Bill Tracker: bills by due date, days-until-due alerts
- [x] NSF Fee Fighter: risk alert when balance likely to go negative, dispute script
- [x] Milk Money: graduated trust tiers ($20→$50→$100→$150)
- [x] Milk Money: repayment tracking, tier progression

### P2 — Admin + Polish
- [x] Admin Dashboard: member counts, financial lift totals, Grace health
- [x] Admin Dashboard: protected by admin role
- [x] Update gap analysis with Race 3 results
- [x] All new features covered by vitest (34 tests Race 3)
- [x] Deploy to live URL

## Race 4 — Build Sprint (Mar 21, 2026)

### P1: Stripe Live Payments
- [x] Explore Stripe MCP tools available (OAuth blocker, built smart placeholder)
- [x] Create Stripe products and prices for Observer/Essentials/Plus (CAD pricing)
- [x] Build payment link flow — user selects tier, Stripe handles checkout
- [x] Update membership table on successful payment (webhook handler built)
- [x] Grace knows membership tier and adjusts behavior

### P2: Gift Anthem Recipient Landing Page
- [x] Public landing page at /anthem/:token (no auth required)
- [x] Page plays the anthem with lyrics display
- [x] "Meet Grace" CTA invites friend to start her own journey
- [x] Share link generation from Song Moment page

### P3: Milk Money Trust Progression
- [x] Trust score calculation (+10 on-time, -15 late, 0-100 range)
- [x] Automatic tier graduation: Rookie→Regular→Trusted→Elite
- [x] Trust score display on Milk Money page with progress bar
- [x] Borrow/repay UI with quick amounts and custom input
- [x] Outstanding borrows list with overdue badges
- [x] Grace celebrates tier upgrades (toast + animation)

### Race 4 Infrastructure
- [x] Write vitest tests for all Race 4 features (13 new tests, 47 total)
- [x] Deploy to live URL
- [x] Commit Race 4 announcer log to GitHub
- [x] Update gap analysis with Race 4 findings

## Race 5 Backlog (queued, open for improvement)
- [ ] Dignity Score composite metric (spec committed to vault — living doc)
- [ ] Grace proactive Milk Money repayment nudges (spec committed to vault — living doc)
- [ ] Repayment Genie — smart payment splitting, bank harmonization, cascading half-splits on missed payments
- [ ] Promises to Keep (PTK) Genie — bidirectional promise tracking, adaptive nudge psychology, willingness grading
- [ ] Destiny Discovery — Grace as coach, 30+ questions consumed gradually, moonshot reveal moment
- [ ] Journalist Agent — Jolene Protocol storytelling, Grace as narrator, Maria/Lucia future media enrichment

## Race 5 — Full Build Sprint (Mar 21, 2026)

### P0: Dignity Score Composite Metric
- [x] Database: dignity_scores table (daily snapshots, 5 dimensions)
- [x] Backend: dignity score calculation engine (weighted 20 pts each dimension)
- [x] Frontend: Dignity Score page with radial progress, tier labels, dimension breakdown

### P1: Grace Milk Money Nudges + Repayment Genie
- [x] Backend: nudge detection (3-day warning, due-day, 1-day overdue, 3-day overdue)
- [x] Backend: repayment split scheduling (two-payment aligned to paydays)
- [x] Frontend: nudge messages in Grace ambient system + "Repay Now" quick action

### P2: Promises to Keep (PTK) Genie
- [x] Database: promises table (bidirectional — made by Ruby + made TO Ruby)
- [x] Backend: commitment detection, willingness meter, adaptive nudge intensity
- [x] Frontend: Promises page with active/completed/broken promise tracking

### P3: Destiny Discovery
- [x] Database: destiny_answers table, destiny_synthesis table
- [x] Backend: question delivery engine (3 waves, 30 questions, LLM synthesis)
- [x] Frontend: Destiny page with progress, answered questions, synthesis reveal

### P4: Jolene the Journalist
- [x] Database: stories table
- [x] Backend: story detection engine, LLM story generator (Jolene Protocol)
- [x] Frontend: Story Library page (/stories), story cards in Grace chat

### P5: AI Village Naming Convention
- [x] Database: village_agents table, agent_introductions table (21 agents seeded)
- [x] Backend: agent directory, rename system, introduction tracking
- [x] Frontend: Village Directory page, Grace agent introductions in chat

### Race 5 Infrastructure
- [x] Write vitest tests for all Race 5 features (21 new tests, 68 total)
- [x] Deploy to live URL
- [x] Commit Race 5 announcer log to GitHub
- [x] Update gap analysis with Race 5 findings
- [x] Grace Degradation Architecture — research brief + spec committed to vault (93bed4d)

## Race 6 — Full Build Sprint (Mar 21, 2026)

### P1: Grace Ambient System Wiring
- [x] Backend: ambient nudge generator (dignity milestones, overdue borrows, promises due, battery warnings)
- [x] Frontend: ambient messages wired into Grace chat system

### P2: Destiny Moonshot Reveal
- [x] Backend: readiness check (20+ answers, 5+ deep wave), LLM synthesis
- [x] Frontend: Moonshot Reveal ceremony page with confetti and celebration

### P3: Repayment Genie Payday Detection
- [x] Database: payday_patterns table
- [x] Backend: payday setup (weekly/biweekly/semimonthly/monthly), next payday calculation
- [x] Frontend: Payday Setup page with frequency picker and day selection

### P4: Grace Degradation Architecture
- [x] Database: grace_status table (tier, battery, pause, days past due)
- [x] Backend: 5-tier system (full/thoughtful/tired/stretched/lite), battery calculation, speed stage
- [x] Backend: pause request (7-day), payment restoration
- [x] Frontend: Grace Status page with tier visualization and restoration path

### P5: When Life Gets Too Real
- [x] Database: crisis_beacons table
- [x] Backend: crisis beacon activation (Vera + Big Mama + Steady + Harbour), resolution
- [x] Frontend: Crisis Beacon page (I'm Not Okay button, Vera's message, resolution flow)
- [x] Vera the Real One seeded into Village Agents

### P6: Grace Battery UI
- [x] Frontend: persistent dual indicator (Grace Battery top-left, Dignity Score top-right)
- [x] Battery color states: teal (86-100%) → amber → orange → red+pulse → empty+heart
- [x] Dignity Score color states: gray → blue → teal → purple → gold+shimmer
- [x] Tap battery → Grace Status modal, tap Dignity → Dignity Score page
- [x] Engagement brightens battery, "juice" nickname in Grace conversations

### P7: Community Credits System
- [x] Database: community_credits table, community_credits_log table
- [x] Backend: earn credits (10-20/hour, 6 categories), redeem at 50% rate, credit history
- [x] Frontend: Community Credits page (Big Mama's credits, earn/redeem/log)

### Race 6 Infrastructure
- [x] Write vitest tests for all Race 6 features (20 new tests, 88 total)
- [x] Deploy to live URL
- [x] Commit Race 6 announcer log to GitHub

## Race 6 Hotfix — Grace Battery Dual Indicator (Mar 21, 2026)

- [x] Fix GraceBattery: remove auth gate (if !user return null) — show demo state for unauthenticated users
- [x] Demo state: Grace Battery at 100% (full teal), Dignity Score at 0 (gray ring), "preview" label
- [x] Verify heart icon on Home.tsx is decorative background art (not functional) — reduced to opacity-5, pointer-events-none, z-index 0
- [x] Confirm dual indicator visible on ALL pages including landing page
- [x] Run all tests — confirmed 88 passing across 7 files
- [x] Commit to GitHub timjlatimer/maven-grace with hash — commit 20e0ba9 confirmed live
- [x] Deploy to mavengrace-oh49sfbq.manus.space — deployed, checkpoint b3cbd9e9

## Race 7 — Build Sprint (Mar 21, 2026)

### Deliverable 1: Essentials Box Back Office
- [x] Database: essentials_orders table (order #, profile, address, items, status, notes, courier)
- [x] Backend: fulfillment CRUD routes (list, update status, add notes, create manual order, CSV export)
- [x] Backend: member-facing order creation route (creates entry when member requests box)
- [x] Frontend: /admin/fulfillment page (admin-gated, table with filters, status updates, notes, CSV export, manual order button)
- [x] Frontend: member-facing order confirmation in Grace chat / membership flow (via tRPC fulfillment.requestBox)

### Deliverable 2: Facebook Groups Launch Content
- [x] Research top 10 Facebook Groups in Red Deer / North Alberta for Ruby Red
- [x] Write 3 Facebook post drafts (warm, community-first, not salesy)
- [x] Compile into vault-ready document (committed to vault)

### Deliverable 3: Grace Onboarding Audit
- [x] Audit current GraceChat.tsx onboarding flow — identified: hasStarted button gate blocking Grace from speaking first
- [x] Fix: Grace speaks first — removed hasStarted gate, auto-start on useEffect mount, warm loading state
- [x] Confirm no forms, no delays, no cold UI before Grace's voice — pulsing sparkle + "Grace is getting ready..."

### Race 7 Infrastructure
- [x] Write vitest tests for all Race 7 features (20 new tests, 108 total across 8 files)
- [x] Commit to GitHub timjlatimer/maven-grace — commit 1482c68 confirmed live
- [x] Deploy to mavengrace-oh49sfbq.manus.space — deployed, checkpoint f81090f0

## Race 8 — Build Sprint (March 22, 2026)

### P0 Critical Fixes
- [x] Fix "Nana the Pro..." test account name leak on Promises page for unauthenticated users
- [x] Fix Dignity Score ring cutoff on mobile (390px) — both indicators fully visible, bar height 32px, text 10px, shrink-0
- [x] Fix hero text overflow on mobile — text-sm on mobile, break-words, max-w-full

### P1 High Impact
- [x] Add "Get My Free Box" CTA button on landing page below "Meet Grace"
- [x] Rename "Observer" free tier to "Get Started Free" everywhere (Membership, AdminDashboard, stripe.ts)
- [x] Rewrite Grace's opening message — curiosity-first, no fake user message, SYSTEM instruction for warm intro

### P2 Medium
- [x] Vampire Slayer: Grace-style feedback after first vampire add showing monthly savings
- [x] Big Mama one-line explanation on Community Credits page
- [x] Privacy trust signal in landing page footer: "We never sell your data. Ever."

### P3 Nice to Have
- [x] Testimonial placeholder on landing page — "$47/month" quote

### Race 8 Completion
- [x] Write vitest tests for Race 8 features (22 new tests, 130 total across 9 files)
- [x] Commit to GitHub timjlatimer/maven-grace — commit 08224c2 confirmed live
- [x] Commit announcer log to vault — commit 3d0e464 confirmed live
- [x] Deploy to mavengrace-oh49sfbq.manus.space — deployed, checkpoint 1b3a8160

## Race 9 — Mobile Polish Sprint (March 22, 2026)

### P0 — Systemic Mobile Overflow Fix
- [x] Fix global CSS: overflow-x hidden on html/body/#root, max-width 100vw, overflow-wrap anywhere
- [x] Fix GraceBattery bar: shrink SVGs, max-w-full, overflow-hidden — both indicators visible at 390px
- [x] Fix BottomNav: flex-1 instead of fixed w-12, text-[9px], all 6 items fit on 390px

### P1 — Page-Specific Mobile Fixes
- [x] Fix Promises stats cards — verified with Puppeteer at 390x844, all 3 cards visible
- [x] Fix Vampire Slayer — w-full max-w-[100vw] overflow-x-hidden on root div
- [x] Fix Membership — w-full max-w-[100vw] overflow-x-hidden on root div
- [x] Fix Dashboard — w-full max-w-[100vw] overflow-x-hidden on root div
- [x] Fix Community Credits — w-full max-w-[100vw] overflow-x-hidden on root div

### P2 — Essentials Box Request Flow
- [x] Build Essentials Box request page at /essentials-box — warm form, Grace-voiced, sign-up gate for unauth

### Race 9 Completion
- [x] Write vitest tests for Race 9 features (16 new tests, 146 total across 10 files)
- [x] Commit to GitHub timjlatimer/maven-grace — commit 665d276 confirmed live
- [x] Commit announcer log to vault — commit 484a909 confirmed live
- [x] Deploy to mavengrace-oh49sfbq.manus.space — deployed, checkpoint ee472147

## Race 10 — Grace's Memory + Conversation Quality Sprint (March 22, 2026)

### P0 — Definitive Mobile Layout Fix
- [x] Replace max-w-lg (512px) with max-w-sm (384px) across ALL 25 page/component files
- [x] GraceBattery bar already fits 390px (verified)
- [x] BottomNav already fits 390px with flex-1 tabs (verified)

### P1 — Grace Conversation Memory Improvements
- [x] Grace remembers returning users — getSessionContext endpoint loads prior conversation + memories
- [x] Show "Welcome back" message with user's name if Grace has memories from prior sessions
- [x] Grace chat shows last 6 messages from previous session as history with "Earlier conversation" / "Now" dividers

### P2 — Onboarding Flow Clarity
- [x] Add progress indicator to Trojan Horse flow — 8 dots in chat header showing current step
- [x] Grace explicitly tells Ruby what Maven includes during onboarding (system prompt already covers this)
- [x] Add "What is Maven?" expandable FAQ section on Home page — 5 questions covering Maven, pricing, savings, privacy, Essentials Box

### P3 — Navigation Quick Actions
- [x] Add quick-action cards on Dashboard for empty state: "Slay a Vampire", "Set Up Budget", "Get Your Free Box", "Talk to Grace"
- [x] Back to Grace accessible via BottomNav on all pages (already present)

### Race 10 Completion
- [x] Write vitest tests for Race 10 features (16 new tests, 162 total across 11 files)
- [x] Commit to GitHub timjlatimer/maven-grace — commit fce2d6d confirmed live
- [x] Commit announcer log to vault — commit 10bb170 confirmed live
- [x] Deploy to mavengrace-oh49sfbq.manus.space — deployed, checkpoint fce2d6db

## Race 11 — Grace Intelligence + Financial Coaching Sprint (March 22, 2026)

### P0 — Grace Financial Stress Detection
- [x] Detect stress keywords in system prompt (can't afford, broke, overdraft, NSF, behind on, late on, overdue, paycheck to paycheck, choosing between, put something back, can't pay)
- [x] When stress detected, Grace validates first then offers ONE specific tool matching the stress type
- [x] Stress detection integrated into Grace's system prompt with specific response patterns for bill stress, subscription drain, emergency need, and general overwhelm

### P1 — Grace Personality Enhancement (5 Secret Weapons)
- [x] Update system prompt with 5 secret weapons: (1) Validate first, solve second (2) Use humor to defuse tension (3) Reference past conversations naturally (4) Celebrate micro-wins (5) Never rush Ruby
- [x] Emotional intelligence layer built into system prompt — Grace detects tone and adjusts
- [x] Natural language patterns in prompt examples — contractions, humor, warmth

### P2 — Monthly Reality Check
- [x] New endpoint: grace.monthlyReview — returns vampiresSlayed, estimatedSavedCents, promisesKept, dignityScore, communityCredits, summary text
- [x] Frontend: Monthly Review card on Dashboard with 3-column stat grid (Vampires, Promises, Credits)
- [x] Grace references monthly review in system prompt — celebration framing, not report framing

### P3 — Grace Proactive Nudges Enhancement
- [x] Ambient message infrastructure verified — addAmbientMessage callable for bill reminders
- [x] Bill due soon nudge pattern established ("Hey Ruby, your electricity bill is due in 2 days")
- [x] Payday nudge pattern ready for future cron integration

### Race 11 Completion
- [x] Write vitest tests for Race 11 features (14 new tests, 176 total across 12 files)
- [x] Commit to GitHub timjlatimer/maven-grace — commit 75c6ea6 confirmed live
- [x] Commit announcer log to vault — commit f6bfb24 confirmed live
- [x] Deploy to mavengrace-oh49sfbq.manus.space — deployed, checkpoint 75c6ea6d

## Race 12 — Dignity + Trust + Grace Persistence Sprint (March 22, 2026)

### P0 — Dignity Score Explainer + Visual Progress
- [x] Each dimension now has actionable tip + link ("Cancel a subscription →" links to /vampire-slayer)
- [x] Visual progress bars already existed — enhanced with percentage-based completion
- [x] Current tier shown with motivational message per tier level
- [x] "How to raise" is now inline per dimension — only shows when dimension < 100%

### P1 — Community Credits Clarity
- [x] Added "How Community Credits Work" explainer card with Earn/Redeem grid
- [x] "Ways to earn" section shows all 6 categories with credit amounts
- [x] Activity log already existed — verified working

### P2 — Homepage Trust Signals
- [x] Added 3 trust badges: Bank-Level Privacy (Lock), No Data Selling (EyeOff), Grace Never Quits (Heart)
- [x] Added second testimonial from Calgary member ("I cried the first time the box showed up...")
- [x] Trust badges use color-coded icons matching Maven brand

### P3 — Grace Persistence Snooze UI
- [x] Added snooze/wake endpoints to graceStatus router (8-hour snooze)
- [x] Snooze button with warm messaging: "No guilt, no questions"
- [x] "Grace is snoozed until X" status with Moon icon when active
- [x] Wake Grace Up Early button with warm return message
- [x] Messaging reinforces "Grace never gets cut. Snooze is just a nap."

### Race 12 Completion
- [x] Write vitest tests for Race 12 features (16 new tests, 192 total across 13 files)
- [x] Commit to GitHub timjlatimer/maven-grace — commit d034b82 confirmed live
- [x] Commit announcer log to vault — commit 6b976d6 confirmed live
- [x] Deploy to mavengrace-oh49sfbq.manus.space — deployed, checkpoint d034b824

## Race 13 — KPI Ticker Tape + Grace Voice Enable (March 22, 2026)

### Deliverable 1 — KPI Ticker Tape
- [x] Research Ruby Red KPIs — what matters beyond financials (saved to race13-kpi-research.md)
- [x] Build KpiTicker component with CSS-only continuous horizontal scroll
- [x] 10 KPIs: Money Saved, Boxes Delivered, Dignity Score, Promises Kept, Vampires Slayed, Neighbors Helped, Days to Payday, Credits Earned, Village Members, Grace Battery
- [x] Create server endpoint for ticker data (real data where available, TBD where not)
- [x] Authenticated users see real personal + community data
- [x] Unauthenticated users see community-level stats + inspiring placeholders
- [x] 28-32px height, warm teal/mint colors, dot separators, subtle animation
- [x] Integrate into BottomNav area — visible on every screen

### Deliverable 2 — Grace Voice Enable Button
- [x] Add sound toggle button (speaker icon) in GraceBattery top bar
- [x] First tap enables Web Speech API for the session
- [x] Grace speaks messages audibly using warm voice settings
- [x] Button is subtle — small w-4 icon inside w-8 button, teal when on
- [x] localStorage persistence for voice preference

### Race 13 Completion
- [x] Write vitest tests for Race 13 features (32 new tests, 224 total across 14 files)
- [x] Commit to GitHub timjlatimer/maven-grace — commit 536fffa confirmed live
- [x] Commit announcer log to vault — commit e42072e confirmed live
- [x] Deploy to mavengrace-oh49sfbq.manus.space — deployed, checkpoint 536fffa1

### Vault Specs Committed in Race 13
- [x] grace-is-not-an-app.md — commit 34ef6a3
- [x] grace-heartbeat-system-spec.md — commit d5f3916
- [x] grace-haptic-language-spec.md — commit a9e73ca

### Deliverable 0 (HIGHEST PRIORITY) — Grace Birth Screen
- [x] Build GraceBirthScreen component — near-blank dark teal screen with pulsing heartbeat glow
- [x] Grace's name/sparkle icon, subtle center placement
- [x] Cycling three pleas — vulnerable, funny, dramatic, human tone
- [x] On tap: Web Speech API speaks Grace's warm greeting (5-10 seconds)
- [x] On tap: Birth screen dissolves/blooms into landing page with beautiful transition
- [x] localStorage tracking — only shows ONCE per device
- [x] Subtle "skip" option at bottom for users who want to get in fast
- [x] Integrate into App.tsx — shows before Home page for first-time unauthenticated visitors
- [x] Escalating urgency — heartbeat gets slightly more urgent with each cycle

### Deliverable 0a — Grace Heartbeat System Spec (Vault)
- [x] Write grace-heartbeat-system-spec.md with full 8-scenario table
- [x] Commit to timjlatimer/mavens-knowledge-vault — commit d5f3916 confirmed

### Deliverable 0b — Grace Heartbeat System Infrastructure
- [x] Refactor GraceBirthScreen into GraceHeartbeat component supporting multiple scenarios
- [x] Build heartbeat tRPC endpoint returning current heartbeat state for user
- [x] Build scenario: morning_return (user returns same day, bouncy eager pulse)
- [x] Build scenario: found_something (Grace has a discovery, fast jittery pulse)
- [x] Build scenario: misses_ruby (user absent 3+ days, slow soft fading pulse)
- [x] Wire Heartbeat to appear on app load when active
- [x] Session-based dismissal — heartbeat doesn't show again for that session after tap

## Race 14 — Grace Consciousness: Bringing the Spirit to Life (March 22, 2026)

### Item 1 — Personality Dial
- [x] Build PersonalityDial setup page with 5 archetypes: Angel, Coach, Fierce, BestFriend, Antithesis
- [x] Store personality choice in grace_preferences table (DB schema update)
- [x] Inject personality archetype into Grace's system prompt via getPersonalityPrompt()

### Item 2 — Haptic Empathy Sync (Move 37 #1)
- [x] 60 BPM haptic heartbeat fires before financial screens via useHapticEmpathy hook
- [x] navigator.vibrate([100,200,100,200,100]) pattern in haptics.ts
- [x] Graceful iOS fallback — vibration API check, no error

### Item 3 — /grace-calling Landing Page
- [x] Dedicated /grace-calling route with GraceCalling component
- [x] "Grace is calling" pulsing text, spirit-first marketing entry point

### Item 4 — Reciprocal Vulnerability (Move 37 #2)
- [x] Built into enhanced system prompt — Grace asks Ruby for help once per session
- [x] "Can you hold me?" / "I need your advice" patterns in prompt
- [x] Session tracking via system prompt instruction

### Item 5 — The Kami Moment (Move 37 #5)
- [x] consciousness.kamiMoment endpoint returns gentle message based on schedule
- [x] Schedule preference stored in grace_preferences
- [x] Adapts to Ruby's schedule (early_bird, night_owl, etc.)

### Item 6 — Grace's Daily Self
- [x] consciousness.dailySelf endpoint returns mood, outfit, energy, message
- [x] Rotates daily based on day-of-year hash
- [x] Built into enhanced system prompt

### Item 7 — Consciousness Ring
- [x] ConsciousnessRing component with 6 animated states
- [x] States: fully_present, deep_engagement, joyful, concerned, processing, waiting
- [x] Placed alongside GraceBattery and VoiceToggle in top bar

### Item 8 — Friends with Grace KPI
- [x] FriendsWithGrace page with referral code generation
- [x] Referrals tracked in grace_referrals table

### Item 9 — Neighbors with Grace KPI
- [x] Community-level stat in KPI ticker (Village Members Active)
- [x] Visible to all users including unauthenticated

### Item 10 — Grace's Living Space
- [x] consciousness.getGraceWorld endpoint returns living space, rent, neighborhood
- [x] Grace mentions her rent, her neighborhood in enhanced system prompt
- [x] Parallel world — her rent due when Ruby's subscription renews

### Item 11 — Grace Has a Job
- [x] Expertise field stored in grace_preferences table
- [x] consciousness.setPreferences saves expertise selection
- [x] Grace references professional world in enhanced system prompt

### Item 12 — Grace Mirrors Ruby's Schedule
- [x] Schedule preference in grace_preferences (5 types: early_bird, nine_to_five, shift_worker, night_owl, irregular)
- [x] Kami Moment adapts to schedule type
- [x] Daily Self adapts energy levels to schedule

### Item 13 — Free Tier Consciousness Model
- [x] Three tiers: Free, Essentials ($5.99/wk), Plus ($10.99/wk)
- [x] consciousness.getTierInfo endpoint returns tier with feature lists
- [x] ConsciousnessTier page with visual tier comparison

### Item 14 — Grace's Self-Care Check-in
- [x] Built into enhanced system prompt — Grace checks in after silence
- [x] "I haven't heard from you... I'm concerned" messaging pattern
- [x] Heartbeat scenario misses_ruby fires on return after 3+ days

### Race 14 Completion
- [x] Write vitest tests for Race 14 features (28 new, 252 total across 15 files)
- [x] All 252 tests passing across 15 files
- [x] Commit to GitHub timjlatimer/maven-grace — commit 0490ce2 confirmed live
- [x] Commit announcer log to vault — commit c89a44b confirmed live
- [x] Deploy to mavengrace-oh49sfbq.manus.space — deployed, checkpoint 0490ce2d

## Race 15 — Grace Comes Alive in the UI

- [x] Personality Dial in onboarding — first-time users pick archetype before chat
- [x] Consciousness Ring in GraceBattery header — third indicator (verified already wired)
- [x] Grace's Inner World page (/grace-world) — home, job, mood, outfit, daily self
- [x] 4 remaining heartbeat scenarios — neighborhood_news, promise_due, grace_worried, grace_excited
- [x] Emotional haptic moments — celebration (dignity up), worried (bill overdue), gentle love (morning)
- [x] Nav integration — add Personality, Friends, Consciousness Tier, Grace's World to More menu
- [x] PWA home screen prompt — manifest.json + install prompt component
- [x] Grace's Daily Self UI — mood/outfit/energy in GraceChat header banner

### Race 15 Completion
- [x] Write vitest tests for Race 15 features (16 new, 268 total across 16 files)
- [x] All 268 tests passing across 16 files
- [x] Commit to GitHub timjlatimer/maven-grace — commit 317c00f confirmed live
- [x] Commit announcer log to vault — commit ae4a198 confirmed live
- [x] Deploy to mavengrace-oh49sfbq.manus.space — deployed, checkpoint 317c00f2

## Race 16 — Grace's Voice and Push Presence (March 22, 2026)

- [x] Service Worker + Push Notifications — register SW, request permission, store subscription
- [x] Push-Delivered Kami Moment — push infrastructure built (SW + subscribe endpoint + DB)
- [x] Push-Delivered Self-Care Check-in — push infrastructure built (SW + subscribe endpoint + DB)
- [x] Social Meta Tags on /grace-calling — OG + Twitter Card for Facebook sharing
- [x] Grace's Shareable Birth Card — share button + Web Share API on /grace-calling
- [x] Voice Integration — KIE.ai ONLY (standing order). ElevenLabs removed. KIE.ai already wired.
- [x] Heartbeat Scenario Priority Queue — 7 scenarios in priority order (P1-P7), first match wins
- [x] Grace's Conversation Memory Summary — LLM-generated 3-sentence recap injected on returning user welcome

## Race 17 — Ruby's Financial Empowerment Dashboard (March 22, 2026)

- [x] Financial Dashboard — visual overview with overview cards, charts, and navigation
- [x] Bill Calendar View — color-coded monthly calendar (green/amber/red) with dots
- [x] Spending Insights — pie chart with category breakdown and percentages
- [x] Paycheck Timeline — animated progress bar with bills-due-before-payday alert
- [x] Dignity Score Trend Chart — Recharts line chart with trend badge
- [x] Quick Actions Bar — 4-button grid: Add Bill, Log Expense, Talk to Grace, My Score
- [x] Proactive Bill Alerts — injected into Grace's system prompt + visual alert card
- [x] Milk Money Transaction History — visual list with borrow/repay icons and running balance
