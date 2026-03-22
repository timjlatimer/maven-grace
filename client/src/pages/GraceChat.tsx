import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2, Send, Sparkles, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { VoiceInput } from "@/components/VoiceInput";
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
  audioUrl?: string | null;
  audioLoading?: boolean;
  isHistory?: boolean; // marks messages loaded from prior session
};

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
        <div className={cn(
          "rounded-2xl rounded-bl-md px-4 py-2.5 text-sm",
          message.isHistory
            ? "bg-muted/50 text-foreground/70"
            : "bg-muted text-foreground"
        )}>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Streamdown>{message.content}</Streamdown>
          </div>
        </div>

        {!message.isHistory && (
          message.audioUrl ? (
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
          )
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
  // Grace speaks first — no hasStarted gate. Conversation begins on mount.
  const [isInitializing, setIsInitializing] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initRef = useRef(false);

  const chatMutation = trpc.grace.chat.useMutation();
  const startMutation = trpc.trojanHorse.start.useMutation();
  const updateStepMutation = trpc.trojanHorse.updateStep.useMutation();
  const speakMutation = trpc.voice.speak.useMutation();
  const utils = trpc.useUtils();

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

  const requestVoiceForMessage = useCallback(
    async (content: string, msgIndex: number) => {
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

  const addGraceMessage = useCallback(
    (content: string, currentMessages: ChatMessage[], autoVoice: boolean) => {
      const newMsg: ChatMessage = { role: "assistant", content };
      const nextMessages = [...currentMessages, newMsg];
      setMessages(nextMessages);
      if (autoVoice) {
        const idx = nextMessages.length - 1;
        setTimeout(() => requestVoiceForMessage(content, idx), 100);
      }
      return nextMessages;
    },
    [requestVoiceForMessage]
  );

  // ─── GRACE SPEAKS FIRST ─────────────────────────────────────────────
  // Auto-start the conversation on mount. For returning users, load history
  // and greet warmly. For new users, start the Trojan Horse flow.
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const autoStart = async () => {
      try {
        // First, check if this is a returning user with prior conversation
        let sessionContext: {
          isReturning: boolean;
          profile: { id: number; firstName: string | null; city: string | null } | null;
          memories: { category: string; fact: string }[];
          recentMessages: { role: "user" | "assistant"; content: string }[];
        } | null = null;

        try {
          sessionContext = await utils.grace.getSessionContext.fetch({ sessionId });
        } catch {
          // If the query fails, treat as new user
          sessionContext = null;
        }

        if (sessionContext?.isReturning && sessionContext.recentMessages.length > 0) {
          // ─── RETURNING USER ─────────────────────────────────────
          // Load prior conversation as history, then greet warmly
          if (sessionContext.profile?.id) {
            saveProfileId(sessionContext.profile.id);
          }

          // Load last few messages as history context
          const historyMessages: ChatMessage[] = sessionContext.recentMessages.map(m => ({
            role: m.role,
            content: m.content,
            isHistory: true,
          }));
          setMessages(historyMessages);

          // Build a warm welcome-back prompt
          const name = sessionContext.profile?.firstName || "";
          const memoryHints = sessionContext.memories.slice(0, 5).map(m => m.fact).join("; ");

          const welcomeBack = await chatMutation.mutateAsync({
            sessionId,
            message: `[SYSTEM: This is a RETURNING user${name ? ` named ${name}` : ""}. They have ${sessionContext.recentMessages.length} prior messages. ${memoryHints ? `You remember: ${memoryHints}.` : ""} Welcome them back warmly — use their name if you know it. Be genuinely happy to see them. Ask what's on their mind today. Keep it to 2-3 sentences. Do NOT re-introduce yourself or explain what Maven is — they already know.]`,
            context: { step: 9, mode: "returning" },
          });

          const allMsgs = [...historyMessages, { role: "assistant" as const, content: welcomeBack.response }];
          setMessages(allMsgs);
          if (voiceEnabled) {
            const idx = allMsgs.length - 1;
            setTimeout(() => requestVoiceForMessage(welcomeBack.response, idx), 100);
          }
          if (welcomeBack.profileId) saveProfileId(welcomeBack.profileId);
          setStep(9); // Past the trojan horse flow
        } else {
          // ─── NEW USER ───────────────────────────────────────────
          // Start the Trojan Horse flow — Grace speaks first
          const result = await startMutation.mutateAsync({ sessionId });
          if (result.profileId) saveProfileId(result.profileId);
          if (result.entry) setEntryId(result.entry.id);

          // Grace speaks first — no fake user message. She opens with curiosity.
          const graceOpening = await chatMutation.mutateAsync({
            sessionId,
            message: "[SYSTEM: Grace is opening the conversation. This is the very first message. Do NOT reference any previous user message. Introduce yourself warmly with genuine curiosity. Ask Ruby her name. Be yourself — cheeky, warm, real. One short paragraph max.]",
            context: { step: 1, mode: "trojan_horse" },
          });

          addGraceMessage(graceOpening.response, [], voiceEnabled);
          if (graceOpening.profileId) saveProfileId(graceOpening.profileId);
        }
      } catch {
        const fallback =
          "Hey there! I'm Grace. Yeah, we literally give a shit — toilet paper delivered to your door, no strings attached. It's part of what we do here at Maven. But honestly? The TP is just the beginning. I'm here to help with the real stuff too — bills, subscriptions draining your wallet, making it to payday. What's your name, neighbor?";
        addGraceMessage(fallback, [], voiceEnabled);
      } finally {
        setIsInitializing(false);
      }
    };

    autoStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Count history messages for the divider
  const historyCount = messages.filter(m => m.isHistory).length;

  return (
    <div className="flex flex-col h-screen bg-background w-full max-w-[100vw] overflow-x-hidden">
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

        {/* Voice toggle — always visible now */}
        <VoiceToggle
          enabled={voiceEnabled}
          onToggle={() => setVoiceEnabled((v) => !v)}
        />

        {/* Step dots — only show during Trojan Horse flow */}
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
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-3 p-4 pb-4">
            {/* Grace is loading her first message */}
            {isInitializing && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Grace is getting ready to talk to you...</p>
                <p className="text-xs text-muted-foreground mt-1">No forms. No catch. Just a neighbor who gets it.</p>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i}>
                  {/* Show "Earlier conversation" divider before history messages */}
                  {i === 0 && msg.isHistory && (
                    <div className="flex items-center gap-2 py-2 mb-2">
                      <div className="flex-1 h-px bg-border/50" />
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Earlier conversation</span>
                      <div className="flex-1 h-px bg-border/50" />
                    </div>
                  )}
                  {/* Show "Now" divider between history and new messages */}
                  {i === historyCount && historyCount > 0 && !msg.isHistory && (
                    <div className="flex items-center gap-2 py-2 mb-2">
                      <div className="flex-1 h-px bg-primary/30" />
                      <span className="text-[10px] text-primary font-medium uppercase tracking-wide">Now</span>
                      <div className="flex-1 h-px bg-primary/30" />
                    </div>
                  )}
                  <motion.div
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
                      <div className={cn(
                        "max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm",
                        msg.isHistory
                          ? "bg-primary/60 text-primary-foreground/80"
                          : "bg-primary text-primary-foreground"
                      )}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {chatMutation.isPending && !isInitializing && (
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
      </div>

      {/* Input Area — always visible, Grace speaks first but Ruby can type anytime */}
      <div className="border-t bg-card/80 backdrop-blur-sm p-3 pb-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 items-end w-full max-w-sm mx-auto"
        >
          <VoiceInput
            onTranscription={(text) => {
              setInput(text);
              setTimeout(() => {
                setInput(prev => {
                  if (prev === text) {
                    handleSend();
                    return "";
                  }
                  return prev;
                });
              }, 800);
            }}
            disabled={chatMutation.isPending || isInitializing}
          />
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Talk to Grace... or tap the mic"
            className="flex-1 max-h-24 resize-none min-h-10 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary/30"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || chatMutation.isPending || isInitializing}
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

      <BottomNav />
    </div>
  );
}
