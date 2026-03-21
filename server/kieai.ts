/**
 * KIE.AI Voice Service
 *
 * Grace's voice is powered by KIE.AI using the ElevenLabs multilingual v2 model.
 * Voice ID: hpp4J3VqNfWAUOO0d1Us (Maria — warm, empathetic, human)
 *
 * Workflow:
 * 1. POST to createTask with model + text + voice payload
 * 2. Poll getTaskDetails/{taskId} until status === "completed"
 * 3. Return the output audio URL to the frontend
 *
 * The API key NEVER leaves the server.
 */

import { ENV } from "./_core/env";

const KIE_AI_BASE = "https://api.kie.ai/api/v1/jobs";
const KIE_AI_MODEL = "elevenlabs/text-to-speech-multilingual-v2";
const GRACE_VOICE_ID = "hpp4J3VqNfWAUOO0d1Us";

// Maximum polling attempts (30 × 2s = 60 seconds max wait)
const MAX_POLL_ATTEMPTS = 30;
const POLL_INTERVAL_MS = 2000;

interface KieAiCreateTaskResponse {
  code: number;
  msg: string;
  data?: {
    taskId: string;
  };
}

interface KieAiTaskDetails {
  code: number;
  msg: string;
  data?: {
    taskId: string;
    status: "pending" | "processing" | "completed" | "failed";
    output?: {
      audioUrl?: string;
      audio_url?: string;
      url?: string;
    };
    error?: string;
  };
}

/**
 * Create a TTS task on KIE.AI and return the taskId
 */
async function createTtsTask(text: string): Promise<string> {
  const apiKey = ENV.kieAiApiKey;
  if (!apiKey) throw new Error("KIE_AI_API_KEY is not configured");

  const response = await fetch(`${KIE_AI_BASE}/createTask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: KIE_AI_MODEL,
      taskType: "tts",
      input: {
        text,
        voice_id: GRACE_VOICE_ID,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.85,
          style: 0.3,
          use_speaker_boost: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`KIE.AI createTask failed: ${response.status} — ${body}`);
  }

  const data: KieAiCreateTaskResponse = await response.json();

  if (!data.data?.taskId) {
    throw new Error(`KIE.AI createTask returned no taskId: ${JSON.stringify(data)}`);
  }

  return data.data.taskId;
}

/**
 * Poll KIE.AI until the task is completed, then return the audio URL
 */
async function pollForAudioUrl(taskId: string): Promise<string> {
  const apiKey = ENV.kieAiApiKey;
  if (!apiKey) throw new Error("KIE_AI_API_KEY is not configured");

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const response = await fetch(`${KIE_AI_BASE}/getTaskDetails/${taskId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`KIE.AI getTaskDetails failed: ${response.status} — ${body}`);
    }

    const data: KieAiTaskDetails = await response.json();
    const task = data.data;

    if (!task) continue;

    if (task.status === "failed") {
      throw new Error(`KIE.AI task failed: ${task.error || "unknown error"}`);
    }

    if (task.status === "completed") {
      // KIE.AI may return the URL under different keys
      const audioUrl =
        task.output?.audioUrl ||
        task.output?.audio_url ||
        task.output?.url;

      if (!audioUrl) {
        throw new Error(`KIE.AI task completed but no audio URL found: ${JSON.stringify(task)}`);
      }

      return audioUrl;
    }

    // Still pending/processing — keep polling
  }

  throw new Error(`KIE.AI task timed out after ${MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS / 1000}s`);
}

/**
 * Main entry point: convert text to speech and return a playable audio URL.
 * Handles the full createTask → poll → return URL workflow.
 */
export async function textToSpeech(text: string): Promise<string> {
  // Truncate very long texts to avoid API limits (ElevenLabs multilingual v2 max ~5000 chars)
  const truncated = text.length > 4500 ? text.slice(0, 4500) + "..." : text;

  const taskId = await createTtsTask(truncated);
  const audioUrl = await pollForAudioUrl(taskId);
  return audioUrl;
}

/**
 * Lightweight credential check — verifies the API key is set.
 * Used in tests to confirm the secret is available without making a real API call.
 */
export function isKieAiConfigured(): boolean {
  return Boolean(ENV.kieAiApiKey && ENV.kieAiApiKey.length > 10);
}
