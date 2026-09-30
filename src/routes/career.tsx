import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AppShell } from "@/components/app-shell";
import { askEdSyncAI } from "@/lib/ai";
import { careerPaths } from "@/data/career-paths";
import {
  Compass,
  Search,
  Sparkles,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Career Navigator — EdSync" },
      {
        name: "description",
        content:
          "Explore career fields, skills, projects, salary ranges, exams and higher-study pathways aligned with your subjects.",
      },
      {
        property: "og:title",
        content: "Career Navigator — EdSync",
      },
      {
        property: "og:description",
        content:
          "Explore high-growth career fields, skills, projects and higher-study pathways.",
      },
    ],
  }),
  component: CareerPage,
});

function CareerPage() {
  const [search, setSearch] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);

  const allSubjects = useMemo(() => {
    const subjects = new Set<string>();
    careerPaths.forEach((c) => c.relatedSubjects.forEach((s) => subjects.add(s)));
    return ["all", ...Array.from(subjects)];
  }, []);

  const filteredCareers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return careerPaths.filter((career) => {
      const matchesSubject =
        selectedSubjectFilter === "all" ||
        career.relatedSubjects.includes(selectedSubjectFilter);

      const matchesSearch =
        !query ||
        career.title.toLowerCase().includes(query) ||
        career.description.toLowerCase().includes(query) ||
        career.skills.some((skill) => skill.toLowerCase().includes(query)) ||
        career.relatedSubjects.some((subject) =>
          subject.toLowerCase().includes(query),
        );

      return matchesSubject && matchesSearch;
    });
  }, [search, selectedSubjectFilter]);

  return (
    <AppShell
      title="Career Navigator"
      description="Explore fields, essential skill trees, beginner projects & higher-study roadmaps"
    >
      <div className="space-y-8">
        {/* Hero & Search Banner */}
        <section className="surface-card relative overflow-hidden p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Compass className="h-3.5 w-3.5" /> Future Readiness
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Find the right career pathway
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Discover real-world careers that stem from what you're learning today in Biology, Physics, Mathematics, Chemistry and Computing.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by career, skill (e.g. Python, Genetics)..."
                  className="w-full rounded-xl border border-input bg-background/80 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="rounded-xl border border-input bg-background/80 px-3.5 py-2.5 text-sm font-medium outline-none focus:border-primary"
              >
                {allSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "All Subjects" : s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Career Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold sm:text-xl">
              Career Pathways ({filteredCareers.length})
            </h3>
            <span className="text-xs text-muted-foreground">
              Click any card to expand actionable roadmap
            </span>
          </div>

          {filteredCareers.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <Compass className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-semibold">No matching career paths found.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try searching for another skill or clearing filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredCareers.map((career) => {
                const isExpanded = expandedCareer === career.title;
                return (
                  <article
                    key={career.title}
                    className="surface-card-hover flex flex-col overflow-hidden p-6 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {career.relatedSubjects.map((subject) => (
                            <span
                              key={subject}
                              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                        <h4 className="text-lg font-bold">{career.title}</h4>
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {career.description}
                    </p>

                    {/* Essential Skills */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Core Skill Stack
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {career.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Expandable Section */}
                    {isExpanded ? (
                      <div className="mt-5 space-y-4 border-t border-border pt-4 text-sm animate-in fade-in duration-200">
                        <div>
                          <h5 className="flex items-center gap-1.5 font-semibold text-foreground">
                            <CheckCircle2 className="h-4 w-4 text-success" /> Beginner Action Steps
                          </h5>
                          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground pl-5 list-disc">
                            {career.beginnerSteps.map((step) => (
                              <li key={step}>{step}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="flex items-center gap-1.5 font-semibold text-foreground">
                            <Layers className="h-4 w-4 text-primary" /> Practical Project Ideas
                          </h5>
                          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground pl-5 list-disc">
                            {career.projectIdeas.map((project) => (
                              <li key={project}>{project}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="flex items-center gap-1.5 font-semibold text-foreground">
                            <GraduationCap className="h-4 w-4 text-accent-foreground" /> Higher Study & Degrees
                          </h5>
                          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground pl-5 list-disc">
                            {career.higherStudy.map((study) => (
                              <li key={study}>{study}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCareer(isExpanded ? null : career.title)
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        {isExpanded ? "Show Less" : "View Full Roadmap & Steps"}
                        <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Career AI Advisor Card */}
        <CareerAI />
      </div>
    </AppShell>
  );
}

function CareerAI() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "What skills should I build for Bioinformatics?",
    "Beginner project ideas for Medical Technology?",
    "How to transition from 12th Science to Data Science?",
    "What exams lead to research careers in Physics?",
  ];

  async function askCareerAI(question: string) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;

    setLoading(true);
    setAnswer("");

    const userApiKey =
      typeof window !== "undefined"
        ? localStorage.getItem("edsync_user_groq_api_key") || undefined
        : undefined;

    try {
      const result = await askEdSyncAI({
        data: {
          message: trimmedQuestion,
          context:
            "Student is asking Career AI on EdSync. Explain relevant skills, degrees, exams, and beginner projects clearly with structured bullet points and practical advice.",
          apiKey: userApiKey,
        },
      });

      setAnswer(result.answer || "I have analyzed this career path. Review the roadmap above or ask more specific questions!");
    } catch (error) {
      console.error("Career AI error:", error);
      setAnswer(
        "### Career Guidance Summary 🎓\n\n- **Foundations:** Focus on strong core marks in your key board subjects.\n- **Skills:** Take online courses in relevant software, programming, or laboratory fundamentals.\n- **Projects:** Document all practical work in a portfolio.\n- **Higher Studies:** Track official notifications on NTA, CUET, and relevant university portals.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="surface-card p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold sm:text-xl">Ask Career AI Advisor</h3>
          <p className="text-xs text-muted-foreground">
            Get personalized advice on learning pathways, prerequisites, and higher studies. Powered by Groq AI.
          </p>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setMessage(s);
              void askCareerAI(s);
            }}
            disabled={loading}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-foreground disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void askCareerAI(message);
          }}
          placeholder="e.g. Which bachelor degrees are best for Artificial Intelligence?"
          disabled={loading}
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <button
          type="button"
          onClick={() => void askCareerAI(message)}
          disabled={loading || !message.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Ask AI"}
        </button>
      </div>

      {answer && (
        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-5 leading-relaxed text-sm">
          <div className="mb-3 font-bold text-primary flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Career Advisory
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
              ⚡ Groq AI
            </span>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
            <Markdown remarkPlugins={[remarkGfm]}>{answer}</Markdown>
          </div>
        </div>
      )}
    </section>
  );
}