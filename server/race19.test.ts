import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Race 19 — Grace's Social Fabric & UX Polish", () => {
  // ─── 1. Grace's Typing Personality ──────────────────────────────
  describe("Grace's Typing Personality", () => {
    it("GraceTypingIndicator component exists", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/GraceTypingIndicator.tsx"),
        "utf-8"
      );
      expect(file).toContain("isTyping");
      expect(file).toContain("personality");
    });

    it("supports all 5 archetypes", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/GraceTypingIndicator.tsx"),
        "utf-8"
      );
      expect(file).toContain("angel");
      expect(file).toContain("coach");
      expect(file).toContain("fierce");
      expect(file).toContain("bestfriend");
      expect(file).toContain("antithesis");
    });

    it("is wired into GraceChat", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/GraceChat.tsx"),
        "utf-8"
      );
      expect(file).toContain("GraceTypingIndicator");
    });
  });

  // ─── 2. Empty State Poetry ──────────────────────────────────────
  describe("Empty State Poetry", () => {
    it("GraceEmptyState component exists with multiple page states", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/GraceEmptyState.tsx"),
        "utf-8"
      );
      expect(file).toContain("EMPTY_STATES");
      expect(file).toContain("dashboard");
      expect(file).toContain("budget");
      expect(file).toContain("bills");
      expect(file).toContain("dignity");
      expect(file).toContain("promises");
      expect(file).toContain("stories");
      expect(file).toContain("finances");
      expect(file).toContain("friends");
    });

    it("has at least 12 unique empty states", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/GraceEmptyState.tsx"),
        "utf-8"
      );
      const stateCount = (file.match(/icon:/g) || []).length;
      expect(stateCount).toBeGreaterThanOrEqual(12);
    });
  });

  // ─── 3. Stripe Success/Cancel Polish ────────────────────────────
  describe("Stripe Success/Cancel Polish", () => {
    it("StripeSuccess page exists with celebration", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/StripeSuccess.tsx"),
        "utf-8"
      );
      expect(file).toContain("Welcome to the Family");
      expect(file).toContain("Grace says");
      expect(file).toContain("vibrate");
    });

    it("StripeCancel page exists with warm reassurance", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/StripeCancel.tsx"),
        "utf-8"
      );
      expect(file).toContain("No Pressure");
      expect(file).toContain("Grace says");
      expect(file).toContain("free version");
    });

    it("routes are wired in App.tsx", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/App.tsx"),
        "utf-8"
      );
      expect(file).toContain("/membership/success");
      expect(file).toContain("/membership/cancel");
      expect(file).toContain("StripeSuccess");
      expect(file).toContain("StripeCancel");
    });
  });

  // ─── 4. Admin Analytics Deep Dive ───────────────────────────────
  describe("Admin Analytics Deep Dive", () => {
    it("AdminAnalytics page exists with conversion funnel", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/AdminAnalytics.tsx"),
        "utf-8"
      );
      expect(file).toContain("Conversion Funnel");
      expect(file).toContain("Membership Tiers");
      expect(file).toContain("Spirit Check");
    });

    it("route is wired in App.tsx", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/App.tsx"),
        "utf-8"
      );
      expect(file).toContain("/admin/analytics");
      expect(file).toContain("AdminAnalytics");
    });
  });

  // ─── 5. Community Mesh Map ──────────────────────────────────────
  describe("Community Mesh Map", () => {
    it("CommunityMesh page exists with visualization", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/CommunityMesh.tsx"),
        "utf-8"
      );
      expect(file).toContain("Your Grace Village");
      expect(file).toContain("Village Mesh");
      expect(file).toContain("Friends with Grace");
      expect(file).toContain("Neighbors");
    });

    it("route is wired in App.tsx", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/App.tsx"),
        "utf-8"
      );
      expect(file).toContain("/community");
      expect(file).toContain("CommunityMesh");
    });
  });

  // ─── 6. Grace's Story Arc Engine ────────────────────────────────
  describe("Grace's Story Arc Engine", () => {
    it("story-arc.ts exists with arc definitions", () => {
      const file = fs.readFileSync(
        path.resolve("server/story-arc.ts"),
        "utf-8"
      );
      expect(file).toContain("STORY_ARCS");
      expect(file).toContain("rubyTrigger");
      expect(file).toContain("graceEvent");
      expect(file).toContain("graceDialogue");
    });

    it("has at least 8 story arcs", () => {
      const file = fs.readFileSync(
        path.resolve("server/story-arc.ts"),
        "utf-8"
      );
      const arcCount = (file.match(/rubyTrigger:/g) || []).length;
      expect(arcCount).toBeGreaterThanOrEqual(8);
    });

    it("is injected into Grace system prompt", () => {
      const file = fs.readFileSync(
        path.resolve("server/routers.ts"),
        "utf-8"
      );
      expect(file).toContain("storyArcContext");
      expect(file).toContain("buildStoryArcContext");
    });
  });

  // ─── 7. Performance: Code Splitting ─────────────────────────────
  describe("Performance: Code Splitting", () => {
    it("App.tsx uses React.lazy for route pages", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/App.tsx"),
        "utf-8"
      );
      expect(file).toContain("lazy(() => import");
      expect(file).toContain("Suspense");
    });

    it("has at least 30 lazy-loaded pages", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/App.tsx"),
        "utf-8"
      );
      const lazyCount = (file.match(/lazy\(\(\) => import/g) || []).length;
      expect(lazyCount).toBeGreaterThanOrEqual(30);
    });

    it("PageLoadingSkeleton component exists", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/components/PageLoadingSkeleton.tsx"),
        "utf-8"
      );
      expect(file).toContain("Grace is getting ready");
    });

    it("Home and GraceChat are eagerly loaded (critical path)", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/App.tsx"),
        "utf-8"
      );
      expect(file).toContain('import Home from "./pages/Home"');
      expect(file).toContain('import GraceChat from "./pages/GraceChat"');
    });
  });

  // ─── 8. Spirit Check: North Star Alignment ──────────────────────
  describe("Spirit Check: North Star Alignment", () => {
    it("admin analytics includes spirit check metrics", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/AdminAnalytics.tsx"),
        "utf-8"
      );
      expect(file).toContain("Empathy Score");
      expect(file).toContain("Consciousness Tiers");
      expect(file).toContain("Cultural Intelligence");
      expect(file).toContain("Heartbeat Scenarios");
    });

    it("spirit check references Ruby Red mission", () => {
      const file = fs.readFileSync(
        path.resolve("client/src/pages/AdminAnalytics.tsx"),
        "utf-8"
      );
      expect(file).toContain("expensive to be poor");
    });
  });

  // ─── STANDING ORDER: KIE.ai only ───────────────────────────────
  describe("Standing Order: KIE.ai ONLY", () => {
    it("no ElevenLabs integration in server code", () => {
      const routersFile = fs.readFileSync(
        path.resolve("server/routers.ts"),
        "utf-8"
      );
      // Should not have elevenlabs import or function call (allow comments)
      const lines = routersFile.split("\n");
      const codeLines = lines.filter(l => !l.trim().startsWith("//") && !l.trim().startsWith("*"));
      const hasElevenlabs = codeLines.some(l => l.toLowerCase().includes("elevenlabs"));
      expect(hasElevenlabs).toBe(false);
    });

    it("no elevenlabs-voice.ts file exists", () => {
      const exists = fs.existsSync(path.resolve("server/elevenlabs-voice.ts"));
      expect(exists).toBe(false);
    });
  });
});
