import Stripe from "stripe";
import { ENV } from "./_core/env";

// ─── STRIPE CLIENT ────────────────────────────────────────────────────
let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!ENV.stripeSecretKey) return null;
  if (!_stripe) {
    _stripe = new Stripe(ENV.stripeSecretKey, { apiVersion: "2025-03-31.basil" as any });
  }
  return _stripe;
}

export function isStripeConfigured(): boolean {
  return !!ENV.stripeSecretKey;
}

// ─── MAVEN MEMBERSHIP PRODUCTS ─────────────────────────────────────────
// These are the Maven membership tiers. Prices are in cents.
export const MAVEN_PRODUCTS = {
  observer: {
    name: "Maven Observer",
    description: "Chat with Grace, Financial Dashboard, Vampire Slayer (limited), Journey Tracker",
    weeklyPriceCents: 0,
    features: ["Chat with Grace", "Financial Impact Dashboard", "Vampire Slayer (limited)", "90-Day Journey Tracker"],
  },
  essentials: {
    name: "Maven Essentials",
    description: "Everything in Observer + Maven Essentials Box, full tools, Milk Money, Grace voice companion",
    weeklyPriceCents: 599,
    features: [
      "Everything in Observer",
      "Maven Essentials Box every 2-3 weeks",
      "Toilet paper + household essentials delivered",
      "Full Vampire Slayer",
      "Budget Builder",
      "Bill Tracker + NSF Fee Fighter",
      "Milk Money emergency fund access",
      "Grace always-on voice companion",
    ],
  },
  plus: {
    name: "Maven Plus",
    description: "Everything in Essentials + Premium Box, Wisdom Giants, Debt Snowball, Dignity Score, Neighbor Economy",
    weeklyPriceCents: 1099,
    features: [
      "Everything in Essentials",
      "Premium Maven Box (bigger, better)",
      "Wisdom Giants coaching sessions",
      "Debt Snowball planner",
      "Dignity Score tracking",
      "Neighbor Economy barter network",
      "Priority Grace response",
      "Monthly financial health report",
    ],
  },
} as const;

export type MavenTier = keyof typeof MAVEN_PRODUCTS;

// ─── CREATE CHECKOUT SESSION ─────────────────────────────────────────
export async function createCheckoutSession(opts: {
  tier: MavenTier;
  profileId: number;
  userId?: number;
  email?: string;
  name?: string;
  origin: string;
}): Promise<{ url: string | null; sessionId: string } | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const product = MAVEN_PRODUCTS[opts.tier];
  if (!product || product.weeklyPriceCents === 0) return null; // Observer is free

  // Create a Checkout Session with recurring weekly billing
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    allow_promotion_codes: true,
    client_reference_id: opts.profileId.toString(),
    customer_email: opts.email || undefined,
    metadata: {
      profile_id: opts.profileId.toString(),
      user_id: opts.userId?.toString() || "",
      tier: opts.tier,
    },
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.weeklyPriceCents,
          recurring: { interval: "week" },
        },
        quantity: 1,
      },
    ],
    success_url: `${opts.origin}/membership?success=true&tier=${opts.tier}`,
    cancel_url: `${opts.origin}/membership?cancelled=true`,
  });

  return { url: session.url, sessionId: session.id };
}

// ─── WEBHOOK EVENT HANDLER ───────────────────────────────────────────
export async function handleWebhookEvent(event: Stripe.Event): Promise<{
  action: string;
  profileId?: number;
  tier?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const profileId = parseInt(session.metadata?.profile_id || session.client_reference_id || "0");
      const tier = session.metadata?.tier || "essentials";
      return {
        action: "membership_activated",
        profileId: profileId || undefined,
        tier,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
      };
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const profileId = parseInt(sub.metadata?.profile_id || "0");
      return {
        action: sub.status === "active" ? "subscription_updated" : "subscription_paused",
        profileId: profileId || undefined,
        stripeSubscriptionId: sub.id,
      };
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const profileId = parseInt(sub.metadata?.profile_id || "0");
      return {
        action: "subscription_cancelled",
        profileId: profileId || undefined,
        stripeSubscriptionId: sub.id,
      };
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const profileId = parseInt(invoice.metadata?.profile_id || "0");
      return {
        action: "payment_failed",
        profileId: profileId || undefined,
      };
    }

    default:
      return { action: "unhandled" };
  }
}
