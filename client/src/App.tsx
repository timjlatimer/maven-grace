import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GraceChat from "./pages/GraceChat";
import Dashboard from "./pages/Dashboard";
import VampireSlayer from "./pages/VampireSlayer";
import JourneyTracker from "./pages/JourneyTracker";
import SongMoment from "./pages/SongMoment";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/grace" component={GraceChat} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/vampire-slayer" component={VampireSlayer} />
      <Route path="/journey" component={JourneyTracker} />
      <Route path="/song" component={SongMoment} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
