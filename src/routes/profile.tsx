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
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { User, Shield, Moon, Sun, Monitor, Trash2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Student Profile & Settings — EdSync" },
      {
        name: "description",
        content:
          "Update your EdSync academic profile — class, board, state, school and subjects — and customize application preferences.",
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
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const THEME_OPTIONS: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function ProfilePage() {
  const navigate = useNavigate();
  const { hydrated, profile } = useStudent();
  const { theme, setTheme } = useTheme();
  const { currentLangObj, openLanguageModal } = useI18n();

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
        <div className="h-48 animate-pulse rounded-2xl bg-muted/60" />
      </AppShell>
    );
  }

  const needsState = draft.board === "state";

  function save() {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (needsState && !draft.state) {
      toast.error("Please select your state.");
      return;
    }
    if (draft.subjects.length === 0) {
      toast.error("Select at least one subject.");
      return;
    }

    saveProfile({
      name: draft.name.trim(),
      classLevel: draft.classLevel,
      board: draft.board,
      state: needsState ? draft.state : null,
      school: draft.school.trim(),
      subjects: draft.subjects,
      createdAt: profile ? profile.createdAt : new Date().toISOString(),
    });

    toast.success("Profile saved — your syllabus has been updated! 🎉");
  }

  return (
    <AppShell
      title="Profile & Settings"
      description={`Class ${profile.classLevel} · ${boardLabel(profile.board)}`}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Academic Profile Edit Form */}
        <section className="surface-card space-y-5 p-6 sm:p-8">
          <div className="border-b border-border pb-4">
            <h3 className="font-display text-lg font-bold">Academic Profile</h3>
            <p className="text-xs text-muted-foreground">
              EdSync matches your syllabus strictly according to these details.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Full Name
            </label>
            <input
              className={cn(inputClass, "mt-1.5")}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Class / Grade
              </label>
              <select
                className={cn(inputClass, "mt-1.5")}
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
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Board
              </label>
              <select
                className={cn(inputClass, "mt-1.5")}
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
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                State
              </label>
              <select
                className={cn(inputClass, "mt-1.5")}
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
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              School / College Name
            </label>
            <input
              className={cn(inputClass, "mt-1.5")}
              value={draft.school}
              onChange={(e) => setDraft({ ...draft, school: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Enrolled Subjects
            </label>
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
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={save}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Save Profile Changes
            </button>
          </div>
        </section>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Appearance Settings */}
          <section className="surface-card p-6">
            <h4 className="font-display text-base font-bold">Theme Appearance</h4>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-semibold transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4 mb-1.5" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Language Selection Setting */}
          <section className="surface-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-base font-bold">Language Preferences</h4>
                <p className="text-xs text-muted-foreground">Select preferred Indian language</p>
              </div>
              <button
                type="button"
                onClick={openLanguageModal}
                className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition"
              >
                Change Language
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-background p-3 text-xs font-semibold">
              <span className="text-muted-foreground">Active Language:</span>
              <span className="font-bold text-primary">{currentLangObj?.nativeName ?? "English"} ({currentLangObj?.name ?? "English"})</span>
            </div>
          </section>

          {/* Device Cache & Storage */}
          <section className="surface-card p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h4 className="font-display text-base font-bold">Local Device Storage</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              All syllabus progress, chapter logs and offline textbooks are stored securely on this browser instance.
            </p>
            <button
              type="button"
              onClick={() => {
                resetAll();
                toast.success("Local student storage cleared.");
                void navigate({ to: "/" });
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs font-bold text-destructive transition hover:bg-destructive/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Local Data</span>
            </button>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
