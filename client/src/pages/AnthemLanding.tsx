import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Heart, Gift, Sparkles, Volume2, ArrowRight, Users } from "lucide-react";
import GraceAudioPlayer from "@/components/GraceAudioPlayer";
import { Link } from "wouter";

interface AnthemLandingProps {
  token: string;
}

export default function AnthemLanding({ token }: AnthemLandingProps) {
  const [showLyrics, setShowLyrics] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [voiceLoading, setVoiceLoading] = useState(false);

  const { data, isLoading, error } = trpc.anthemShare.getByToken.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  const speakMutation = trpc.voice.speak.useMutation();

  // Auto-generate voice reading of the anthem
  useEffect(() => {
    if (data?.song?.lyrics && !voiceUrl && !voiceLoading) {
      generateVoice(data.song.lyrics.slice(0, 500));
    }
  }, [data?.song?.lyrics]);

  async function generateVoice(text: string) {
    setVoiceLoading(true);
    try {
      const result = await speakMutation.mutateAsync({ text, source: "song" });
      if (result.audioUrl) {
        setVoiceUrl(result.audioUrl);
      }
    } catch {
      // Voice is optional — degrade gracefully
    } finally {
      setVoiceLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <Gift className="w-16 h-16 text-[#2DD4BF] mx-auto" />
          <p className="text-xl font-medium text-[#1a1a2e]">Someone sent you something special...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardContent className="p-8 text-center space-y-4">
            <Heart className="w-12 h-12 text-[#FB7185] mx-auto" />
            <h2 className="text-xl font-bold text-[#1a1a2e]">This link has expired</h2>
            <p className="text-[#4a4a6a]">Song dedications are available for 30 days. But you can still meet Grace and get your own anthem!</p>
            <Link href="/grace">
              <Button className="bg-[#2DD4BF] hover:bg-[#14b8a6] text-white w-full mt-4">
                Meet Grace <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const song = data.song;
  const senderName = data.senderName || "A friend";
  const recipientName = data.recipientName || "you";
  const personalMessage = data.recipientMessage;

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-[#FFF8F0] via-[#FFF0E6] to-[#FFF8F0]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2DD4BF]/10 via-transparent to-[#FB7185]/10" />
        <div className="relative w-full max-w-sm mx-auto px-6 pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <Gift className="w-4 h-4 text-[#FB7185]" />
            <span className="text-sm font-medium text-[#4a4a6a]">A Gift Anthem from {senderName}</span>
          </div>

          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3">
            {senderName} dedicated a song to {recipientName}
          </h1>

          {personalMessage && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-[#2DD4BF]/20">
              <p className="text-[#4a4a6a] italic">"{personalMessage}"</p>
              <p className="text-sm text-[#2DD4BF] mt-2 font-medium">— {senderName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Song Card */}
      {song && (
        <div className="w-full max-w-sm mx-auto px-6 pb-6">
          <Card className="border-0 shadow-xl overflow-hidden">
            {/* Song Header */}
            <div className="bg-gradient-to-r from-[#2DD4BF] to-[#6EE7B7] p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Music className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{song.title || "Your Anthem"}</h2>
                  <div className="flex gap-3 mt-1 text-white/80 text-sm">
                    {song.genre && <span>{song.genre}</span>}
                    {song.mood && <span>• {song.mood}</span>}
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Voice Player */}
              {voiceUrl ? (
                <GraceAudioPlayer audioUrl={voiceUrl} label="Hear Grace read this anthem" autoPlay />
              ) : voiceLoading ? (
                <div className="flex items-center gap-3 p-4 bg-[#F0FDFA] rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-[#2DD4BF]/20 flex items-center justify-center animate-pulse">
                    <Volume2 className="w-4 h-4 text-[#2DD4BF]" />
                  </div>
                  <p className="text-sm text-[#4a4a6a]">Grace is preparing to read this anthem aloud...</p>
                </div>
              ) : null}

              {/* Lyrics Toggle */}
              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className="w-full flex items-center justify-between p-4 bg-[#FFF8F0] rounded-xl hover:bg-[#FFF0E6] transition-colors"
              >
                <span className="font-medium text-[#1a1a2e]">
                  {showLyrics ? "Hide Lyrics" : "Read the Lyrics"}
                </span>
                <Sparkles className="w-5 h-5 text-[#FB7185]" />
              </button>

              {showLyrics && song.lyrics && (
                <div className="p-4 bg-[#FFF8F0] rounded-xl">
                  <pre className="whitespace-pre-wrap font-sans text-[#4a4a6a] leading-relaxed text-sm">
                    {song.lyrics}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* CTA Section — Meet Grace */}
      <div className="w-full max-w-sm mx-auto px-6 pb-12">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#1a1a2e] to-[#2a2a4e] text-white overflow-hidden">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#2DD4BF]/20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-[#2DD4BF]" />
            </div>
            <h3 className="text-2xl font-bold">Want your own anthem?</h3>
            <p className="text-white/70 leading-relaxed">
              Grace is the AI neighbor who actually gives a shit. She'll write you a personalized anthem,
              help you save money, and be in your corner every single day.
            </p>
            <p className="text-[#2DD4BF] font-medium text-sm">
              No forms. No credit check. Just a conversation.
            </p>
            <Link href="/grace">
              <Button className="bg-[#2DD4BF] hover:bg-[#14b8a6] text-white text-lg px-8 py-3 h-auto w-full mt-2">
                Meet Grace — It's Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-[#4a4a6a]">
            <Users className="w-4 h-4" />
            <span>Maven and Grace give a shit about your family's finances.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
