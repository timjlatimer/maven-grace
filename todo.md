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
- [ ] Deploy to mavengrace-oh49sfbq.manus.space — IN PROGRESS
