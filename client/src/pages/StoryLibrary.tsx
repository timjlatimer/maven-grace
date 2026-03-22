import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Sparkles, Eye, EyeOff, Users, Lock, Volume2, ChevronDown, ChevronUp, Pen } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const VISIBILITY_OPTIONS = [
  { value: "private" as const, label: "Private", icon: Lock, desc: "Only you" },
  { value: "friends" as const, label: "Friends", icon: Eye, desc: "Friends only" },
  { value: "community" as const, label: "Community", icon: Users, desc: "Maven village" },
];

export default function StoryLibrary() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: stories, refetch } = trpc.stories.list.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const generateMut = trpc.stories.generate.useMutation({
    onSuccess: (data) => {
      refetch();
      toast.success(`"${data.title}" — a new story about you!`);
    },
    onError: () => {
      toast.error("Jolene needs more material. Keep talking to Grace!");
    },
  });

  const deliverMut = trpc.stories.deliver.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Story delivered!");
    },
  });

  const visibilityMut = trpc.stories.updateVisibility.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Visibility updated!");
    },
  });

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-background pb-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Story Library</h1>
        <span className="text-xs text-muted-foreground ml-auto">Jolene the Journalist</span>
      </div>

      <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <Card className="bg-gradient-to-br from-warmth/10 via-accent/10 to-primary/5 border-warmth/20">
          <CardContent className="py-6 text-center">
            <Pen className="w-8 h-8 text-warmth mx-auto mb-3" />
            <p className="text-sm text-foreground/80 italic leading-relaxed">
              "There's a journalist who's been following your journey. She finds the stories
              in the small moments — the ones you might not notice yourself."
            </p>
            <p className="text-xs text-muted-foreground mt-2">— Grace</p>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <Button
          className="w-full h-14 text-base"
          onClick={() => profileId && generateMut.mutate({ profileId })}
          disabled={generateMut.isPending}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {generateMut.isPending ? "Jolene is writing..." : "Ask Jolene for a Story"}
        </Button>

        {/* Stories */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Your Stories ({stories?.length || 0})
          </h2>

          {(!stories || stories.length === 0) ? (
            <Card>
              <CardContent className="py-10 text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Your story library is empty. Keep talking to Grace — Jolene is always listening
                  for the moments that matter.
                </p>
              </CardContent>
            </Card>
          ) : (
            stories.map((story: any) => {
              const isExpanded = expandedId === story.id;
              return (
                <motion.div key={story.id} layout>
                  <Card className={`transition-all ${story.isDelivered ? "" : "border-primary/30 bg-primary/5"}`}>
                    <CardContent className="py-4">
                      {/* Header */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : story.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {!story.isDelivered && (
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">New</span>
                              )}
                              <span className="text-[10px] text-muted-foreground">
                                {story.storyType === "moment" ? "500-word Moment" : "1,250-word Feature"}
                              </span>
                              {story.grade && (
                                <span className="text-[10px] font-bold text-amber-600">Grade: {story.grade}</span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-foreground">{story.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(story.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-4"
                          >
                            {/* Story Content */}
                            <div className="bg-card/80 rounded-xl p-4 border">
                              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                {story.content}
                              </p>
                            </div>

                            {/* Great Quote */}
                            {story.greatQuote && (
                              <div className="bg-warmth/5 rounded-xl p-3 border border-warmth/20">
                                <p className="text-xs font-bold text-warmth mb-1">The Great Quote</p>
                                <p className="text-sm text-foreground/80 italic">"{story.greatQuote}"</p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              {!story.isDelivered && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deliverMut.mutate({ id: story.id, method: "grace_read" })}
                                  >
                                    <Volume2 className="w-3 h-3 mr-1" /> Grace Reads It
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deliverMut.mutate({ id: story.id, method: "self_read" })}
                                  >
                                    <Eye className="w-3 h-3 mr-1" /> Read Quietly
                                  </Button>
                                </>
                              )}
                              {/* Visibility */}
                              <div className="flex gap-1 ml-auto">
                                {VISIBILITY_OPTIONS.map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={() => visibilityMut.mutate({ id: story.id, visibility: opt.value })}
                                    className={`p-1.5 rounded-lg transition-all ${
                                      story.visibility === opt.value
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted/30"
                                    }`}
                                    title={`${opt.label}: ${opt.desc}`}
                                  >
                                    <opt.icon className="w-3.5 h-3.5" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
