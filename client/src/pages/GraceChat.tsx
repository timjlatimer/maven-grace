import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2, Send, Sparkles, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import GraceAudioPlayer from "@/components/GraceAudioPlayer";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string | null;       // set once KIE.AI returns
  audioLoading?: boolean;         // true while KIE.AI is processing
};

/**
 * VoiceToggle — the speaker icon in the chat header.
 * When enabled, every new Grace message automatically requests a voice reading.
 */
function VoiceToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      title={enabled ? "Mute Grace" : "Unmute Grace"}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all border",
        enabled
          ? "bg-primary/10 text-primary border-primary/30"
          : "bg-muted/60 text-muted-foreground border-border hover:border-primary/30"
      )}
    >
      {enabled ? (
        <Volume2 className="w-3.5 h-3.5" />
      ) : (
        <VolumeX className="w-3.5 h-3.5" />
      )}
      <span className="hidden sm:inline">{enabled ? "Mute Grace" : "Unmute Grace"}</span>
    </button>
  );
}

/**
 * GraceMessageBubble — renders one Grace message with an optional inline audio player.
 * The speaker icon appears on every Grace message; tapping it requests voice on demand.
 */
function GraceMessageBubble({
  message,
  onRequestVoice,
}: {
  message: ChatMessage;
  onRequestVoice: (content: string) => void;
}) {
  return (
    <div className="flex gap-2 max-w-[85%]">
      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-1">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm text-foreground">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Streamdown>{message.content}</Streamdown>
          </div>
        </div>

        {/* Voice area */}
        {message.audioUrl ? (
          <GraceAudioPlayer
            audioUrl={message.audioUrl}
            compact={false}
            label="Grace speaking"
            className="max-w-xs"
          />
        ) : message.audioLoading ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Grace is finding her voice...</span>
          </div>
        ) : (
          <button
            onClick={() => onRequestVoice(message.content)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-1"
            title="Hear Grace speak this message"
          >
            <Volume2 className="w-3 h-3" />
            <span>Hear this</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function GraceChat() {
  const [, navigate] = useLocation();
  const { sessionId, profileId, saveProfileId } = useGraceSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1);
  const [entryId, setEntryId] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  // Voice is ON by default — Grace teaches Ruby Red the voice-first way
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.grace.chat.useMutation();
  const startMutation = trpc.trojanHorse.start.useMutation();
  const updateStepMutation = trpc.trojanHorse.updateStep.useMutation();
  const speakMutation = trpc.voice.speak.useMutation();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLDivElement;
      if (viewport) {
        requestAnimationFrame(() => {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
        });
      }
    }
  }, [messages, chatMutation.isPending]);

  /**
   * Request voice for a specific message index.
   * Sets audioLoading=true, calls KIE.AI, then stores audioUrl.
   */
  const requestVoiceForMessage = useCallback(
    async (content: string, msgIndex: number) => {
      // Mark as loading
      setMessages((prev) =>
        prev.map((m, i) => (i === msgIndex ? { ...m, audioLoading: true } : m))
      );

      try {
        const result = await speakMutation.mutateAsync({
          text: content,
          source: "chat",
        });
        setMessages((prev) =>
          prev.map((m, i) =>
            i === msgIndex
              ? { ...m, audioLoading: false, audioUrl: result.audioUrl }
              : m
          )
        );
      } catch {
        setMessages((prev) =>
          prev.map((m, i) =>
            i === msgIndex ? { ...m, audioLoading: false } : m
          )
        );
      }
    },
    [speakMutation]
  );

  /**
   * Add a Grace message and optionally auto-request voice.
   */
  const addGraceMessage = useCallback(
    (content: string, currentMessages: ChatMessage[], autoVoice: boolean) => {
      const newMsg: ChatMessage = { role: "assistant", content };
      const nextMessages = [...currentMessages, newMsg];
      setMessages(nextMessages);

      if (autoVoice) {
        const idx = nextMessages.length - 1;
        // Slight delay so the message renders first
        setTimeout(() => requestVoiceForMessage(content, idx), 100);
      }

      return nextMessages;
    },
    [requestVoiceForMessage]
  );

  // Start the Trojan Horse flow
  const handleStart = async () => {
    setHasStarted(true);
    try {
      const result = await startMutation.mutateAsync({ sessionId });
      if (result.profileId) saveProfileId(result.profileId);
      if (result.entry) setEntryId(result.entry.id);

      const graceOpening = await chatMutation.mutateAsync({
        sessionId,
        message: "Hi! I heard Maven actually delivers toilet paper? What's the deal?",
        context: { step: 1, mode: "trojan_horse" },
      });

      const userMsg: ChatMessage = {
        role: "user",
        content: "Hi! I heard Maven actually delivers toilet paper? What's the deal?",
      };
      addGraceMessage(graceOpening.response, [userMsg], voiceEnabled);
      if (graceOpening.profileId) saveProfileId(graceOpening.profileId);
    } catch {
      const fallback =
        "Hey there! I'm Grace. Yeah, we literally give a shit — toilet paper delivered to your door, no strings attached. It's part of what we do here at Maven. But honestly? The TP is just the beginning. I'm here to help with the real stuff too — bills, subscriptions draining your wallet, making it to payday. What's your name, neighbor?";
      addGraceMessage(fallback, [], voiceEnabled);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || chatMutation.isPending) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const newMessages: ChatMessage[] = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    try {
      const result = await chatMutation.mutateAsync({
        sessionId,
        message: trimmed,
        context: { step, mode: step <= 8 ? "trojan_horse" : undefined },
      });

      addGraceMessage(result.response, newMessages, voiceEnabled);
      if (result.profileId) saveProfileId(result.profileId);

      if (step < 8 && entryId) {
        const nextStep = step + 1;
        setStep(nextStep);
        await updateStepMutation.mutateAsync({ entryId, step: nextStep });
      }
    } catch {
      addGraceMessage(
        "Sorry, I got a little distracted there. What were you saying?",
        newMessages,
        false
      );
    }

    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOnDemandVoice = useCallback(
    (content: string) => {
      const idx = messages.findIndex((m) => m.content === content && m.role === "assistant");
      if (idx !== -1) requestVoiceForMessage(content, idx);
    },
    [messages, requestVoiceForMessage]
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-foreground">Grace</h1>
          <p className="text-xs text-primary truncate">Your Maven neighbor — always here</p>
        </div>

        {/* Voice toggle */}
        {hasStarted && (
          <VoiceToggle
            enabled={voiceEnabled}
            onToggle={() => setVoiceEnabled((v) => !v)}
          />
        )}

        {/* Step dots */}
        {step <= 8 && (
          <div className="flex items-center gap-1 ml-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  i < step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden" ref={scrollRef}>
        {!hasStarted ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-xl font-bold text-foreground mb-2">Meet Grace</h2>
            <p className="text-muted-foreground mb-2 max-w-sm">
              She's like your wisest neighbor — the one who always has your back and always gives a shit.
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              She's got toilet paper, a song with your name on it, and real help with the hard stuff. No forms. No catch.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-14 px-8"
              onClick={handleStart}
              disabled={startMutation.isPending}
            >
              {startMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-5 h-5 mr-2" />
              )}
              Start Chatting with Grace
            </Button>
            <p className="text-xs text-muted-foreground mt-4 max-w-xs">
              Grace never gets cut. Even if you can't pay, she stays. She's not a feature — she's your friend.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-3 p-4 pb-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex gap-2",
                      msg.role === "user" ? "justify-end" : ""
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <GraceMessageBubble
                        message={msg}
                        onRequestVoice={handleOnDemandVoice}
                      />
                    ) : (
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5 text-sm">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {chatMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      {hasStarted && (
        <div className="border-t bg-card/80 backdrop-blur-sm p-3 pb-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 items-end max-w-lg mx-auto"
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Talk to Grace..."
              className="flex-1 max-h-24 resize-none min-h-10 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary/30"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || chatMutation.isPending}
              className="shrink-0 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {chatMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
