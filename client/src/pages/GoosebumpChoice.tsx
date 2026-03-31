import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import GraceAudioPlayer from "@/components/GraceAudioPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Music2,
  Loader2,
  Sparkles,
  Zap,
  Heart,
  Volume2,
  ChevronDown,
  ChevronUp,
  Star,
  Activity,
} from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Strip Goosebump Protocol metadata headers from lyrics before display
function cleanGoosebumpLyrics(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/^TITLE:.*\n?/im, "")
    .replace(/^GENRE:.*\n?/im, "")
    .replace(/^MOOD:.*\n?/im, "")
    .replace(/^GOOSEBUMP_SCORE:.*\n?/im, "")
    .replace(/^FRISSON_TRIGGERS:.*\n?/im, "")
    .replace(/^EMOTIONAL_ARC:.*\n?/im, "")
    .trim();
}

function buildGoosebumpSpeechText(song: {
  title?: string;
  lyrics?: string;
}): string {
  const title = song.title || "Your Goosebump Choice";
  const lyrics = cleanGoosebumpLyrics(song.lyrics);
  return `Here is your Goosebump Choice. It's called: ${title}.\n\n${lyrics}`;
}

// Score badge color based on goosebump score
function scoreColor(score: number): string {
  if (score >= 91) return "bg-purple-500/20 text-purple-300 border-purple-500/30";
  if (score >= 71) return "bg-blue-500/20 text-blue-300 border-blue-500/30";
  if (score >= 41) return "bg-teal-500/20 text-teal-300 border-teal-500/30";
  return "bg-slate-500/20 text-slate-300 border-slate-500/30";
}

function scoreLabel(score: number): string {
  if (score >= 91) return "Masterclass in Frisson";
  if (score >= 71) return "High Frisson Potential";
  if (score >= 41) return "Moderate Frisson";
  return "Building Frisson";
}

interface GoosebumpSong {
  songId?: number;
  title: string;
  lyrics: string;
  genre: string;
  mood: string;
  goosebumpScore: number;
  frissonTriggers: string[];
  emotionalArc: string[];
  source: string;
  status: "ready";
}

interface SongResultCardProps {
  song: GoosebumpSong;
}

function SongResultCard({ song }: SongResultCardProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRequestingVoice, setIsRequestingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const speakMutation = trpc.voice.speak.useMutation({
    onSuccess: (data) => {
      setAudioUrl(data.audioUrl);
      setIsRequestingVoice(false);
    },
    onError: (err) => {
      setIsRequestingVoice(false);
      setVoiceError("Grace's voice is resting. Try again in a moment.");
      console.error("Voice error:", err);
    },
  });

  const handleHear = () => {
    if (isRequestingVoice || audioUrl) return;
    setIsRequestingVoice(true);
    setVoiceError(null);
    speakMutation.mutate({
      text: buildGoosebumpSpeechText(song),
      source: "song",
    });
  };

  const lyrics = cleanGoosebumpLyrics(song.lyrics);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 overflow-hidden">
        <CardContent className="p-0">
          {/* Song Header */}
          <div className="bg-gradient-to-r from-purple-900/60 to-blue-900/40 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/30">
                <Music2 className="w-6 h-6 text-purple-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg leading-tight">{song.title}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {song.genre && (
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">
                      {song.genre}
                    </span>
                  )}
                  {song.mood && (
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20">
                      {song.mood}
                    </span>
                  )}
                  {song.source === "maria_api" && (
                    <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/20">
                      Powered by Maria
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Goosebump Score */}
            <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${scoreColor(song.goosebumpScore)}`}>
              <Zap className="w-3.5 h-3.5" />
              <span>Goosebump Score: {song.goosebumpScore}/100</span>
              <span className="text-xs opacity-70">— {scoreLabel(song.goosebumpScore)}</span>
            </div>
          </div>

          {/* Lyrics */}
          <div className="px-5 py-4">
            <pre className="text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
              {lyrics}
            </pre>
          </div>

          {/* Hear It Button */}
          <div className="px-5 pb-4 space-y-3">
            {!audioUrl && (
              <Button
                onClick={handleHear}
                disabled={isRequestingVoice}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isRequestingVoice ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Grace is preparing your song...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Hear Grace Read It Aloud
                  </>
                )}
              </Button>
            )}
            {voiceError && (
              <p className="text-xs text-red-400 text-center">{voiceError}</p>
            )}
            {audioUrl && (
              <GraceAudioPlayer audioUrl={audioUrl} autoPlay />
            )}
          </div>

          {/* Frisson Details Toggle */}
          {(song.frissonTriggers.length > 0 || song.emotionalArc.length > 0) && (
            <div className="border-t border-purple-500/20">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between px-5 py-3 text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Goosebump Protocol Details
                </span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 space-y-3">
                      {song.emotionalArc.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 mb-1.5">7-Phase Emotional Arc</p>
                          <div className="flex flex-wrap gap-1.5">
                            {song.emotionalArc.map((phase, i) => (
                              <span
                                key={i}
                                className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                              >
                                {i + 1}. {phase}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {song.frissonTriggers.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 mb-1.5">Frisson Triggers Embedded</p>
                          <div className="flex flex-wrap gap-1.5">
                            {song.frissonTriggers.map((trigger, i) => (
                              <span
                                key={i}
                                className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20"
                              >
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function GoosebumpChoice() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();

  // Form state
  const [emotion, setEmotion] = useState("");
  const [theme, setTheme] = useState("");
  const [personalDetail, setPersonalDetail] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [song, setSong] = useState<GoosebumpSong | null>(null);

  const generateMutation = trpc.goosebumpChoice.generate.useMutation({
    onSuccess: (data) => {
      setSong(data);
      setHasSubmitted(true);
      toast.success("Your Goosebump Choice is ready.");
    },
    onError: (err) => {
      console.error("[GoosebumpChoice] Generation failed:", err);
      toast.error("Something went wrong. Grace is on it — try again in a moment.");
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({
      profileId: profileId ?? undefined,
      context: {
        emotion: emotion.trim() || undefined,
        theme: theme.trim() || undefined,
        personalDetail: personalDetail.trim() || undefined,
      },
    });
  };

  const handleReset = () => {
    setSong(null);
    setHasSubmitted(false);
    setEmotion("");
    setTheme("");
    setPersonalDetail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-purple-950 text-white pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate("/")} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Goosebump Choice
          </h1>
          <p className="text-xs text-slate-400">A song engineered to give you chills</p>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 space-y-5">
        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-purple-500/20 bg-purple-950/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm">What is a Goosebump Choice?</h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    This is not just a song. It is a piece of music engineered using the Goosebump Protocol — 
                    a 7-phase emotional arc with 8 validated frisson triggers designed to give you actual chills. 
                    Grace and Maria built this for you. For the moments when you need to feel something real.
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Heart className="w-3 h-3 text-pink-400" />
                    <span className="text-xs text-slate-400">Powered by Maria's music intelligence</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generation Form or Result */}
        <AnimatePresence mode="wait">
          {!hasSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">
                  How are you feeling right now? <span className="text-slate-500">(optional)</span>
                </label>
                <Input
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder="e.g. tired but hopeful, overwhelmed, proud"
                  className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">
                  What do you want the song to be about? <span className="text-slate-500">(optional)</span>
                </label>
                <Input
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. making it through the week, my kids, starting over"
                  className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">
                  One thing that keeps you going <span className="text-slate-500">(optional)</span>
                </label>
                <Textarea
                  value={personalDetail}
                  onChange={(e) => setPersonalDetail(e.target.value)}
                  placeholder="e.g. my kids' faces when I pick them up from school"
                  rows={2}
                  className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Maria is composing your song...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate My Goosebump Choice
                  </>
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center leading-relaxed">
                You can leave everything blank and Grace will write something just for you. 
                The more you share, the more personal it gets.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {song && <SongResultCard song={song} />}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Generate Another
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/song")}
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Music2 className="w-4 h-4 mr-2" />
                  My Songs
                </Button>
              </div>

              <Card className="border-slate-700/50 bg-slate-800/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white">From Grace:</span> You deserve to feel something 
                      real. This song was built for you — not for a playlist, not for background noise. 
                      For the moments when you need to remember how extraordinary you actually are.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
