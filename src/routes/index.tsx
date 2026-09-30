import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStudent } from "@/lib/student-store";
import {
  CloudOff,
  Bot,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Flame,
  ChevronDown,
  Code2,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EdSync — Offline-First Personalized Learning Platform" },
      {
        name: "description",
        content:
          "EdSync is an offline-first learning platform for CBSE, ICSE & State Board students: personalized syllabus, AI tutor, offline textbooks and progress tracking.",
      },
      { property: "og:title", content: "EdSync — Learn Without Limits" },
      {
        property: "og:description",
        content:
          "Personalized syllabus, offline AI tutor, study notes and progress tracking for Classes 6–12.",
      },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  {
    icon: CloudOff,
    title: "100% Offline Functionality",
    desc: "Every textbook, note, syllabus topic, and quiz is cached locally in IndexedDB. Study freely with zero internet.",
    badge: "IndexedDB Vault",
  },
  {
    icon: Bot,
    title: "Academic AI Tutor",
    desc: "Bilingual step-by-step explanations for physics formulas, biology concepts, chemistry equations, and math derivations.",
    badge: "Voice Enabled",
  },
  {
    icon: GraduationCap,
    title: "Curriculum-Aligned Syllabus",
    desc: "Personalized syllabus outlines tailored exclusively for CBSE, ICSE, and State Boards without cross-mixing.",
    badge: "NCERT & State Boards",
  },
  {
    icon: Flame,
    title: "Visual Progress & Streaks",
    desc: "Track daily study hours, chapter mastery, and unlock milestones with interactive charts and streak counters.",
    badge: "Analytics",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Select Class & Board",
    desc: "Choose your standard (Class 6–12), academic board (CBSE/ICSE/State), and enrolled subjects.",
  },
  {
    step: "2",
    title: "Cache Study Material",
    desc: "Save chapters, textbooks, and notes into your local device vault for offline reading.",
  },
  {
    step: "3",
    title: "Study with AI & Track",
    desc: "Ask the AI tutor concepts via voice or text, take chapter quizzes, and track your daily streak.",
  },
];

const FAQS = [
  {
    q: "How does EdSync work without an active internet connection?",
    a: "EdSync uses modern browser Service Workers and client-side IndexedDB caching. Once loaded, your syllabus, textbooks, notes, and study logs remain fully accessible offline.",
  },
  {
    q: "Can I use the AI tutor if I am offline?",
    a: "Yes. When online, EdSync connects to high-speed academic AI. When offline, a built-in educational knowledge fallback engine answers core NCERT concept queries and formulas.",
  },
  {
    q: "Which boards and classes are supported?",
    a: "We support Classes 6 through 12 across CBSE, ICSE, and major State Boards (Maharashtra, Tamil Nadu, Karnataka, Uttar Pradesh, and more).",
  },
  {
    q: "Is my personal study data private?",
    a: "All progress data, notes, and profile settings are stored locally on your device in browser IndexedDB storage.",
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const { hydrated, profile } = useStudent();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (hydrated && profile) void navigate({ to: "/dashboard" });
  }, [hydrated, profile, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* ─── Top Navbar ──────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-primary to-teal-500 font-display text-sm font-extrabold text-primary-foreground shadow-sm shadow-primary/30">
              ES
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                EdSync
              </span>
              <span className="ml-2 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                v2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/auth"
              className="rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground transition hover:bg-muted"
            >
              Sign In
            </Link>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 transition hover:opacity-90"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────────────────── */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Offline-First National Learning Platform</span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.12]">
            Learning Shouldn't Stop <br />
            <span className="bg-gradient-to-r from-primary via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              When The Internet Does.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            EdSync generates a personalized syllabus mapped to your class, board, and subjects — paired with an offline document vault, bilingual voice-enabled AI explanations, and seamless progress tracking.
          </p>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90 hover:scale-[1.01]"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Set Up Student Profile</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-7 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
            >
              <span>Student Login</span>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-5 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> 100% Offline IndexedDB
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> CBSE, ICSE & State Boards
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Bilingual AI Tutor (EN / HI)
            </span>
          </div>

          {/* Clean Dashboard Preview Card */}
          <div className="mt-12 mx-auto max-w-3xl rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-border pb-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-muted-foreground text-[11px]">edsync://portal-preview</span>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 font-bold text-success text-[10px]">
                <Zap className="h-3 w-3" /> Service Worker Active
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>Study Streak</span>
                </div>
                <p className="mt-2 font-display text-xl font-bold">7 Days</p>
                <p className="text-[11px] text-muted-foreground">Logged 120 mins today</p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Syllabus Covered</span>
                </div>
                <p className="mt-2 font-display text-xl font-bold">68%</p>
                <p className="text-[11px] text-muted-foreground">Class 12 CBSE Physics</p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <Bot className="h-4 w-4 text-primary" />
                  <span>AI Academic Tutor</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-foreground truncate">
                  Newton's Laws & Formulas
                </p>
                <p className="text-[11px] text-primary font-medium">Voice Audio Ready</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Core Features ───────────────────────────────────── */}
        <section className="border-t border-border bg-muted/20 px-4 sm:px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Engineered for continuous learning
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                Everything required to prepare, understand, practice, and excel across any academic board.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="surface-card p-5 sm:p-6 transition hover:border-primary/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-base font-bold text-foreground">{item.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── How It Works ────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-16 border-t border-border">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple Workflow</span>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-foreground">
                How EdSync Works
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.step} className="surface-card p-5 relative">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-bold text-sm mb-3">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-foreground">{step.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ Accordion ───────────────────────────────────── */}
        <section className="border-t border-border bg-muted/20 px-4 sm:px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
                <HelpCircle className="h-3.5 w-3.5" /> Common Questions
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.q} className="surface-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-foreground"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border bg-background/50 px-4 sm:px-5 py-3.5 text-xs leading-relaxed text-muted-foreground">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Bottom CTA ──────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-16 border-t border-border">
          <div className="mx-auto max-w-4xl text-center surface-card p-8 sm:p-12 border-primary/30 shadow-xl relative overflow-hidden">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              Ready to begin your academic preparation?
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Set up your student profile in 2 minutes for syllabus tracking, offline textbooks, and AI tutoring.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/onboarding"
                className="rounded-2xl bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:opacity-90"
              >
                Get Started Free
              </Link>
              <Link
                to="/auth"
                className="rounded-2xl border border-border bg-card px-7 py-3 text-sm font-bold text-foreground hover:bg-muted"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Clean Footer ────────────────────────────────────── */}
      <footer className="border-t border-border bg-card/60 py-8 px-4 sm:px-6 text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="font-bold text-foreground text-xs">
              EdSync National Academic Platform
            </span>
          </div>
          <p className="text-center sm:text-left text-[11px]">
            Engineered for students across CBSE, ICSE, and State Boards.
          </p>
          <div className="flex gap-4 font-semibold text-[11px]">
            <Link to="/auth" className="hover:text-primary transition">Login</Link>
            <Link to="/onboarding" className="hover:text-primary transition">Onboarding</Link>
            <Link to="/career" className="hover:text-primary transition">Careers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
