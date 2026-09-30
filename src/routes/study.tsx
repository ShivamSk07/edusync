import { PdfReader } from "@/components/pdf-reader";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  ExternalLink,
  Bot,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileQuestion,
  StickyNote,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { boardLabel } from "@/data/academics";
import { SYLLABUS_UNAVAILABLE_MESSAGE, getSubjectSyllabus } from "@/data/syllabus";
import { chapterKey, toggleChapterDone, useStudent } from "@/lib/student-store";
import { subjectProgressList } from "@/lib/syllabus-progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/study")({
  head: () => ({
    meta: [
      { title: "Study & Syllabus — EdSync" },
      {
        name: "description",
        content:
          "Work through your personalized syllabus in EdSync: subjects, chapters and topics matched to your class, board and state.",
      },
      { property: "og:title", content: "Study & Syllabus — EdSync" },
      {
        property: "og:description",
        content: "Your personalized syllabus, chapter by chapter, with progress you can mark as you go.",
      },
    ],
  }),
  component: Study,
});

function Study() {
  const navigate = useNavigate();
  const { hydrated, profile, study, refresh } = useStudent();
  const [subject, setSubject] = useState<string | null>(null);
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const [readerResourceId, setReaderResourceId] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && !profile) void navigate({ to: "/onboarding" });
  }, [hydrated, profile, navigate]);

  useEffect(() => {
    if (profile && !subject) setSubject(profile.subjects[0] ?? null);
  }, [profile, subject]);

  const progress = useMemo(
    () => (profile ? subjectProgressList(profile, study) : []),
    [profile, study],
  );

  if (readerResourceId) {
    return (
      <PdfReader
        resourceId={readerResourceId}
        onClose={() => setReaderResourceId(null)}
      />
    );
  }

  if (!hydrated || !profile) {
    return (
      <AppShell title="Study">
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      </AppShell>
    );
  }

  const syllabus = subject
    ? getSubjectSyllabus(profile.board, profile.classLevel, profile.state, subject)
    : null;

  const currentSubjectStats = progress.find((p) => p.subject === subject);

  return (
    <AppShell
      title="Personalized Syllabus"
      description={`Class ${profile.classLevel} · ${boardLabel(profile.board)}${profile.state ? ` · ${profile.state}` : ""}`}
    >
      <div className="space-y-6">
        {/* Subject Pills */}
        <div className="flex flex-wrap gap-2">
          {profile.subjects.map((item) => {
            const stats = progress.find((p) => p.subject === item);
            const isSelected = subject === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSubject(item);
                  setOpenChapter(null);
                }}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-150 flex items-center gap-1.5",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span>{item}</span>
                {stats?.available && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[11px]",
                      isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {stats.percent}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!syllabus ? (
          <div className="surface-card p-8 text-center max-w-lg mx-auto">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-3 text-lg font-bold">{subject} Syllabus</h3>
            <p className="mt-2 text-sm text-muted-foreground">{SYLLABUS_UNAVAILABLE_MESSAGE}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              EdSync delivers verified syllabus outlines only.
            </p>
          </div>
        ) : (
          <>
            {/* Subject Overview Card */}
            <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{syllabus.subject}</h2>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    {syllabus.chapters.length} Chapters
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Source: {syllabus.sourceName} · Verified curriculum
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={syllabus.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition"
                >
                  <span>Official Source</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>

                <Link
                  to="/ai-study-buddy"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition shadow-xs"
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>Ask AI for {syllabus.subject}</span>
                </Link>
              </div>
            </div>

            {/* Chapters List */}
            <div className="space-y-3">
              {syllabus.chapters.map((chapter) => {
                const key = chapterKey(syllabus.subject, chapter.id);
                const done = study.completedChapters.includes(key);
                const open = openChapter === chapter.id;

                return (
                  <div
                    key={chapter.id}
                    className={`surface-card overflow-hidden transition-all ${
                      done ? "border-success/40 bg-success/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 p-4 sm:p-5">
                      <button
                        type="button"
                        aria-label={done ? "Mark chapter as not completed" : "Mark chapter as completed"}
                        aria-pressed={done}
                        onClick={() => {
                          toggleChapterDone(syllabus.subject, chapter.id);
                          refresh();
                          if (!done) {
                            toast.success(`Completed "${chapter.title}"! 🎉`);
                          }
                        }}
                        className={cn(
                          "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-all",
                          done
                            ? "border-success bg-success text-success-foreground shadow-xs"
                            : "border-border bg-card text-transparent hover:border-primary",
                        )}
                      >
                        <Check className="h-4 w-4 stroke-[3]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpenChapter(open ? null : chapter.id)}
                        className="flex min-w-0 flex-1 items-start justify-between gap-3 text-left"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Chapter {chapter.number}
                          </span>
                          <h4
                            className={cn(
                              "text-base font-bold text-foreground transition-colors",
                              done && "line-through text-muted-foreground",
                            )}
                          >
                            {chapter.title}
                          </h4>
                        </div>

                        {chapter.topics.length > 0 && (
                          <ChevronDown
                            className={cn(
                              "mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                              open && "rotate-180 text-primary",
                            )}
                          />
                        )}
                      </button>
                    </div>

                    {/* Expandable Topic Outline & Practice */}
                    {open && (
                      <div className="border-t border-border bg-muted/30 px-5 py-4 text-sm animate-in fade-in duration-150">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Key Chapter Topics ({chapter.topics.length})
                          </span>
                          <Link
                            to="/ai-study-buddy"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>Explain this Chapter with AI</span>
                          </Link>
                        </div>

                        {chapter.topics.length > 0 ? (
                          <ul className="grid gap-2 sm:grid-cols-2 text-xs">
                            {chapter.topics.map((topic) => (
                              <li
                                key={topic.id}
                                className="flex items-center gap-2 rounded-lg border border-border/60 bg-card p-2.5 text-muted-foreground"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                <span className="truncate text-foreground font-medium">{topic.title}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground">Detailed subtopics overview.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
