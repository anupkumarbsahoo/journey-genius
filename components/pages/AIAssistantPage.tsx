"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Sparkles, Compass, Route, BookOpen, Mic, MicOff } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ChatMessage } from "@/types";
import toast from "react-hot-toast";

const QUICK_PROMPTS = [
  { icon: Compass, text: "Find hidden gems in Tokyo" },
  { icon: Route, text: "Best scenic route from LA to SF" },
  { icon: BookOpen, text: "Plan a 7-day Italy trip for $3000" },
  { icon: Sparkles, text: "What to pack for a tropical vacation?" },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: `Hi! I'm **WanderPilot AI**, your personal travel co-pilot! ✈️

I can help you with:
- 🗺️ **Discover** hidden gems and top attractions anywhere
- 🛣️ **Plan** optimized routes with scenic alternatives
- 📅 **Generate** day-by-day personalized itineraries
- 🌤️ **Weather-aware** travel recommendations
- 💰 **Budget planning** and expense tracking tips
- 🍽️ **Restaurant & food** recommendations

What adventure are we planning today?`,
  timestamp: new Date(),
};

export function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("AI response failed");
      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      toast.error("AI assistant is unavailable. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice input not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SR() as any;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition error");
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>")
      .replace(/^- (.*)/gm, "• $1");
  };

  return (
    <div className="h-screen flex flex-col animated-gradient">
      <Navbar />
      <div className="flex-1 flex flex-col pt-16 max-w-4xl mx-auto w-full px-4 py-6 overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">WanderPilot AI</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">Online · Powered by Groq</span>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    message.role === "assistant"
                      ? "bg-gradient-to-br from-pink-500 to-rose-600"
                      : "bg-gradient-to-br from-brand-500 to-teal-500"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "assistant"
                      ? "glass-card text-sm leading-relaxed"
                      : "bg-brand-500/20 border border-brand-500/30 text-sm"
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    className="prose prose-sm prose-invert max-w-none"
                  />
                  <div className="text-xs text-muted-foreground mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass-card rounded-2xl px-4 py-3">
                <div className="flex gap-1.5 py-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {QUICK_PROMPTS.map(({ icon: Icon, text }) => (
              <button
                key={text}
                onClick={() => sendMessage(text)}
                className="flex items-center gap-2 px-3 py-2 glass rounded-xl text-xs font-medium hover:border-brand-500/30 transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-brand-400" />
                {text}
              </button>
            ))}
          </motion.div>
        )}

        {/* Input */}
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Ask anything about your trip..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            className="bg-white/5 flex-1"
            disabled={loading}
          />
          <Button
            onClick={toggleVoice}
            variant="glass"
            size="icon"
            className={isListening ? "border-red-500/50 text-red-400 animate-pulse" : ""}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button
            onClick={() => sendMessage()}
            loading={loading}
            size="icon"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
