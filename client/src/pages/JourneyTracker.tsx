import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, CheckCircle2, Circle, Sparkles, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function JourneyTracker() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();

  const { data: milestones } = trpc.journey.getMilestones.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const completedCount = milestones?.filter(m => m.completed).length || 0;
  const totalCount = milestones?.length || 10;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Find current milestone (first incomplete)
  const currentMilestone = milestones?.find(m => !m.completed);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <MapPin className="w-5 h-5 text-grace" />
        <h1 className="text-lg font-bold text-foreground">Your 90-Day Journey</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Progress Hero */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="bg-gradient-to-br from-grace/10 via-accent/20 to-lift/10 border-grace/30">
            <CardContent className="text-center py-6">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6"
                    className="text-grace"
                    strokeDasharray={`${progressPercent * 2.64} 264`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-foreground">{progressPercent}%</span>
                  <span className="text-[10px] text-muted-foreground">complete</span>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">
                {completedCount} of {totalCount} milestones reached
              </p>
              {currentMilestone && (
                <p className="text-xs text-muted-foreground mt-1">
                  Next up: <span className="text-grace font-medium">{currentMilestone.milestoneName}</span>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Milestone Timeline */}
        {milestones && milestones.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-0">
              {milestones.map((milestone, i) => {
                const isCurrent = !milestone.completed && (i === 0 || milestones[i - 1]?.completed);
                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative flex items-start gap-4 py-3"
                  >
                    {/* Timeline dot */}
                    <div className={cn(
                      "relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      milestone.completed
                        ? "bg-grace text-grace-foreground"
                        : isCurrent
                          ? "bg-primary/20 text-primary border-2 border-primary"
                          : "bg-muted text-muted-foreground"
                    )}>
                      {milestone.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : milestone.day === 90 ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={cn(
                      "flex-1 pb-2",
                      !milestone.completed && !isCurrent && "opacity-50"
                    )}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">Day {milestone.day}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            YOU ARE HERE
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-foreground mt-0.5">
                        {milestone.milestoneName}
                      </p>
                      {milestone.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {milestone.description}
                        </p>
                      )}
                      {milestone.completed && milestone.completedAt && (
                        <p className="text-xs text-grace mt-1">
                          Completed {new Date(milestone.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <MapPin className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Your journey starts when you meet Grace. She'll set up your 90-day path to financial dignity.
              </p>
              <button onClick={() => navigate("/grace")} className="text-sm font-medium text-grace hover:underline">
                Talk to Grace →
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
