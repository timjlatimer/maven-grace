import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Home, MessageCircle, Shield, TrendingUp, Map, Package, Wallet, Calendar, Milk, MoreHorizontal, X, Music } from "lucide-react";
import { cn } from "@/lib/utils";

const primaryNav = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/grace", icon: MessageCircle, label: "Grace" },
  { path: "/dashboard", icon: TrendingUp, label: "My Lift" },
  { path: "/vampire-slayer", icon: Shield, label: "Vampires" },
  { path: "/journey", icon: Map, label: "Journey" },
];

const moreNav = [
  { path: "/membership", icon: Package, label: "Membership" },
  { path: "/budget", icon: Wallet, label: "Budget" },
  { path: "/bills", icon: Calendar, label: "Bills" },
  { path: "/milk-money", icon: Milk, label: "Milk Money" },
  { path: "/song", icon: Music, label: "My Song" },
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
            className="absolute bottom-16 left-0 right-0 bg-card border-t border-border rounded-t-2xl p-4 max-w-lg mx-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground text-sm">More Features</span>
              <button onClick={() => setShowMore(false)} className="text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {moreNav.map((item) => {
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path} onClick={() => setShowMore(false)}>
                    <button className={cn(
                      "flex flex-col items-center justify-center gap-1 w-full py-3 rounded-xl transition-all",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}>
                      <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border safe-area-pb">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {primaryNav.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <button className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-xl transition-all",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-xl transition-all",
              (showMore || isMoreActive)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MoreHorizontal className={cn("w-5 h-5", (showMore || isMoreActive) && "stroke-[2.5]")} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
