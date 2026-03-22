import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Star, Compass, Heart, Rocket } from "lucide-react";

export default function MoonshotReveal() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { data: synthesis } = trpc.destinyMoonshot.get.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const { data: progress } = trpc.destiny.getProgress.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const generateMut = trpc.destinyMoonshot.generateReveal.useMutation({
    onSuccess: () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    },
  });

  const answeredCount = progress?.answered || 0;
  const totalQuestions = 30;
  const readyForReveal = answeredCount >= 15;
  const hasSynthesis = !!synthesis;

  useEffect(() => {
    if (hasSynthesis) setRevealed(true);
  }, [hasSynthesis]);

  const parsedSynthesis = synthesis ? {
    coreValues: synthesis.coreValues,
    strengths: synthesis.strengths,
    moonshot: synthesis.moonshotStatement,
    purpose: synthesis.destinyAnthem,
  } : null;

  // Pre-reveal: Grace's buildup
  if (!revealed && !hasSynthesis) {
    return (
      <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-indigo-50 via-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container max-w-lg py-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Compass className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold">Your Moonshot</h1>
            <p className="text-sm text-muted-foreground mt-2 italic">
              "The two most important days in your life are the day you are born 
              and the day you find out why." — Mark Twain
            </p>
          </div>

          <Card className="mb-6 border-indigo-200 dark:border-indigo-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-teal-700">G</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Grace says:</div>
                  {!readyForReveal ? (
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      "I've been learning about you — piece by piece, conversation by conversation. 
                      You've answered {answeredCount} of the big questions so far. When you're ready for more, 
                      visit your Destiny Discovery page. I'm putting something together for you... 
                      but I need to know you a little better first."
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      "I've been putting together something about you. From everything you've shared — 
                      your values, your dreams, the things that light you up and the things that keep you up at night — 
                      I think I see something. Something big. Your moonshot. 
                      Want me to show you what I've found?"
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Destiny Questions Answered</span>
              <span>{answeredCount} / {totalQuestions}</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
            {answeredCount < 15 && (
              <p className="text-xs text-muted-foreground mt-1">
                Answer {15 - answeredCount} more questions to unlock your Moonshot Reveal
              </p>
            )}
          </div>

          <div className="space-y-3">
            {readyForReveal && (
              <Button
                onClick={() => profileId && generateMut.mutate({ profileId })}
                disabled={generateMut.isPending}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                size="lg"
              >
                {generateMut.isPending ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" /> Grace is writing your moonshot...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Rocket className="w-4 h-4" /> Show Me My Moonshot
                  </span>
                )}
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/destiny")} className="w-full">
              <Compass className="w-4 h-4 mr-2" /> Continue Destiny Discovery
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Post-reveal: The Moonshot
  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-indigo-50 via-purple-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981"][i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="container max-w-lg py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Moonshot
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            This is what Grace sees in you.
          </p>
        </div>

        {/* Grace's Introduction */}
        <Card className="mb-4 border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-teal-700">G</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Grace says:</div>
                <p className="text-sm text-muted-foreground mt-1 italic">
                  "I've been putting this together for a while now. Every conversation, every answer, 
                  every quiet moment — they all pointed here. This is what I see when I look at everything 
                  you've shared with me. This is your moonshot."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Synthesis */}
        {parsedSynthesis && (
          <div className="space-y-4">
            {parsedSynthesis.coreValues && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-rose-500" /> Your Core Values
                  </h3>
                  <p className="text-sm text-muted-foreground">{parsedSynthesis.coreValues}</p>
                </CardContent>
              </Card>
            )}

            {parsedSynthesis.strengths && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Your Strengths
                  </h3>
                  <p className="text-sm text-muted-foreground">{parsedSynthesis.strengths}</p>
                </CardContent>
              </Card>
            )}

            {parsedSynthesis.purpose && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Compass className="w-4 h-4 text-indigo-500" /> Your Purpose
                  </h3>
                  <p className="text-sm text-muted-foreground">{parsedSynthesis.purpose}</p>
                </CardContent>
              </Card>
            )}

            {parsedSynthesis.moonshot && (
              <Card className="border-2 border-indigo-300 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                    <Rocket className="w-5 h-5 text-indigo-600" /> Your Moonshot
                  </h3>
                  <p className="text-base leading-relaxed">{parsedSynthesis.moonshot}</p>
                </CardContent>
              </Card>
            )}

            {!parsedSynthesis.moonshot && parsedSynthesis.coreValues && (
              <Card className="border-2 border-indigo-300 dark:border-indigo-700">
                <CardContent className="pt-6">
                  <p className="text-base leading-relaxed">Grace is still putting the pieces together. Check back soon.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Button variant="outline" onClick={() => navigate("/destiny")} className="w-full">
            <Compass className="w-4 h-4 mr-2" /> Continue Destiny Discovery
          </Button>
          <Button variant="outline" onClick={() => navigate("/grace")} className="w-full">
            Talk to Grace About This
          </Button>
        </div>
      </div>
    </div>
  );
}
