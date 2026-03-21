import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2, Send, Sparkles, ArrowLeft } from "lucide-react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { useGraceSession } from "@/hooks/useGraceSession";
import BottomNav from "@/components/BottomNav";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function GraceChat() {
  const [, navigate] = useLocation();
  const { sessionId, profileId, saveProfileId } = useGraceSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1);
  const [entryId, setEntryId] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.grace.chat.useMutation();
  const startMutation = trpc.trojanHorse.start.useMutation();
  const updateStepMutation = trpc.trojanHorse.updateStep.useMutation();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLDivElement;
      if (viewport) {
        requestAnimationFrame(() => {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
        });
      }
    }
  }, [messages, chatMutation.isPending]);

  // Start the Trojan Horse flow
  const handleStart = async () => {
    setHasStarted(true);
    try {
      const result = await startMutation.mutateAsync({ sessionId });
      if (result.profileId) saveProfileId(result.profileId);
      if (result.entry) setEntryId(result.entry.id);

      // Grace's opening — warm, cheeky, real
      const graceOpening = await chatMutation.mutateAsync({
        sessionId,
        message: "Hi! I heard Maven actually delivers toilet paper? What's the deal?",
        context: { step: 1, mode: "trojan_horse" },
      });

      setMessages([
        { role: "user", content: "Hi! I heard Maven actually delivers toilet paper? What's the deal?" },
        { role: "assistant", content: graceOpening.response },
      ]);
      if (graceOpening.profileId) saveProfileId(graceOpening.profileId);
    } catch (e) {
      setMessages([{
        role: "assistant",
        content: "Hey there! I'm Grace. Yeah, we literally give a shit — toilet paper delivered to your door, no strings attached. It's part of what we do here at Maven. But honestly? The TP is just the beginning. I'm here to help with the real stuff too — bills, subscriptions draining your wallet, making it to payday. What's your name, neighbor?"
      }]);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || chatMutation.isPending) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");

    try {
      const result = await chatMutation.mutateAsync({
        sessionId,
        message: trimmed,
        context: { step, mode: step <= 8 ? "trojan_horse" : undefined },
      });

      setMessages([...newMessages, { role: "assistant", content: result.response }]);
      if (result.profileId) saveProfileId(result.profileId);

      // Advance step based on conversation progress
      if (step < 8 && entryId) {
        const nextStep = step + 1;
        setStep(nextStep);
        await updateStepMutation.mutateAsync({ entryId, step: nextStep });
      }
    } catch (e) {
      setMessages([...newMessages, {
        role: "assistant",
        content: "Sorry, I got a little distracted there. What were you saying?"
      }]);
    }

    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground">Grace</h1>
          <p className="text-xs text-primary">Your Maven neighbor — always here</p>
        </div>
        {step <= 8 && (
          <div className="ml-auto flex items-center gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
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
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 maven-glow"
            >
              <Sparkles className="w-10 h-10 text-primary grace-pulse" />
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
                      "flex gap-2 max-w-[85%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-1">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm",
                        msg.role === "user"
                          ? "bg-maven-rose text-white rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <Streamdown>{msg.content}</Streamdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
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
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
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
