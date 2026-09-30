import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import {
  BOARD_OPTIONS,
  CLASS_OPTIONS,
  STATE_OPTIONS,
  boardLabel,
  subjectOptionsFor,
  type BoardId,
  type ClassLevel,
} from "@/data/academics";
import { resetAll, saveProfile, useStudent } from "@/lib/student-store";
import { useTheme, type ThemeChoice } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — EdSync" },
      {
        name: "description",
        content:
          "Update your EdSync academic profile — class, board, state, school and subjects — and choose your light or dark theme.",
      },
      { property: "og:title", content: "Profile — EdSync" },
      {
        property: "og:description",
        content: "Edit your academic profile and appearance settings in EdSync.",
      },
    ],
  }),
  component: ProfilePage,
});

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

const THEME_OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function ProfilePage() {
  const navigate = useNavigate();
  const { hydrated, profile } = useStudent();
  const { theme, setTheme } = useTheme();

  const [draft, setDraft] = useState<{
    name: string;
    classLevel: ClassLevel;
    board: BoardId;
    state: string;
    school: string;
    subjects: string[];
  } | null>(null);

  useEffect(() => {
    if (hydrated && !profile) void navigate({ to: "/onboarding" });
    if (profile && !draft) {
      setDraft({
        name: profile.name,
        classLevel: profile.classLevel,
        board: profile.board,
        state: profile.state ?? "",
        school: profile.school,
        subjects: profile.subjects,
      });
    }
  }, [hydrated, profile, draft, navigate]);

  if (!hydrated || !profile || !draft) {
    return (
      <AppShell title="Profile">
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </AppShell>
    );
  }

  const needsState = draft.board === "state";

  function save() {
    if (!draft.name.trim()) return toast.error("Please enter your name.");
    if (needsState && !draft.state) return toast.error("Please select your state.");
    if (draft.subjects.length === 0) return toast.error("Select at least one subject.");
    saveProfile({
      ...profile,
      name: draft.name.trim(),
      classLevel: draft.classLevel,
      board: draft.board,
      state: needsState ? draft.state : null,
      school: draft.school.trim(),
      subjects: draft.subjects,
    });
    toast.success("Profile updated — your syllabus now matches these details.");
  }

  return (
    <AppShell title="Profile" description={`Class ${profile.classLevel} · ${boardLabel(profile.board)}`}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="surface-card space-y-5 p-5">
          <h2 className="text-base font-semibold">Academic profile</h2>

          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              className={cn(inputClass, "mt-2")}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Class</label>
              <select
                className={cn(inputClass, "mt-2")}
                value={draft.classLevel}
                onChange={(e) =>
                  setDraft({ ...draft, classLevel: e.target.value as ClassLevel, subjects: [] })
                }
              >
                {CLASS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    Class {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Board</label>
              <select
                className={cn(inputClass, "mt-2")}
                value={draft.board}
                onChange={(e) => setDraft({ ...draft, board: e.target.value as BoardId })}
              >
                {BOARD_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {needsState && (
            <div>
              <label className="text-sm font-medium">State</label>
              <select
                className={cn(inputClass, "mt-2")}
                value={draft.state}
                onChange={(e) => setDraft({ ...draft, state: e.target.value })}
              >
                <option value="">Select your state</option>
                {STATE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">School / College</label>
            <input
              className={cn(inputClass, "mt-2")}
              value={draft.school}
              onChange={(e) => setDraft({ ...draft, school: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Subjects</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {subjectOptionsFor(draft.classLevel).map((subject) => {
                const active = draft.subjects.includes(subject);
                return (
                  <button
                    key={subject}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        subjects: active
                          ? draft.subjects.filter((s) => s !== subject)
                          : [...draft.subjects, subject],
                      })
                    }
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Save profile
          </button>
        </section>

        <div className="space-y-5">
          <section className="surface-card p-5">
            <h2 className="text-base font-semibold">Appearance</h2>
            <div className="mt-3 flex gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    theme === option.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Your choice is remembered on this device.
            </p>
          </section>

          <section className="surface-card p-5">
            <h2 className="text-base font-semibold">Storage</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your profile and chapter progress are stored on this device. Offline downloads and
              syncing arrive in the next build phase.
            </p>
            <button
              type="button"
              onClick={() => {
                resetAll();
                toast.success("Local EdSync data cleared.");
                void navigate({ to: "/" });
              }}
              className="mt-4 w-full rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              {profile.isDemo ? "Reset demo data" : "Clear my local data"}
            </button>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
