export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  kieAiApiKey: process.env.KIE_AI_API_KEY ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  // ─── MARIA API (Italy Trip MCP Server) ─────────────────────────────
  // Maria's REST API for Goosebump Choice song generation
  // POST /api/maria/v1/generate-goosebump with Bearer token auth
  mariaApiUrl: process.env.MARIA_API_URL ?? "https://italytrip-2wnk4uyh.manus.space",
  mariaAdminPassword: process.env.MARIA_ADMIN_PASSWORD ?? "",
};
