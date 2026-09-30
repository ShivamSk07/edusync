import { createStudentProfile } from "@/lib/student-profile";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BOARD_OPTIONS,
  CLASS_OPTIONS,
  STATE_OPTIONS,
  subjectOptionsFor,
  type BoardId,
  type ClassLevel,
} from "@/data/academics";
import { saveProfile, useStudent } from "@/lib/student-store";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight, User, BookOpen, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set Up Your Academic Profile — EdSync" },
      {
        name: "description",
        content:
          "Configure your class, board, state and subjects so your syllabus and study plan match what you actually study.",
      },
      { property: "og:title", content: "Set Up Your Academic Profile — EdSync" },
      {
        property: "og:description",
        content: "Class, board, state and subjects — the basis of your personalized EdSync syllabus.",
      },
    ],
  }),
  component: Onboarding,
});

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-xs"
          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

import { useI18n, type SupportedLanguage } from "@/lib/i18n";

function Onboarding() {
  const navigate = useNavigate();
  const { profile } = useStudent();
  const { language, setLanguage } = useI18n();

  const [name, setName] = useState(profile?.name ?? "");
  const [classLevel, setClassLevel] = useState<ClassLevel | null>(
    profile?.classLevel ?? "12",
  );
  const [board, setBoard] = useState<BoardId | null>(profile?.board ?? "cbse");
  const [state, setState] = useState<string>(profile?.state ?? "");
  const [school, setSchool] = useState(profile?.school ?? "");
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language || "en");
  const [subjects, setSubjects] = useState<string[]>(
    profile?.subjects ?? ["Physics", "Chemistry", "Mathematics", "English Core"],
  );
  const [loading, setLoading] = useState(false);

  const needsState = board === "state";
  const subjectOptions = useMemo(
    () => (classLevel ? subjectOptionsFor(classLevel) : []),
    [classLevel],
  );

  function toggleSubject(subject: string) {
    setSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name.");
    if (!classLevel) return toast.error("Please select your class.");
    if (!board) return toast.error("Please select your board.");
    if (needsState && !state) return toast.error("Please select your state.");
    if (subjects.length === 0) return toast.error("Please select at least one subject.");

    setLoading(true);

    // Save language preference
    setLanguage(selectedLang);

    // Save locally first for instant offline responsiveness
    saveProfile({
      name: name.trim(),
      classLevel,
      board,
      state: needsState ? state : null,
      school: school.trim(),
      subjects,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
    });

    try {
      await createStudentProfile({
        data: {
          name: name.trim(),
          classLevel,
          board,
          state: needsState ? state : null,
          schoolName: school.trim(),
          subjects,
        },
      });
    } catch {
      // Offline / unconfigured remote server - graceful fallback
    }

    setLoading(false);
    toast.success("Academic profile created successfully! 🎉");
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-2xl">
        <div className="text-center sm:text-left mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
            <GraduationCap className="h-4 w-4" /> Personalized Learning Setup
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            Set up your academic profile
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            EdSync creates a custom syllabus strictly matching your actual board and chosen subjects.
          </p>
        </div>

        <div className="surface-card space-y-6 p-6 sm:p-8 shadow-xl">
          <Field label="Full Name">
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aditi Sharma"
              autoComplete="name"
              required
            />
          </Field>

          <Field label="Class / Standard">
            <div className="flex flex-wrap gap-2">
              {CLASS_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  active={classLevel === option}
                  onClick={() => {
                    setClassLevel(option);
                    setSubjects([]);
                  }}
                >
                  Class {option}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="Educational Board">
            <div className="flex flex-wrap gap-2">
              {BOARD_OPTIONS.map((option) => (
                <Chip key={option.id} active={board === option.id} onClick={() => setBoard(option.id)}>
                  {option.label}
                </Chip>
              ))}
            </div>
          </Field>

          {needsState && (
            <Field label="State" hint="Required to match your specific State Board curriculum.">
              <select className={inputClass} value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Select your state</option>
                {STATE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="School / College (Optional)">
            <input
              className={inputClass}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g. Kendriya Vidyalaya / Model School"
            />
          </Field>

          <Field label="Preferred Learning & Voice Language" hint="All syllabus, AI explanations & audio answers will adapt to this language.">
            <div className="flex flex-wrap gap-2">
              {[
                { code: "en", name: "English" },
                { code: "hi", name: "हिन्दी (Hindi)" },
                { code: "mr", name: "मराठी (Marathi)" },
                { code: "bn", name: "বাংলা (Bengali)" },
                { code: "ta", name: "தமிழ் (Tamil)" },
                { code: "te", name: "తెలుగు (Telugu)" },
                { code: "gu", name: "ગુજરાતી (Gujarati)" },
                { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
              ].map((langItem) => (
                <Chip
                  key={langItem.code}
                  active={selectedLang === langItem.code}
                  onClick={() => setSelectedLang(langItem.code as any)}
                >
                  {langItem.name}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="Chosen Subjects (Select all that apply)">
            {classLevel ? (
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => (
                  <Chip
                    key={subject}
                    active={subjects.includes(subject)}
                    onClick={() => toggleSubject(subject)}
                  >
                    {subject}
                  </Chip>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Select your class level first.</p>
            )}
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:opacity-90 disabled:opacity-50"
          >
            <span>{loading ? "Configuring..." : "Save & Open Dashboard"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
