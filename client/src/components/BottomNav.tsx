import { useLocation, Link } from "wouter";
import { Home, MessageCircle, Shield, TrendingUp, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/grace", icon: MessageCircle, label: "Grace" },
  { path: "/dashboard", icon: TrendingUp, label: "My Lift" },
  { path: "/vampire-slayer", icon: Shield, label: "Vampires" },
  { path: "/journey", icon: Map, label: "Journey" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
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
      </div>
    </nav>
  );
}
