import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { useState, useEffect, lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import GraceBirthScreen, { hasBirthBeenSeen } from "./components/GraceBirthScreen";
import GraceHeartbeat, { getSessionDismissedScenario } from "./components/GraceHeartbeat";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
// Critical path — eagerly loaded
import Home from "./pages/Home";
import GraceChat from "./pages/GraceChat";
import GraceBattery from "./components/GraceBattery";
import KpiTicker from "./components/KpiTicker";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import PageLoadingSkeleton from "./components/PageLoadingSkeleton";

// Lazy-loaded pages — code splitting for performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VampireSlayer = lazy(() => import("./pages/VampireSlayer"));
const JourneyTracker = lazy(() => import("./pages/JourneyTracker"));
const SongMoment = lazy(() => import("./pages/SongMoment"));
const Membership = lazy(() => import("./pages/Membership"));
const BudgetBuilder = lazy(() => import("./pages/BudgetBuilder"));
const BillTracker = lazy(() => import("./pages/BillTracker"));
const MilkMoney = lazy(() => import("./pages/MilkMoney"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminFulfillment = lazy(() => import("./pages/AdminFulfillment"));
const AnthemLanding = lazy(() => import("./pages/AnthemLanding"));
const DignityScore = lazy(() => import("./pages/DignityScore"));
const PromisesKeep = lazy(() => import("./pages/PromisesKeep"));
const DestinyDiscovery = lazy(() => import("./pages/DestinyDiscovery"));
const StoryLibrary = lazy(() => import("./pages/StoryLibrary"));
const VillageDirectory = lazy(() => import("./pages/VillageDirectory"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CommunityCredits = lazy(() => import("./pages/CommunityCredits"));
const PaydaySetup = lazy(() => import("./pages/PaydaySetup"));
const CrisisBeacon = lazy(() => import("./pages/CrisisBeacon"));
const GraceStatusPage = lazy(() => import("./pages/GraceStatusPage"));
const EssentialsBox = lazy(() => import("./pages/EssentialsBox"));
const MoonshotReveal = lazy(() => import("./pages/MoonshotReveal"));
const PersonalityDial = lazy(() => import("./pages/PersonalityDial"));
const ConsciousnessTier = lazy(() => import("./pages/ConsciousnessTier"));
const FriendsWithGrace = lazy(() => import("./pages/FriendsWithGrace"));
const GraceCalling = lazy(() => import("./pages/GraceCalling"));
const GraceWorld = lazy(() => import("./pages/GraceWorld"));
const FinancialDashboard = lazy(() => import("./pages/FinancialDashboard"));
const AccessibilitySettings = lazy(() => import("./pages/AccessibilitySettings"));
const StripeSuccess = lazy(() => import("./pages/StripeSuccess"));
const StripeCancel = lazy(() => import("./pages/StripeCancel"));
const CommunityMesh = lazy(() => import("./pages/CommunityMesh"));
const OnboardingFlow = lazy(() => import("./pages/OnboardingFlow"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));

function Router() {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/grace" component={GraceChat} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/vampire-slayer" component={VampireSlayer} />
      <Route path="/journey" component={JourneyTracker} />
      <Route path="/song" component={SongMoment} />
      <Route path="/membership" component={Membership} />
      <Route path="/budget" component={BudgetBuilder} />
      <Route path="/bills" component={BillTracker} />
      <Route path="/milk-money" component={MilkMoney} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/fulfillment" component={AdminFulfillment} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/anthem/:token">{(params) => <AnthemLanding token={params.token} />}</Route>
      <Route path="/membership/success" component={StripeSuccess} />
      <Route path="/membership/cancel" component={StripeCancel} />
      <Route path="/community" component={CommunityMesh} />
      <Route path="/onboarding">{() => <OnboardingFlow profileId={0} onComplete={() => window.location.href = '/grace'} />}</Route>
      <Route path="/dignity" component={DignityScore} />
      <Route path="/promises" component={PromisesKeep} />
      <Route path="/destiny" component={DestinyDiscovery} />
      <Route path="/stories" component={StoryLibrary} />
      <Route path="/village" component={VillageDirectory} />
      <Route path="/credits" component={CommunityCredits} />
      <Route path="/payday" component={PaydaySetup} />
      <Route path="/crisis" component={CrisisBeacon} />
      <Route path="/grace-status" component={GraceStatusPage} />
      <Route path="/moonshot" component={MoonshotReveal} />
      <Route path="/essentials-box" component={EssentialsBox} />
      <Route path="/personality" component={PersonalityDial} />
      <Route path="/consciousness" component={ConsciousnessTier} />
      <Route path="/friends" component={FriendsWithGrace} />
      <Route path="/grace-calling" component={GraceCalling} />
      <Route path="/grace-world" component={GraceWorld} />
      <Route path="/finances" component={FinancialDashboard} />
      <Route path="/accessibility" component={AccessibilitySettings} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

/**
 * HeartbeatOrchestrator — decides which heartbeat (if any) to show.
 * Priority: birth screen (first ever) > server-driven heartbeat scenarios
 */
function HeartbeatOrchestrator({ children }: { children: React.ReactNode }) {
  const { profileId } = useGraceSession();

  // Birth screen state — only shows once per device
  const [birthComplete, setBirthComplete] = useState(() => hasBirthBeenSeen());

  // Server heartbeat state — for returning users
  const [heartbeatComplete, setHeartbeatComplete] = useState(() => {
    // Already dismissed this session?
    return getSessionDismissedScenario() !== null;
  });

  // Track last visit timestamp in localStorage
  const [lastVisitTimestamp] = useState(() => {
    try {
      const stored = localStorage.getItem("maven-grace-last-visit");
      const ts = stored ? parseInt(stored, 10) : null;
      // Update last visit to now
      localStorage.setItem("maven-grace-last-visit", Date.now().toString());
      return ts;
    } catch {
      return null;
    }
  });

  // Fetch server heartbeat (only for returning users with a profile)
  const heartbeatQuery = trpc.heartbeat.getCurrent.useQuery(
    {
      profileId: profileId ?? undefined,
      lastVisitTimestamp: lastVisitTimestamp ?? undefined,
    },
    {
      enabled: birthComplete && !heartbeatComplete && !!profileId,
      staleTime: Infinity, // Only fetch once per session
    }
  );

  const heartbeatData = heartbeatQuery.data;
  const showServerHeartbeat =
    birthComplete &&
    !heartbeatComplete &&
    !!heartbeatData?.scenario &&
    heartbeatData.lines.length > 0;

  return (
    <>
      {/* Birth screen — first ever visit */}
      {!birthComplete && (
        <GraceBirthScreen onComplete={() => setBirthComplete(true)} />
      )}

      {/* Server-driven heartbeat scenarios */}
      {showServerHeartbeat && heartbeatData && (
        <GraceHeartbeat
          scenario={heartbeatData.scenario!}
          lines={heartbeatData.lines as { main: string; sub: string }[]}
          color={heartbeatData.color}
          animStyle={heartbeatData.animStyle as any}
          greeting={heartbeatData.greeting}
          onComplete={() => setHeartbeatComplete(true)}
        />
      )}

      {children}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <HeartbeatOrchestrator>
            <GraceBattery />
            <KpiTicker />
            <div style={{ paddingTop: "32px", paddingBottom: "56px" }}>
              <Router />
            </div>
            <PWAInstallPrompt />
          </HeartbeatOrchestrator>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
