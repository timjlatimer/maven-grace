/**
 * voice.test.ts
 *
 * Tests for the KIE.AI voice integration.
 * Mocks the kieai module so no real HTTP calls are made.
 */

import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ── Mocks ──────────────────────────────────────────────────────────────────

// Mock must be declared before any imports that use the module
vi.mock("./kieai", () => ({
  textToSpeech: vi.fn().mockResolvedValue(
    "https://cdn.kie.ai/audio/test-grace-voice.mp3"
  ),
  isKieAiConfigured: vi.fn().mockReturnValue(true),
}));

// Import after mock declaration so we get the mocked version
import * as kieai from "./kieai";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("voice.status", () => {
  it("returns provider info and configured=true when key is present", async () => {
    vi.mocked(kieai.isKieAiConfigured).mockReturnValue(true);
    const caller = appRouter.createCaller(makeCtx());
    const status = await caller.voice.status();

    expect(status.configured).toBe(true);
    expect(status.provider).toBe("KIE.AI");
    expect(status.model).toBe("elevenlabs/text-to-speech-multilingual-v2");
    expect(status.voice).toContain("Maria");
  });
});

describe("voice.speak", () => {
  it("returns an audioUrl for valid text input (chat source)", async () => {
    vi.mocked(kieai.isKieAiConfigured).mockReturnValue(true);
    vi.mocked(kieai.textToSpeech).mockResolvedValue(
      "https://cdn.kie.ai/audio/test-grace-voice.mp3"
    );

    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.voice.speak({
      text: "Hey there, neighbor! I'm Grace.",
      source: "chat",
    });

    expect(result.audioUrl).toBe("https://cdn.kie.ai/audio/test-grace-voice.mp3");
    expect(kieai.textToSpeech).toHaveBeenCalledWith("Hey there, neighbor! I'm Grace.");
  });

  it("returns an audioUrl for song source", async () => {
    vi.mocked(kieai.isKieAiConfigured).mockReturnValue(true);
    vi.mocked(kieai.textToSpeech).mockResolvedValue(
      "https://cdn.kie.ai/audio/anthem.mp3"
    );

    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.voice.speak({
      text: "Here is your anthem. It's called: Your Song.",
      source: "song",
    });

    expect(result.audioUrl).toBeDefined();
    expect(typeof result.audioUrl).toBe("string");
  });

  it("throws when KIE.AI is not configured", async () => {
    vi.mocked(kieai.isKieAiConfigured).mockReturnValue(false);

    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.voice.speak({ text: "Hello", source: "chat" })
    ).rejects.toThrow("KIE.AI voice is not configured");
  });

  it("rejects text that exceeds 4500 characters (Zod validation)", async () => {
    vi.mocked(kieai.isKieAiConfigured).mockReturnValue(true);

    const caller = appRouter.createCaller(makeCtx());
    const longText = "a".repeat(4501);
    await expect(
      caller.voice.speak({ text: longText, source: "chat" })
    ).rejects.toThrow();
  });

  it("rejects empty text (Zod validation)", async () => {
    vi.mocked(kieai.isKieAiConfigured).mockReturnValue(true);

    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.voice.speak({ text: "", source: "chat" })
    ).rejects.toThrow();
  });
});

describe("isKieAiConfigured (unit)", () => {
  it("mock returns a boolean", () => {
    const result = kieai.isKieAiConfigured();
    expect(typeof result).toBe("boolean");
  });
});
