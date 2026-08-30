import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { AIAssistant } from "@/components/AIAssistant";

// Pages
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Providers from "@/pages/Providers";
import Appointments from "@/pages/Appointments";
import HealthRecords from "@/pages/HealthRecords";
import HealthPassport from "@/pages/HealthPassport";
import CommunityMap from "@/pages/CommunityMap";
import CareReminders from "@/pages/CareReminders";
import InsuranceHelp from "@/pages/InsuranceHelp";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/providers" component={Providers} />
          <Route path="/appointments" component={Appointments} />
          <Route path="/health-records" component={HealthRecords} />
          <Route path="/health-passport" component={HealthPassport} />
          <Route path="/community-map" component={CommunityMap} />
          <Route path="/care-reminders" component={CareReminders} />
          <Route path="/insurance" component={InsuranceHelp} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <AIAssistant />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
