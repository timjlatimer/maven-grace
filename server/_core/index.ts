import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getStripe, handleWebhookEvent } from "../stripe";
import { ENV } from "./env";
import * as db from "../db";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ─── STRIPE WEBHOOK (must be BEFORE express.json) ──────────────────
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const stripe = getStripe();
    if (!stripe) return res.status(500).json({ error: "Stripe not configured" });

    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, ENV.stripeWebhookSecret);
    } catch (err: any) {
      console.error("[Stripe Webhook] Signature verification failed:", err.message);
      return res.status(400).json({ error: "Webhook signature verification failed" });
    }

    // Handle test events
    if (event.id.startsWith("evt_test_")) {
      console.log("[Webhook] Test event detected, returning verification response");
      return res.json({ verified: true });
    }

    try {
      const result = await handleWebhookEvent(event);
      console.log(`[Stripe Webhook] ${event.type} → ${result.action}`, result);

      // Update membership in database based on webhook action
      if (result.action === "membership_activated" && result.profileId) {
        await db.upsertMembership(result.profileId, {
          tier: (result.tier as any) || "essentials",
          status: "active",
          stripeCustomerId: result.stripeCustomerId,
          stripeSubscriptionId: result.stripeSubscriptionId,
          weeklyAmountCents: result.tier === "plus" ? 1099 : 599,
        });
      } else if (result.action === "subscription_cancelled" && result.profileId) {
        await db.upsertMembership(result.profileId, {
          status: "cancelled",
        });
      } else if (result.action === "subscription_paused" && result.profileId) {
        await db.upsertMembership(result.profileId, {
          status: "paused",
        });
      }

      res.json({ received: true, action: result.action });
    } catch (err) {
      console.error("[Stripe Webhook] Error processing event:", err);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
