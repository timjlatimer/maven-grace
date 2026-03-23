import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Home, MessageCircle, Shield, TrendingUp, Map, Package, Wallet, Calendar, Milk, MoreHorizontal, X, Music, Star, Heart, Compass, BookOpen, Users, Battery, Coins, Clock, AlertTriangle, Rocket, Sparkles, Globe, Layers, BarChart3, Accessibility, Share2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const primaryNav = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/grace", icon: MessageCircle, label: "Grace" },
  { path: "/finances", icon: BarChart3, label: "Finances" },
  { path: "/vampire-slayer", icon: Shield, label: "Vampires" },
  { path: "/journey", icon: Map, label: "Journey" },
];

const moreNav = [
  { path: "/membership", icon: Package, label: "Membership" },
  { path: "/dashboard", icon: TrendingUp, label: "My Lift" },
  { path: "/budget", icon: Wallet, label: "Budget" },
  { path: "/bills", icon: Calendar, label: "Bills" },
  { path: "/milk-money", icon: Milk, label: "Milk Money" },
  { path: "/song", icon: Music, label: "My Song" },
  { path: "/dignity", icon: Star, label: "Dignity" },
  { path: "/promises", icon: Heart, label: "Promises" },
  { path: "/destiny", icon: Compass, label: "Destiny" },
  { path: "/stories", icon: BookOpen, label: "Stories" },
  { path: "/village", icon: Users, label: "Village" },
  { path: "/credits", icon: Coins, label: "Credits" },
  { path: "/payday", icon: Clock, label: "Payday" },
  { path: "/crisis", icon: AlertTriangle, label: "Crisis" },
  { path: "/moonshot", icon: Rocket, label: "Moonshot" },
  { path: "/grace-status", icon: Battery, label: "Juice" },
  { path: "/grace-world", icon: Globe, label: "Grace's World" },
  { path: "/personality", icon: Sparkles, label: "Personality" },
  { path: "/friends", icon: Users, label: "Friends" },
  { path: "/consciousness", icon: Layers, label: "Tiers" },
  { path: "/accessibility", icon: Accessibility, label: "Accessibility" },
  { path: "/community", icon: Share2, label: "Community" },
  { path: "/pulse", icon: Activity, label: "Pulse Zone" },
  { path: "/onboarding", icon: Sparkles, label: "Setup" },
];

export default function BottomNav() {
  const [location] = useLocation();
  const [showMore, setShowMore] = useState(false);

  const isMoreActive = moreNav.some(item => location === item.path);

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowMore(false)}>
          <div
            className="absolute bottom-14 left-0 right-0 bg-card border-t border-border rounded-t-2xl p-3 w-full max-w-sm mx-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground text-sm">More Features</span>
              <button onClick={() => setShowMore(false)} className="text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {moreNav.map((item) => {
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path} onClick={() => setShowMore(false)}>
                    <button className={cn(
                      "flex flex-col items-center justify-center gap-1 w-full py-2 rounded-xl transition-all",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}>
                      <item.icon className={cn("w-4 h-4", isActive && "stroke-[2.5]")} />
                      <span className="text-[9px] font-medium leading-tight">{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar — flex-1 tabs to fit any screen width */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border safe-area-pb">
        <div className="flex items-center h-14 w-full">
          {primaryNav.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path} className="flex-1">
                <button className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-full h-14 transition-all",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                  <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>{item.label}</span>
                </button>
              </Link>
            );
          })}
          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 h-14 transition-all",
              (showMore || isMoreActive)
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className={cn("w-5 h-5", (showMore || isMoreActive) && "stroke-[2.5]")} />
            <span className={cn("text-[10px] font-medium", (showMore || isMoreActive) && "font-semibold")}>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
