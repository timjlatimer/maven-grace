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
- [ ] Stripe: Observer/Essentials/Plus tiers (placeholder if Stripe MCP unavailable)
- [ ] Stripe: membership status shown in app, Grace knows tier
- [ ] Voice Input: browser mic capture → Whisper transcription → Grace responds
- [ ] Voice Input: mic button in Grace Chat alongside send button
- [ ] Gift Anthem Dedication: shareable song link page (/song/share/:token)
- [ ] Gift Anthem Dedication: "Send to a friend" button on Song Moment
- [ ] Gift Anthem Dedication: recipient landing page with song + join CTA

### P1 — High Value
- [ ] Budget Builder: income/expense tracker, category breakdown
- [ ] Budget Builder: paycheck-to-paycheck planner with next payday countdown
- [ ] Bill Tracker: bills by due date, days-until-due alerts
- [ ] NSF Fee Fighter: risk alert when balance likely to go negative, dispute script
- [ ] Milk Money: graduated trust tiers ($20→$50→$100→$150)
- [ ] Milk Money: repayment tracking, tier progression

### P2 — Admin + Polish
- [ ] Admin Dashboard: member counts, financial lift totals, Grace health
- [ ] Admin Dashboard: protected by admin role
- [ ] Update gap analysis with Race 3 results
- [ ] All new features covered by vitest
- [ ] Deploy to live URL
