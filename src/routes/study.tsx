import { PdfReader } from "@/components/pdf-reader";
import {
  getAllOfflineResources,
  getOfflineResource,
} from "@/lib/offline-db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { boardLabel } from "@/data/academics";
import { SYLLABUS_UNAVAILABLE_MESSAGE, getSubjectSyllabus } from "@/data/syllabus";
import { chapterKey, toggleChapterDone, useStudent } from "@/lib/student-store";
import { subjectProgressList } from "@/lib/syllabus-progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/study")({
  head: () => ({
    meta: [
      { title: "Study — EdSync" },
      {
        name: "description",
        content:
          "Work through your personalized syllabus in EdSync: subjects, chapters and topics matched to your class, board and state.",
      },
      { property: "og:title", content: "Study — EdSync" },
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
const [readerResourceId, setReaderResourceId] =
  useState<string | null>(null);

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
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </AppShell>
    );
  }

  const syllabus = subject
    ? getSubjectSyllabus(profile.board, profile.classLevel, profile.state, subject)
    : null;

  return (
    <AppShell
      title="Study"
      description={`Class ${profile.classLevel} · ${boardLabel(profile.board)}${profile.state ? ` · ${profile.state}` : ""}`}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {profile.subjects.map((item) => {
            const stats = progress.find((p) => p.subject === item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSubject(item);
                  setOpenChapter(null);
                }}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  subject === item
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item}
                {stats?.available ? ` · ${stats.percent}%` : ""}
              </button>
            );
          })}
        </div>

        {!syllabus ? (
          <div className="surface-card p-6">
            <h2 className="text-base font-semibold">{subject}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{SYLLABUS_UNAVAILABLE_MESSAGE}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              EdSync will not show another board's syllabus in its place.
            </p>
          </div>
        ) : (
          <>
            <div className="surface-card flex flex-wrap items-center justify-between gap-3 p-4 text-xs text-muted-foreground">
              <span className="min-w-0">
                Source: {syllabus.sourceName} · last verified {syllabus.lastVerified}
              </span>
              <a
                href={syllabus.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 font-medium text-primary hover:underline"
              >
                View source <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="space-y-2">
              {syllabus.chapters.map((chapter) => {
                const key = chapterKey(syllabus.subject, chapter.id);
                const done = study.completedChapters.includes(key);
                const open = openChapter === chapter.id;
                return (
                  <div key={chapter.id} className="surface-card overflow-hidden">
                    <div className="flex items-start gap-3 p-4">
                      <button
                        type="button"
                        aria-label={done ? "Mark chapter as not done" : "Mark chapter as done"}
                        aria-pressed={done}
                        onClick={() => {
                          toggleChapterDone(syllabus.subject, chapter.id);
                          refresh();
                        }}
                        className={cn(
                          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors",
                          done
                            ? "border-success bg-success text-success-foreground"
                            : "border-border text-transparent hover:border-primary",
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenChapter(open ? null : chapter.id)}
                        className="flex min-w-0 flex-1 items-start justify-between gap-3 text-left"
                      >
                        <span className="min-w-0">
                          <span className="block text-xs text-muted-foreground">
                            Chapter {chapter.number}
                          </span>
                          <span className="block text-sm font-medium">{chapter.title}</span>
                        </span>
                        {chapter.topics.length > 0 && (
                          <ChevronDown
                            className={cn(
                              "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                              open && "rotate-180",
                            )}
                          />
                        )}
                      </button>
                    </div>
                    {open && chapter.topics.length > 0 && (
                      <ul className="border-t border-border bg-muted/40 px-4 py-3 pl-12">
                        {chapter.topics.map((topic) => (
                          <li key={topic.id} className="py-1 text-sm text-muted-foreground">
                            {topic.title}
                          </li>
                        ))}
                      </ul>
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
