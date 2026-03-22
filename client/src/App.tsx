import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { useState, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import GraceBirthScreen, { hasBirthBeenSeen } from "./components/GraceBirthScreen";
import GraceHeartbeat, { getSessionDismissedScenario } from "./components/GraceHeartbeat";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import Home from "./pages/Home";
import GraceChat from "./pages/GraceChat";
import Dashboard from "./pages/Dashboard";
import VampireSlayer from "./pages/VampireSlayer";
import JourneyTracker from "./pages/JourneyTracker";
import SongMoment from "./pages/SongMoment";
import Membership from "./pages/Membership";
import BudgetBuilder from "./pages/BudgetBuilder";
import BillTracker from "./pages/BillTracker";
import MilkMoney from "./pages/MilkMoney";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFulfillment from "./pages/AdminFulfillment";
import AnthemLanding from "./pages/AnthemLanding";
import DignityScore from "./pages/DignityScore";
import PromisesKeep from "./pages/PromisesKeep";
import DestinyDiscovery from "./pages/DestinyDiscovery";
import StoryLibrary from "./pages/StoryLibrary";
import VillageDirectory from "./pages/VillageDirectory";
import NotFound from "./pages/NotFound";
import GraceBattery from "./components/GraceBattery";
import KpiTicker from "./components/KpiTicker";
import CommunityCredits from "./pages/CommunityCredits";
import PaydaySetup from "./pages/PaydaySetup";
import CrisisBeacon from "./pages/CrisisBeacon";
import GraceStatusPage from "./pages/GraceStatusPage";
import EssentialsBox from "./pages/EssentialsBox";
import MoonshotReveal from "./pages/MoonshotReveal";
import PersonalityDial from "./pages/PersonalityDial";
import ConsciousnessTier from "./pages/ConsciousnessTier";
import FriendsWithGrace from "./pages/FriendsWithGrace";
import GraceCalling from "./pages/GraceCalling";

function Router() {
  return (
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
      <Route path="/anthem/:token">{(params) => <AnthemLanding token={params.token} />}</Route>
      <Route path="/membership/success">{() => <Membership />}</Route>
      <Route path="/membership/cancel">{() => <Membership />}</Route>
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
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
          </HeartbeatOrchestrator>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
