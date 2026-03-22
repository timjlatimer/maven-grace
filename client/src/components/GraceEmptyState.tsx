import { motion } from "framer-motion";
import { Heart, Sparkles, BookOpen, Shield, Map, Music, Star, Wallet, Calendar, Coins, Clock, Users, Compass, AlertTriangle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface GraceEmptyStateProps {
  page: string;
  action?: { label: string; path: string };
}

const EMPTY_STATES: Record<string, { icon: typeof Heart; message: string; submessage: string }> = {
  dashboard: {
    icon: BarChart3,
    message: "Your story hasn't started its numbers chapter yet.",
    submessage: "Once you begin tracking, I'll help you see how far you've come.",
  },
  "vampire-slayer": {
    icon: Shield,
    message: "No vampires found... yet.",
    submessage: "Add your subscriptions and I'll help you find the ones draining your wallet.",
  },
  journey: {
    icon: Map,
    message: "Every journey starts with a single step.",
    submessage: "You've already taken yours by being here. Let's see where this goes.",
  },
  song: {
    icon: Music,
    message: "Your anthem is waiting to be written.",
    submessage: "Tell me about your life, and I'll turn it into music.",
  },
  budget: {
    icon: Wallet,
    message: "We haven't started this chapter yet.",
    submessage: "Want to begin? I'll help you see where every dollar goes.",
  },
  bills: {
    icon: Calendar,
    message: "No bills tracked yet — and that's okay.",
    submessage: "Add your first bill and I'll make sure you never get surprised.",
  },
  "milk-money": {
    icon: Coins,
    message: "Your Milk Money account is fresh and ready.",
    submessage: "When you need a little help between paydays, I'm here.",
  },
  dignity: {
    icon: Star,
    message: "Your dignity score is about to begin.",
    submessage: "Every small win counts. Let's start measuring what matters.",
  },
  promises: {
    icon: Heart,
    message: "No promises yet — but the best ones are ahead.",
    submessage: "Make a promise to yourself or someone you love. I'll help you keep it.",
  },
  destiny: {
    icon: Compass,
    message: "Your destiny is still unfolding.",
    submessage: "Answer a few questions and I'll help you see the moonshot you barely let yourself dream about.",
  },
  stories: {
    icon: BookOpen,
    message: "Your story library is empty — but you're living the chapters.",
    submessage: "As we talk, Jolene will capture the moments that matter.",
  },
  village: {
    icon: Users,
    message: "Your village is waiting to be built.",
    submessage: "Meet the AI agents who'll support different parts of your life.",
  },
  credits: {
    icon: Coins,
    message: "No credits earned yet.",
    submessage: "Help your neighbors and earn credits that come back to you.",
  },
  crisis: {
    icon: AlertTriangle,
    message: "No active crisis — and I'm grateful for that.",
    submessage: "If things ever get tough, I'm here. No judgment. Just help.",
  },
  finances: {
    icon: BarChart3,
    message: "Your financial picture is about to come into focus.",
    submessage: "Add some bills and budget entries, and I'll paint the full picture.",
  },
  friends: {
    icon: Users,
    message: "You're Grace's first friend here.",
    submessage: "Share your referral code and help someone else find their Grace.",
  },
  default: {
    icon: Sparkles,
    message: "Nothing here yet — but something beautiful is coming.",
    submessage: "Grace is ready when you are.",
  },
};

export default function GraceEmptyState({ page, action }: GraceEmptyStateProps) {
  const [, navigate] = useLocation();
  const state = EMPTY_STATES[page] || EMPTY_STATES.default;
  const Icon = state.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mb-6"
      >
        <Icon className="w-8 h-8 text-teal-400" />
      </motion.div>

      <h3 className="text-lg font-semibold text-white mb-2">{state.message}</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6">{state.submessage}</p>

      {action && (
        <Button
          onClick={() => navigate(action.path)}
          className="bg-teal-500 hover:bg-teal-600 text-white"
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
