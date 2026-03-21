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
import Membership from "./pages/Membership";
import BudgetBuilder from "./pages/BudgetBuilder";
import BillTracker from "./pages/BillTracker";
import MilkMoney from "./pages/MilkMoney";
import AdminDashboard from "./pages/AdminDashboard";
import AnthemLanding from "./pages/AnthemLanding";
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
      <Route path="/membership" component={Membership} />
      <Route path="/budget" component={BudgetBuilder} />
      <Route path="/bills" component={BillTracker} />
      <Route path="/milk-money" component={MilkMoney} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/anthem/:token">{(params) => <AnthemLanding token={params.token} />}</Route>
      <Route path="/membership/success">{() => <Membership />}</Route>
      <Route path="/membership/cancel">{() => <Membership />}</Route>
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
