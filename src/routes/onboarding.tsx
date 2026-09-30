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

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your profile — EdSync" },
      {
        name: "description",
        content:
          "Tell EdSync your class, board, state and subjects so your syllabus and study plan match what you actually study.",
      },
      { property: "og:title", content: "Set up your profile — EdSync" },
      {
        property: "og:description",
        content: "Class, board, state and subjects — the basis of your personalized EdSync syllabus.",
      },
    ],
  }),
  component: Onboarding,
});

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30";

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
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const { profile } = useStudent();

  const [name, setName] = useState(profile?.name ?? "");
  const [classLevel, setClassLevel] = useState<ClassLevel | null>(profile?.classLevel ?? null);
  const [board, setBoard] = useState<BoardId | null>(profile?.board ?? null);
  const [state, setState] = useState<string>(profile?.state ?? "");
  const [school, setSchool] = useState(profile?.school ?? "");
  const [subjects, setSubjects] = useState<string[]>(profile?.subjects ?? []);

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

      saveProfile({
        name: name.trim(),
        classLevel,
        board,
        state: needsState ? state : null,
        school: school.trim(),
        subjects,
        isDemo: false,
        createdAt: profile?.createdAt ?? new Date().toISOString(),
      });

      toast.success("Your academic profile is ready.");
      void navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Failed to save academic profile:", error);
      toast.error("Could not save your profile. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <form onSubmit={submit} className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold sm:text-3xl">Set up your academic profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          EdSync uses this to build your syllabus. We never guess your board from your location.
        </p>

        <div className="surface-card mt-6 space-y-6 p-5 sm:p-6">
          <Field label="Your name">
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aditi Sharma"
              autoComplete="name"
            />
          </Field>

          <Field label="Class / Grade">
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

          <Field label="Board">
            <div className="flex flex-wrap gap-2">
              {BOARD_OPTIONS.map((option) => (
                <Chip key={option.id} active={board === option.id} onClick={() => setBoard(option.id)}>
                  {option.label}
                </Chip>
              ))}
            </div>
          </Field>

          {needsState && (
            <Field label="State" hint="Required so your state board syllabus is matched correctly.">
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

          <Field label="School / College" hint="Optional.">
            <input
              className={inputClass}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g. Govt. Higher Secondary School"
            />
          </Field>

          <Field label="Subjects">
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
              <p className="text-sm text-muted-foreground">Select your class first.</p>
            )}
          </Field>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
        >
          Continue to dashboard
        </button>
      </form>
    </div>
  );
}
