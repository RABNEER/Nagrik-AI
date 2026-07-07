"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useApp, LANG_INSTRUCTIONS, LANG_LABELS } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { ArrowUp, RotateCcw, AlertTriangle, Mic, MicOff, Loader2 } from "lucide-react";
import { AnimatedSphere } from "./animated-sphere";
import { useTranslation } from "@/lib/translations";

interface Msg {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const SUGGESTIONS = [
  { text: "Aadhaar apply karna hai?", query: "How do I apply for an Aadhaar card?" },
  { text: "Passport ke liye kya chahiye?", query: "What documents do I need for a passport?" },
  { text: "PAN status check karein", query: "How to check my PAN application status?" },
];

const QUICK_REFS = [
  { title: "Aadhaar Services", desc: "Enrollment, update, download", query: "Tell me about Aadhaar services" },
  { title: "PAN Card", desc: "Apply, correct, track status", query: "How to apply for a new PAN card?" },
  { title: "Passport", desc: "New, renew, tatkaal", query: "What is the passport renewal process?" },
  { title: "Voter ID", desc: "Registration, correction, EPIC", query: "How to register for a Voter ID?" },
  { title: "Driving License", desc: "Apply, test, renewal", query: "Driving license application process" },
  { title: "Income Tax", desc: "ITR filing, refund status", query: "How to file income tax return?" },
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Namaste! 🙏 I'm **NagrikAI**, your trusted guide to Indian government services.\n\nAsk me about any scheme — Aadhaar, PM-Kisan, Ayushman Bharat, and 20+ more. I'll explain eligibility, documents, fees, and the **official portal** in simple language.\n\nHow can I help you today?",
};

export function ChatCompanion() {
  const { lang: rawLang, consumePending } = useApp();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initRef = useRef(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { t, lang } = useTranslation();

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setIsTranscribing(true);

        try {
          const formData = new FormData();
          formData.append("file", audioBlob, "audio.webm");
          formData.append("lang", lang);

          const res = await fetch("/api/stt", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Transcription failed");

          if (data.text) {
            setInput(data.text);
          }
        } catch (err: any) {
          console.error(err);
          toast({
            title: "Voice Transcription Failed",
            description: err.message || "Could not transcribe audio.",
            variant: "destructive",
          });
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      toast({
        title: "Microphone Access Denied",
        description: "Please grant microphone permissions to use voice input.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecording();
    } else {
      void startRecording();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Handle pending chat message (from service cards / example prompts)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const pending = consumePending();
    if (pending) {
      void send(pending);
    }
  }, [consumePending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const langInstruction = LANG_INSTRUCTIONS[rawLang];
    const apiMessage = langInstruction ? `${langInstruction}\n\n${trimmed}` : trimmed;

    const userMsg: Msg = { role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    const history = messages
      .filter((m) => m !== WELCOME && !m.error)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: apiMessage, history, lang: rawLang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `⚠️ I couldn't connect to the AI service right now (${msg}). Please try again in a moment.`,
          error: true,
        },
      ]);
      toast({
        title: "Couldn't get a response",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const handleReset = () => {
    setMessages([WELCOME]);
    setInput("");
  };

  return (
    <div className="animate-fade-up max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16 w-full">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight">{t("chat.title")}</h2>
          <p className="mt-3 text-muted-fg text-base md:text-lg max-w-lg">
            {t("chat.subtitle")}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-fg hover:text-foreground cursor-pointer focus:outline-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t("chat.reset")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chat Panel */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border flex flex-col" style={{ height: "540px" }}>
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-success" aria-hidden="true" />
              <span className="text-sm font-medium">{t("chat.assistant")}</span>
            </div>
            <span id="lang-badge" className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-muted text-muted-fg border border-border">
              {LANG_LABELS[rawLang].toUpperCase()}
            </span>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto chat-scroll px-5 py-4 flex flex-col gap-4"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "msg-appear flex items-start gap-2.5 max-w-[85%]",
                  m.role === "user" ? "self-end flex-row-reverse" : "self-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-tr-sm bg-primary text-primary-fg"
                      : m.error
                      ? "rounded-tl-sm bg-destructive/10 text-destructive"
                      : "rounded-tl-sm bg-secondary text-foreground"
                  )}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none [&_a]:font-semibold [&_a]:text-trust [&_a]:underline [&_li]:my-0.5 [&_p]:my-1 [&_strong]:font-semibold [&_ul]:my-1 [&_ul]:pl-4">
                      <ReactMarkdown
                        components={{
                          a: ({ ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2.5 self-start msg-appear">
                <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestion Chips */}
          {messages.length === 1 && !loading && (
            <div id="chat-suggestions" className="px-5 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => void send(s.query)}
                  className="suggestion-chip text-xs px-3 py-2 rounded-full border border-border text-muted-fg hover:border-trust hover:text-trust transition-colors cursor-pointer focus:outline-none"
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="px-4 pb-4 pt-1">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-background border-2 border-border rounded-lg focus-within:border-ring transition-colors pr-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-fg/60"
                placeholder={t("chat.placeholder")}
                aria-label="Type your question"
                autoComplete="off"
                disabled={loading}
              />
              <button
                type="button"
                onClick={toggleListening}
                disabled={isTranscribing}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg transition-colors flex-shrink-0 cursor-pointer focus:outline-none",
                  isListening 
                    ? "bg-destructive/10 text-destructive animate-pulse" 
                    : "text-muted-fg hover:text-foreground hover:bg-muted"
                )}
                title={isListening ? t("chat.mic_stop") : t("chat.mic_start")}
                aria-label={isListening ? t("chat.mic_stop") : t("chat.mic_start")}
              >
                {isTranscribing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-trust text-white hover:bg-trust/90 transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </form>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-fg leading-none">
              <AlertTriangle className="w-3.5 h-3.5 text-trust flex-shrink-0" />
              {t("chat.warning")}
            </p>
          </div>
        </div>

        {/* Quick Reference Panel */}
        <div className="bg-card rounded-lg border border-border p-5 flex flex-col justify-between">
          <div>
            {/* Embedded Active AI Sphere visualizer */}
            <div className="w-full h-32 flex items-center justify-center mb-5 border-b border-border pb-5 relative">
              <div className="w-28 h-28 flex items-center justify-center relative bg-background/50 rounded-full border border-border">
                <AnimatedSphere />
                <div className={cn(
                  "absolute inset-0 rounded-full border-2 border-trust/5 pointer-events-none",
                  loading ? "animate-pulse" : ""
                )} />
              </div>
            </div>
            
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-fg mb-3">{t("chat.freq")}</h3>
            <div className="flex flex-col gap-1">
              {QUICK_REFS.map((ref, idx) => (
                <button
                  key={idx}
                  onClick={() => void send(ref.query)}
                  className="quick-ref-btn text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors group cursor-pointer focus:outline-none"
                >
                  <p className="text-sm font-medium text-foreground group-hover:text-trust transition-colors">
                    {ref.title}
                  </p>
                  <p className="text-[11px] text-muted-fg">{ref.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-fg leading-relaxed">
              {t("chat.freq_sub")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
