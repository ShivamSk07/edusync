import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CloudOff, Download, GraduationCap, RefreshCw, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { DEMO_PROFILE, saveProfile, useStudent } from "@/lib/student-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EdSync — learning that keeps working offline" },
      {
        name: "description",
        content:
          "EdSync is an offline-first learning app: download your syllabus and resources, study without internet, and sync your progress when you reconnect.",
      },
      { property: "og:title", content: "EdSync — learning that keeps working offline" },
      {
        property: "og:description",
        content:
          "Personalized syllabus, offline lessons, notes, quizzes and progress tracking for students with unreliable connectivity.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { icon: Download, title: "Download", body: "Save lessons, PDFs and quizzes while you have a connection." },
  { icon: CloudOff, title: "Learn offline", body: "Keep reading, practising and taking notes with no internet." },
  { icon: RefreshCw, title: "Sync", body: "Your progress uploads when the connection comes back." },
];

function Landing() {
  const navigate = useNavigate();
  const { hydrated, profile } = useStudent();

  useEffect(() => {
    if (hydrated && profile) void navigate({ to: "/dashboard" });
  }, [hydrated, profile, navigate]);

  function startDemo() {
    saveProfile({ ...DEMO_PROFILE, createdAt: new Date().toISOString() });
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <span className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
            ES
          </span>
          <span className="font-display text-lg font-semibold">EdSync</span>
        </span>
        <Link
          to="/onboarding"
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Get started
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20">
        <section className="pt-8 sm:pt-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Offline-first learning
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl leading-tight font-semibold sm:text-5xl">
            Learning shouldn't stop when the internet does.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            EdSync builds a study plan around your class, board and subjects — then keeps it
            working when your connection doesn't.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <GraduationCap className="h-4 w-4" /> Set up my profile
            </Link>
            <button
              type="button"
              onClick={startDemo}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Explore demo mode
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Demo mode uses clearly labelled sample data for a Class 12 CBSE student.
          </p>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="surface-card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold">{title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
