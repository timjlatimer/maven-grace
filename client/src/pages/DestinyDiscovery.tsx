import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Compass, Star, Lock, Unlock, Sparkles, Send, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const WAVE_CONFIG = {
  safe: { label: "Safe Harbor", color: "text-blue-500", bg: "bg-blue-50", range: "1-10" },
  reflective: { label: "Reflective Waters", color: "text-purple-500", bg: "bg-purple-50", range: "11-20" },
  deep: { label: "Deep Dive", color: "text-amber-500", bg: "bg-amber-50", range: "21-30" },
};

export default function DestinyDiscovery() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<any>(null);

  const { data: progress, refetch: refetchProgress } = trpc.destiny.getProgress.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const { data: answers, refetch: refetchAnswers } = trpc.destiny.getAnswers.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const { data: synthesis } = trpc.destiny.getSynthesis.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const askMut = trpc.destiny.askQuestion.useMutation({
    onSuccess: (data) => {
      if (data.complete) {
        toast.success("All 30 questions answered! Your destiny synthesis is ready.");
      } else {
        setPendingQuestion(data.question);
      }
    },
  });

  const answerMut = trpc.destiny.answerQuestion.useMutation({
    onSuccess: () => {
      setCurrentAnswer("");
      setPendingQuestion(null);
      refetchProgress();
      refetchAnswers();
      toast.success("Answer saved. Grace is listening.");
    },
  });

  const revealMut = trpc.destiny.revealSynthesis.useMutation({
    onSuccess: () => {
      refetchProgress();
      toast.success("Your destiny has been revealed!");
    },
  });

  const progressPct = progress ? Math.round((progress.answered / progress.total) * 100) : 0;
  const waveInfo = WAVE_CONFIG[progress?.currentWave || "safe"];
  const answeredQuestions = answers?.filter((a: any) => a.answer) || [];

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-background pb-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Destiny Discovery</h1>
        <span className="text-xs text-muted-foreground ml-auto">North the Navigator</span>
      </div>

      <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Mark Twain Quote */}
        <Card className="bg-gradient-to-br from-primary/5 via-accent/10 to-lift/5 border-primary/20">
          <CardContent className="py-6 text-center">
            <Compass className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm text-foreground/80 italic leading-relaxed">
              "The two most important days in your life are the day you are born
              and the day you find out why."
            </p>
            <p className="text-xs text-muted-foreground mt-2">— Mark Twain</p>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-foreground">Your Journey</p>
                <p className="text-xs text-muted-foreground">
                  {progress?.answered || 0} of 30 questions explored
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${waveInfo.bg} ${waveInfo.color}`}>
                {waveInfo.label}
              </span>
            </div>
            <div className="h-3 bg-muted/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              <span>Safe (1-10)</span>
              <span>Reflective (11-20)</span>
              <span>Deep (21-30)</span>
            </div>
          </CardContent>
        </Card>

        {/* Current Question or Ask Next */}
        {pendingQuestion ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="py-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${WAVE_CONFIG[pendingQuestion.wave as keyof typeof WAVE_CONFIG]?.bg} ${WAVE_CONFIG[pendingQuestion.wave as keyof typeof WAVE_CONFIG]?.color}`}>
                    Q{pendingQuestion.number}
                  </span>
                  <span className="text-xs text-muted-foreground">{WAVE_CONFIG[pendingQuestion.wave as keyof typeof WAVE_CONFIG]?.label}</span>
                </div>
                <p className="text-base font-semibold text-foreground leading-relaxed">
                  {pendingQuestion.question}
                </p>
                <Textarea
                  placeholder="Take your time. There's no wrong answer..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => profileId && currentAnswer.trim() && answerMut.mutate({
                      profileId,
                      questionNumber: pendingQuestion.number,
                      answer: currentAnswer.trim(),
                    })}
                    disabled={!currentAnswer.trim() || answerMut.isPending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {answerMut.isPending ? "Saving..." : "Share My Answer"}
                  </Button>
                  <Button variant="outline" onClick={() => setPendingQuestion(null)}>Later</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Button
            className="w-full h-14 text-base"
            onClick={() => profileId && askMut.mutate({ profileId })}
            disabled={askMut.isPending || (progress?.answered || 0) >= 30}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {(progress?.answered || 0) >= 30 ? "All Questions Explored" : askMut.isPending ? "Grace is thinking..." : "Ask Me the Next Question"}
          </Button>
        )}

        {/* Synthesis (if available and revealed) */}
        {synthesis && synthesis.isRevealed && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-amber-300/50 bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardContent className="py-6 space-y-4">
                <div className="text-center">
                  <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-foreground">Your Destiny Synthesis</h3>
                  <p className="text-xs text-muted-foreground">Grace has been putting this together about you</p>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{synthesis.synthesisText}</p>
                {synthesis.moonshot && (
                  <div className="bg-white/60 rounded-xl p-4">
                    <p className="text-xs font-bold text-amber-600 mb-1">Your Moonshot</p>
                    <p className="text-sm text-foreground font-medium">{synthesis.moonshot}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Synthesis reveal button */}
        {synthesis && !synthesis.isRevealed && (progress?.answered || 0) >= 10 && (
          <Card className="border-primary/30">
            <CardContent className="py-5 text-center space-y-3">
              <Lock className="w-6 h-6 text-primary mx-auto" />
              <p className="text-sm text-foreground font-medium">
                Grace has been putting together something about you...
              </p>
              <Button onClick={() => profileId && revealMut.mutate({ profileId })} disabled={revealMut.isPending}>
                <Unlock className="w-4 h-4 mr-2" />
                Reveal My Destiny
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Previous Answers */}
        {answeredQuestions.length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center gap-2 text-sm font-bold text-foreground"
            >
              {showAnswers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Your Answers ({answeredQuestions.length})
            </button>
            <AnimatePresence>
              {showAnswers && answeredQuestions.map((a: any) => (
                <motion.div key={a.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <Card className="bg-card/50">
                    <CardContent className="py-3">
                      <p className="text-xs font-semibold text-primary mb-1">Q{a.questionNumber}: {a.question}</p>
                      <p className="text-sm text-foreground/80">{a.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
