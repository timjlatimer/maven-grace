import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import GraceAudioPlayer from "@/components/GraceAudioPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Music, Loader2, Sparkles, Heart, Volume2 } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Strip metadata lines from lyrics before display/TTS
function cleanLyrics(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/^TITLE:.*\n?/im, "")
    .replace(/^GENRE:.*\n?/im, "")
    .replace(/^MOOD:.*\n?/im, "")
    .trim();
}

// Build the text Grace reads aloud for a song
function buildSongSpeechText(song: {
  title?: string | null;
  lyrics?: string | null;
}): string {
  const title = song.title || "Your Anthem";
  const lyrics = cleanLyrics(song.lyrics);
  return `Here is your anthem. It's called: ${title}.\n\n${lyrics}`;
}

interface SongCardProps {
  song: {
    id: number;
    title?: string | null;
    genre?: string | null;
    mood?: string | null;
    lyrics?: string | null;
  };
  index: number;
}

function SongCard({ song, index }: SongCardProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRequestingVoice, setIsRequestingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const speakMutation = trpc.voice.speak.useMutation({
    onSuccess: (data) => {
      setAudioUrl(data.audioUrl);
      setIsRequestingVoice(false);
    },
    onError: (err) => {
      setIsRequestingVoice(false);
      setVoiceError("Grace's voice is resting. Try again in a moment.");
      console.error("KIE.AI voice error:", err);
    },
  });

  const handleHearAnthem = () => {
    if (isRequestingVoice || audioUrl) return;
    setIsRequestingVoice(true);
    setVoiceError(null);
    speakMutation.mutate({
      text: buildSongSpeechText(song),
      source: "song",
    });
  };

  const lyrics = cleanLyrics(song.lyrics);

  return (
    <motion.div
      key={song.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10 overflow-hidden">
        <CardContent className="p-0">
          {/* Song Header */}
          <div className="bg-primary/10 px-5 py-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground">{song.title || "Your Anthem"}</h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {song.genre && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {song.genre}
                  </span>
                )}
                {song.mood && (
                  <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full">
                    {song.mood}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Lyrics */}
          <div className="px-5 py-4">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
              {lyrics}
            </pre>
          </div>

          {/* Voice Player */}
          <div className="px-5 pb-4 space-y-3">
            {audioUrl ? (
              <GraceAudioPlayer
                audioUrl={audioUrl}
                autoPlay
                label="Grace reads your anthem aloud"
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl border-primary/30 text-primary hover:bg-primary/10 font-semibold"
                onClick={handleHearAnthem}
                disabled={isRequestingVoice}
              >
                {isRequestingVoice ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Grace is finding her voice...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Hear Grace read this aloud
                  </>
                )}
              </Button>
            )}
            {voiceError && (
              <p className="text-xs text-destructive text-center">{voiceError}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-primary/10 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">Written by Grace, just for you</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SongMoment() {
  const [, navigate] = useLocation();
  const { profileId } = useGraceSession();
  const [personalDetail, setPersonalDetail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: songs, refetch } = trpc.song.get.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  const generateMutation = trpc.song.generate.useMutation({
    onSuccess: () => {
      setIsGenerating(false);
      refetch();
      toast.success("Your anthem is ready! Tap 'Hear Grace read this aloud' to listen.");
    },
    onError: () => {
      setIsGenerating(false);
      toast.error("Couldn't write the song right now. Try again?");
    },
  });

  const handleGenerate = () => {
    if (!profileId || !personalDetail.trim()) return;
    setIsGenerating(true);
    generateMutation.mutate({ profileId, personalDetail: personalDetail.trim() });
  };

  const readySongs = songs?.filter(s => s.status === "ready") || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Music className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Your Anthem</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Voice status badge */}
        <VoiceStatusBadge />

        {/* Songs Display */}
        {readySongs.length > 0 && (
          <div className="space-y-4">
            {readySongs.map((song, i) => (
              <SongCard key={song.id} song={song} index={i} />
            ))}
          </div>
        )}

        {/* Generate New Song */}
        {profileId ? (
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">
                    {readySongs.length > 0 ? "Want another anthem?" : "Grace wants to write you a song"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tell her one thing that makes you smile, even on a hard day.
                  </p>
                </div>
              </div>

              <Textarea
                value={personalDetail}
                onChange={(e) => setPersonalDetail(e.target.value)}
                placeholder="My kids laughing at the dinner table... watching the sunset from my porch... that first cup of coffee in the morning..."
                className="rounded-xl bg-muted/50 border-0 focus-visible:ring-primary/30 min-h-20"
                rows={3}
              />

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12"
                onClick={handleGenerate}
                disabled={!personalDetail.trim() || isGenerating}
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Grace is writing your anthem...</>
                ) : (
                  <><Music className="w-4 h-4 mr-2" /> Write My Anthem</>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Music className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Chat with Grace first — she'll get to know you before writing your anthem.
              </p>
              <button onClick={() => navigate("/grace")} className="text-sm font-medium text-primary hover:underline">
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

/** Small badge showing Grace's voice is powered by KIE.AI */
function VoiceStatusBadge() {
  const { data: status } = trpc.voice.status.useQuery();
  if (!status?.configured) return null;
  return (
    <div className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-xl px-3 py-2">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs text-muted-foreground">
        Grace's voice is live — powered by KIE.AI
      </span>
      <Volume2 className="w-3.5 h-3.5 text-primary ml-auto" />
    </div>
  );
}
