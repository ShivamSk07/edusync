import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState, useEffect, useRef } from "react";
import { askEdSyncAI } from "@/lib/ai";
import { AppShell } from "@/components/app-shell";
import {
  Bot,
  Send,
  Trash2,
  Copy,
  Check,
  BookOpen,
  Atom,
  Dna,
  Calculator,
  Compass,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  FileCode,
  Zap,
  Key,
  Settings,
  ExternalLink,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useStudent } from "@/lib/student-store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/ai-study-buddy")({
  head: () => ({
    meta: [
      { title: "Academic AI Tutor — EdSync" },
      {
        name: "description",
        content:
          "Official Academic AI Tutor for CBSE, ICSE and State Board students. Voice input, bilingual audio answers, step-by-step NCERT formula derivations.",
      },
      { property: "og:title", content: "Academic AI Tutor — EdSync" },
      {
        property: "og:description",
        content: "Curriculum-aligned academic assistant with voice input and audio explanations in English & Hindi.",
      },
    ],
  }),
  component: AIStudyBuddy,
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  lang?: "en" | "hi";
  modelUsed?: string;
  isOffline?: boolean;
};

const ACADEMIC_PROMPTS = [
  {
    icon: Atom,
    subject: "Physics",
    title: "Newton's Laws & Mechanics",
    prompt: "Explain Newton's 3 Laws of Motion with derivations, real-world examples, and Free Body Diagram (FBD) rules.",
  },
  {
    icon: Dna,
    subject: "Biology",
    title: "Cell Division & Genetics",
    prompt: "Compare Mitosis and Meiosis phases with key differences and chromosomal behavior for board exams.",
  },
  {
    icon: Calculator,
    subject: "Mathematics",
    title: "Calculus & Trigonometry",
    prompt: "Provide essential standard differentiation rules, product rule, chain rule, and key trigonometric identities.",
  },
  {
    icon: BookOpen,
    subject: "Chemistry",
    title: "Chemical Equilibrium & Thermodynamics",
    prompt: "Explain Le Chatelier's Principle and factors affecting chemical equilibrium with standard examples.",
  },
];

// Clean text for speech synthesis (strip markdown syntax)
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\$[^$]*\$/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[•\-_]/g, " ")
    .trim();
}

function AIStudyBuddy() {
  const { profile } = useStudent();
  const { t, language } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi">(
    language === "hi" ? "hi" : "en"
  );
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [customKey, setCustomKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInputDraft, setKeyInputDraft] = useState("");
  const [activeModelName, setActiveModelName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("edsync_user_groq_api_key") || "";
      setCustomKey(stored);
      setKeyInputDraft(stored);
    }
  }, []);

  // Sync with global i18n
  useEffect(() => {
    if (language === "hi") setSelectedLanguage("hi");
    else setSelectedLanguage("en");
  }, [language]);

  // Auto scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle external "edsync:ask-ai" custom events from PDF reader
  useEffect(() => {
    function handleAskAI(event: Event) {
      const customEvent = event as CustomEvent<{ text: string }>;
      const text = customEvent.detail?.text;
      if (!text) return;

      const userPrompt = `Explain this selected text from my syllabus curriculum:\n\n"${text}"`;
      setInput(userPrompt);
      toast.info("Selected curriculum text loaded into Academic AI Tutor.");
    }

    window.addEventListener("edsync:ask-ai", handleAskAI);
    return () => {
      window.removeEventListener("edsync:ask-ai", handleAskAI);
    };
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Speech-to-Text (Voice Recognition)
  function toggleVoiceInput() {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice recognition requires Chrome, Edge, or a Web Speech-compatible browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage === "hi" ? "hi-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info(
          selectedLanguage === "hi"
            ? "माइक सक्रिय है... कृपया अपना प्रश्न बोलें।"
            : "Microphone active... Please speak your question."
        );
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          toast.success("Voice transcribed into question box.");
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error !== "no-speech") {
          toast.error("Microphone permission required for voice input.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition startup error:", err);
      setIsListening(false);
    }
  }

  // Text-to-Speech (Audio Voice Answer Playback)
  function handleSpeak(text: string, msgId: string, lang: "en" | "hi") {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Audio playback is not supported in this browser.");
      return;
    }

    if (currentlySpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Auto-detect Hindi script or Hinglish
    const hasDevanagari = /[\u0900-\u097F]/.test(cleanText);
    utterance.lang = hasDevanagari || lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best available voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const match = voices.find(
        (v) =>
          v.lang.toLowerCase().includes(utterance.lang.toLowerCase()) ||
          v.name.toLowerCase().includes("india") ||
          v.name.toLowerCase().includes("hindi")
      );
      if (match) utterance.voice = match;
    }

    utterance.onstart = () => {
      setCurrentlySpeakingId(msgId);
    };

    utterance.onend = () => {
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(textToSend?: string) {
    const userMessage = (textToSend ?? input).trim();
    if (!userMessage || loading) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
    }

    setInput("");

    const newMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    const studentContext = profile
      ? `Student: ${profile.name}, Class ${profile.classLevel}, Board: ${profile.board.toUpperCase()}, Subjects: ${profile.subjects.join(", ")}`
      : "Student using EdSync academic portal.";

    const apiKeyToSend = customKey.trim() || undefined;

    try {
      const result = await askEdSyncAI({
        data: {
          message: userMessage,
          context: studentContext,
          lang: selectedLanguage,
          apiKey: apiKeyToSend,
        },
      });

      if (result.modelUsed) {
        setActiveModelName(result.modelUsed);
      }

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          result.answer ||
          "I am ready to assist your academic studies. Please specify your question or topic.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        lang: selectedLanguage,
        modelUsed: result.modelUsed,
        isOffline: result.isOffline,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Academic AI Tutor error:", error);
      const fallbackMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "> 📚 *[Offline Reference Mode] AI connection unavailable. Displaying verified curriculum notes:*\n\n### Official Academic Guidance\n\n- Refer to the foundational definitions in your NCERT/State Board prescribed chapter.\n- Note the governing physical laws, biological mechanisms, or mathematical formulas.\n- Review previous year exam question patterns.\n\n*Your offline database resources are also available in the Offline Vault.*",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        lang: selectedLanguage,
        isOffline: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function copyToClipboard(text: string, id: string) {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Explanation copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  }

  function clearChat() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
    }
    setMessages([]);
    toast.success("Academic tutoring session cleared.");
  }

  return (
    <AppShell
      title={t("ai.title", "Academic AI Tutor")}
      description={t(
        "ai.subtitle",
        "Curriculum-aligned explanations, formula derivations & multilingual voice assistance"
      )}
    >
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Top Control Bar */}
        <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-foreground sm:text-lg">
                  {t("ai.title", "EdSync Academic AI Tutor")}
                </h2>
                <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  <ShieldCheck className="h-3 w-3" /> NCERT Aligned
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Voice enabled · Bilingual explanations (EN / HI) · Step-by-step reasoning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex rounded-xl border border-border bg-background p-0.5">
              <button
                type="button"
                onClick={() => setSelectedLanguage("en")}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  selectedLanguage === "en"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage("hi")}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  selectedLanguage === "hi"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* AI Engine Settings */}
            <button
              type="button"
              onClick={() => {
                setKeyInputDraft(customKey);
                setShowKeyModal(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground transition shadow-2xs"
              title="Groq AI Engine Settings"
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden md:inline">
                {customKey ? "Custom Groq Key" : "Groq AI Active"}
              </span>
            </button>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("ai.clear_chat", "Clear")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Academic Discussion Window */}
        <div className="surface-card flex min-h-[500px] flex-col overflow-hidden shadow-md">
          <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-lg sm:text-xl font-bold text-foreground">
                  {selectedLanguage === "hi"
                    ? "शैक्षणिक संशय एवं सूत्र समाधान"
                    : "Official Academic Study Assistance"}
                </h3>
                <p className="mt-1.5 max-w-md text-xs sm:text-sm text-muted-foreground">
                  {selectedLanguage === "hi"
                    ? "माइक दबाकर बोलें या नीचे दिए गए किसी विषय पर क्लिक करें।"
                    : "Speak using voice input or type any concept, derivation, or NCERT question."}
                </p>

                {/* Preset Academic Topic Cards */}
                <div className="mt-6 grid w-full max-w-2xl gap-3 sm:grid-cols-2 text-left">
                  {ACADEMIC_PROMPTS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => void sendMessage(item.prompt)}
                        className="rounded-2xl border border-border/80 bg-background/60 p-4 text-left transition hover:border-primary/50 hover:bg-muted/30 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                            <Icon className="h-3.5 w-3.5" />
                            {item.subject}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary">
                            Ask ↵
                          </span>
                        </div>
                        <h4 className="mt-2 text-xs sm:text-sm font-bold text-foreground group-hover:text-primary">
                          {item.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {item.prompt}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isSpeaking = currentlySpeakingId === message.id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`relative max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-xs font-medium"
                          : "surface-card rounded-tl-xs border border-border"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2 text-xs text-muted-foreground">
                          <div className="flex flex-wrap items-center gap-1.5 font-bold text-primary">
                            <Bot className="h-3.5 w-3.5" />
                            <span>EdSync Academic Tutor</span>
                            {message.modelUsed && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide ${
                                  message.isOffline
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                    : "bg-primary/10 text-primary border border-primary/20"
                                }`}
                              >
                                {message.isOffline
                                  ? "Offline Curriculum Note"
                                  : `⚡ Groq (${message.modelUsed.replace("openai/", "").replace("qwen/", "").replace("meta-llama/", "")})`}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Text to Speech Voice Reader */}
                            <button
                              type="button"
                              onClick={() =>
                                handleSpeak(
                                  message.content,
                                  message.id,
                                  message.lang || selectedLanguage
                                )
                              }
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                                isSpeaking
                                  ? "bg-primary text-primary-foreground animate-pulse"
                                  : "border border-border bg-background hover:bg-muted text-foreground"
                              }`}
                              title={t("ai.listen_answer", "Listen to audio response")}
                            >
                              {isSpeaking ? (
                                <>
                                  <VolumeX className="h-3 w-3" />
                                  <span>{t("ai.stop_audio", "Stop Audio")}</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3 w-3 text-primary" />
                                  <span>
                                    {selectedLanguage === "hi"
                                      ? "ऑडियो सुनें (Voice)"
                                      : "Listen (Voice)"}
                                  </span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => copyToClipboard(message.content, message.id)}
                              aria-label="Copy explanation"
                              className="rounded-lg p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                              title={t("ai.copy", "Copy explanation")}
                            >
                              {copiedId === message.id ? (
                                <Check className="h-3.5 w-3.5 text-success" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {message.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
                          <Markdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              strong: ({ children }) => (
                                <strong className="font-bold text-foreground">{children}</strong>
                              ),
                              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                              ul: ({ children }) => (
                                <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
                              ),
                              li: ({ children }) => <li className="leading-normal">{children}</li>,
                              h1: ({ children }) => (
                                <h1 className="mb-3 mt-4 font-display text-xl font-bold first:mt-0 text-foreground">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="mb-2 mt-3 font-display text-lg font-bold first:mt-0 text-foreground">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="mb-2 mt-3 font-display text-base font-semibold first:mt-0 text-foreground">
                                  {children}
                                </h3>
                              ),
                              table: ({ children }) => (
                                <div className="my-3 overflow-x-auto rounded-xl border border-border">
                                  <table className="w-full border-collapse text-sm">{children}</table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border-b border-border bg-muted/60 px-3 py-2 text-left font-semibold">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border-b border-border px-3 py-2 align-top last:border-b-0">
                                  {children}
                                </td>
                              ),
                              code: ({ children }) => (
                                <code className="rounded bg-muted/80 px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="my-3 overflow-x-auto rounded-xl bg-slate-950 p-3.5 font-mono text-xs text-slate-100 dark:bg-black/60">
                                  {children}
                                </pre>
                              ),
                            }}
                          >
                            {message.content}
                          </Markdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="surface-card flex items-center gap-3 rounded-2xl rounded-tl-xs border border-border px-4 py-3 shadow-xs">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                  <span className="text-xs font-bold text-muted-foreground">
                    {t("ai.thinking", "Preparing curriculum explanation...")}
                  </span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Form & Input Controls with Voice Recognition */}
          <form onSubmit={handleSubmit} className="border-t border-border bg-card/60 p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={
                    selectedLanguage === "hi"
                      ? "हिंदी या अंग्रेजी में कोई भी शैक्षणिक प्रश्न पूछें..."
                      : "Ask about formulas, derivations, concepts, or speak your question..."
                  }
                  disabled={loading}
                  className="w-full rounded-xl border border-input bg-background py-3 pl-4 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {/* Voice Input Microphone Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 transition ${
                    isListening
                      ? "bg-destructive text-destructive-foreground animate-pulse"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  }`}
                  title={
                    isListening
                      ? "Listening... click to stop"
                      : "Voice input (Speak in English or Hindi)"
                  }
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">{t("ai.ask_button", "Ask")}</span>
              </button>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
              <span>
                {isListening
                  ? "🎙️ Listening... Speak clearly into your microphone."
                  : "Microphone for speech input · Audio speaker icon on answers for voice playback (EN/HI)."}
              </span>
              <span className="font-semibold">Press Enter to submit</span>
            </div>
          </form>
        </div>

        {/* Groq AI Settings Modal */}
        {showKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="surface-card w-full max-w-md rounded-2xl border border-border p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Groq AI Engine Settings</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Powered by ultra-fast Groq Llama 3 / Qwen inference
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Engine Status:</span>
                    <span className="font-bold text-success flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      Active & Connected
                    </span>
                  </div>
                  {activeModelName && (
                    <div className="mt-2 flex items-center justify-between text-muted-foreground">
                      <span>Active Model:</span>
                      <span className="font-mono font-medium text-foreground">
                        {activeModelName}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Custom Groq API Key (Optional)
                  </label>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    EdSync provides a shared key by default. You can also paste your personal free API key from Groq Console.
                  </p>
                  <input
                    type="password"
                    value={keyInputDraft}
                    onChange={(e) => setKeyInputDraft(e.target.value)}
                    placeholder="gsk_..."
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 font-mono text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                  >
                    <span>Get free Groq key</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    {customKey && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("edsync_user_groq_api_key");
                          setCustomKey("");
                          setKeyInputDraft("");
                          toast.success("Switched back to system default Groq key.");
                          setShowKeyModal(false);
                        }}
                        className="rounded-xl border border-border px-3 py-1.5 font-semibold text-muted-foreground hover:bg-muted text-xs"
                      >
                        Reset Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = keyInputDraft.trim();
                        if (trimmed) {
                          localStorage.setItem("edsync_user_groq_api_key", trimmed);
                          setCustomKey(trimmed);
                          toast.success("Custom Groq API key saved successfully! 🚀");
                        } else {
                          localStorage.removeItem("edsync_user_groq_api_key");
                          setCustomKey("");
                        }
                        setShowKeyModal(false);
                      }}
                      className="rounded-xl bg-primary px-4 py-1.5 font-bold text-primary-foreground hover:opacity-90 transition text-xs shadow-xs"
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}