/**
 * GraceAudioPlayer
 *
 * A warm, minimal audio player for Grace's voice.
 * Used in Song Moment (auto-play) and Grace Chat (speaker toggle).
 *
 * Props:
 *   audioUrl   — the KIE.AI-returned audio URL to play
 *   autoPlay   — whether to start playing immediately (Song Moment)
 *   label      — optional label shown beside the player
 *   compact    — compact mode for inline chat use
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GraceAudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
  label?: string;
  compact?: boolean;
  className?: string;
}

export default function GraceAudioPlayer({
  audioUrl,
  autoPlay = false,
  label,
  compact = false,
  className,
}: GraceAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Create audio element
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setIsPlaying(false);

    const onCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration);
      if (autoPlay) {
        audio.play().catch(() => setError("Tap play to hear Grace"));
      }
    };

    const onTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
      setError("Voice unavailable right now");
    };

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [audioUrl, autoPlay]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setError("Tap play to hear Grace"));
    }
  }, [isPlaying, isLoading]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || isLoading || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audio.currentTime = pct * audio.duration;
  }, [isLoading, duration]);

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}>
        <Volume2 className="w-3.5 h-3.5" />
        <span>{error}</span>
      </div>
    );
  }

  if (compact) {
    return (
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className={cn(
          "flex items-center justify-center w-7 h-7 rounded-full transition-all",
          isPlaying
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10",
          className
        )}
        title={isPlaying ? "Pause Grace" : "Hear Grace speak"}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  return (
    <div className={cn("bg-primary/5 rounded-2xl p-4 border border-primary/15", className)}>
      <div className="flex items-center gap-3">
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all",
            isLoading
              ? "bg-muted text-muted-foreground cursor-wait"
              : isPlaying
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-primary/15 text-primary hover:bg-primary/25"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        {/* Progress and label */}
        <div className="flex-1 min-w-0">
          {label && (
            <p className="text-xs font-semibold text-foreground mb-1.5 truncate">{label}</p>
          )}

          {/* Progress bar */}
          <div
            className="h-1.5 bg-border rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time */}
          {duration > 0 && (
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">
                {formatTime((progress / 100) * duration)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          )}
        </div>

        {/* Grace voice icon */}
        <div className="shrink-0">
          <Volume2 className={cn("w-4 h-4", isPlaying ? "text-primary" : "text-muted-foreground")} />
        </div>
      </div>

      {isLoading && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Grace is finding her voice...
        </p>
      )}
    </div>
  );
}
