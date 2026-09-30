import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  BookOpen,
  Clock,
  Flame,
  Target,
  ArrowRight,
  Compass,
  Library,
  TrendingUp,
  ShieldCheck,
  Award,
  FileText,
  HelpCircle,
  GraduationCap,
  Calendar,
  CheckCircle2,
  BarChart3,
  Bot,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { boardLabel } from "@/data/academics";
import { logStudyMinutes, studyStreak, useStudent } from "@/lib/student-store";
import { overallCompletion, subjectProgressList } from "@/lib/syllabus-progress";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Academic Dashboard — EdSync" },
      {
        name: "description",
        content:
          "Official Student Academic Dashboard: syllabus completion, daily targets, subject breakdown, NCERT digital vault, and learning metrics.",
      },
      { property: "og:title", content: "Academic Dashboard — EdSync" },
      {
        property: "og:description",
        content: "Verified syllabus progress, daily study target, and institutional learning pass.",
      },
    ],
  }),
  component: Dashboard,
});

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  badge,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  note?: string;
  badge?: string;
}) {
  return (
    <div className="surface-card p-5 relative overflow-hidden transition-all hover:border-primary/40">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </p>
        {badge && (
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
            {badge}
          </span>
        )}
      </div>
      {note && <p className="mt-1.5 text-xs text-muted-foreground font-medium">{note}</p>}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { hydrated, profile, study, refresh } = useStudent();
  const { t } = useI18n();

  useEffect(() => {
    if (hydrated && !profile) void navigate({ to: "/onboarding" });
  }, [hydrated, profile, navigate]);

  const progress = useMemo(
    () => (profile ? subjectProgressList(profile, study) : []),
    [profile, study],
  );
  const overall = overallCompletion(progress);

  const today = new Date().toISOString().slice(0, 10);
  const todayMinutes = study.studyMinutes[today] ?? 0;
  const totalMinutes = Object.values(study.studyMinutes).reduce((a, b) => a + b, 0);

  function addMinutes(mins: number) {
    logStudyMinutes(today, mins);
    refresh();
    toast.success(`+${mins} ${t("dash.minutes", "minutes")} logged into academic record.`);
  }

  if (!hydrated || !profile) {
    return (
      <AppShell title={t("nav.dashboard", "Academic Dashboard")}>
        <div className="h-64 animate-pulse rounded-2xl bg-muted/60" />
      </AppShell>
    );
  }

  const studentRollCode = `EDS-${profile.board.toUpperCase().slice(0, 3)}-${profile.classLevel}-${profile.name.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "STU"}`;

  return (
    <AppShell
      title={t("dash.official_title", "Student Academic Repository & Learning Dashboard")}
      description={`${t("dash.academic_session", "Academic Session 2025-26")} · Class ${profile.classLevel} · ${boardLabel(profile.board)}${profile.state ? ` · ${profile.state}` : ""}`}
    >
      <div className="space-y-6">
        {/* Official Institutional Student Pass */}
        <section className="surface-card relative overflow-hidden border-primary/30 p-5 sm:p-6 bg-gradient-to-r from-card via-card to-primary/5 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-teal-500 font-display text-xl font-extrabold text-primary-foreground shadow-md shadow-primary/20">
                {profile.name[0]?.toUpperCase() || "S"}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg sm:text-xl font-extrabold text-foreground">
                    {profile.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    <ShieldCheck className="h-3 w-3" /> Verified Student Pass
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground font-medium">
                  {profile.school ? `${profile.school} · ` : ""}
                  {t("dash.class", "Class")} {profile.classLevel} · {boardLabel(profile.board)}
                  {profile.state ? ` (${profile.state})` : ""}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  ID: <span className="font-semibold text-foreground">{studentRollCode}</span> ·{" "}
                  {t("dash.academic_session", "Session 2025-26")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <Link
                to="/study"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 transition hover:opacity-90"
              >
                <BookOpen className="h-4 w-4" />
                <span>{t("nav.study", "Curriculum & Syllabus")}</span>
              </Link>
              <Link
                to="/ai-study-buddy"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground transition hover:bg-muted hover:border-primary/40"
              >
                <Bot className="h-4 w-4 text-primary" />
                <span>{t("nav.ai", "Academic AI Tutor")}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Top 4 Institutional KPI Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Target}
            label={t("dash.today_target", "Daily Study Target")}
            value={`${todayMinutes} / ${study.dailyTargetMinutes}m`}
            note={`${Math.max(0, study.dailyTargetMinutes - todayMinutes)} min remaining today`}
            badge={todayMinutes >= study.dailyTargetMinutes ? "Goal Achieved" : "In Progress"}
          />
          <StatCard
            icon={Flame}
            label={t("dash.study_streak", "Active Learning Streak")}
            value={`${studyStreak(study.studyMinutes)} Days`}
            note="Continuous study verification"
            badge="Verified"
          />
          <StatCard
            icon={Clock}
            label={t("dash.total_hours", "Cumulative Study Hours")}
            value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}
            note="Logged on local device vault"
            badge="IndexedDB"
          />
          <StatCard
            icon={Award}
            label={t("dash.syllabus_coverage", "Curriculum Coverage")}
            value={`${overall.percent}%`}
            note={`${overall.completed} of ${overall.total} ${t("dash.chapters_completed", "chapters completed")}`}
            badge="NCERT Mapped"
          />
        </div>

        {/* Main Grid: Subject Mastery Matrix + Daily Action Desk */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_1fr]">
          {/* Prescribed Subject Mastery Matrix */}
          <section className="surface-card p-6">
            <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                  {t("dash.subject_breakdown", "Prescribed Subject Mastery Matrix")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("dash.subject_status_verified", "Curriculum Mapped")} · {boardLabel(profile.board)} Class {profile.classLevel}
                </p>
              </div>
              <Link
                to="/study"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>Full Syllabus</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {progress.map((item) => (
                <div
                  key={item.subject}
                  className="rounded-2xl border border-border/80 bg-background/50 p-4 transition-all hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                        {item.subject[0]}
                      </div>
                      <span className="font-bold text-foreground">
                        {item.subject}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      {item.available
                        ? `${item.completed}/${item.total} ch (${item.percent}%)`
                        : "Preparing Curriculum"}
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-teal-400 transition-all duration-300"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column: Time Logger + Quick Launch */}
          <div className="space-y-6">
            {/* Prescribed Study Session Logger */}
            <section className="surface-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    {t("dash.add_study_time", "Log Prescribed Study Session")}
                  </h3>
                  <p className="text-xs text-muted-foreground">Record daily academic hours</p>
                </div>
                <Calendar className="h-5 w-5 text-primary" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => addMinutes(15)}
                  className="rounded-xl border border-border bg-background p-2.5 text-center text-xs font-bold text-foreground hover:border-primary hover:bg-primary/5 transition"
                >
                  +15 min
                </button>
                <button
                  type="button"
                  onClick={() => addMinutes(30)}
                  className="rounded-xl border border-border bg-background p-2.5 text-center text-xs font-bold text-foreground hover:border-primary hover:bg-primary/5 transition"
                >
                  +30 min
                </button>
                <button
                  type="button"
                  onClick={() => addMinutes(45)}
                  className="rounded-xl border border-border bg-background p-2.5 text-center text-xs font-bold text-foreground hover:border-primary hover:bg-primary/5 transition"
                >
                  +45 min
                </button>
              </div>

              <button
                type="button"
                onClick={() => addMinutes(60)}
                className="mt-2 w-full rounded-xl border border-primary/30 bg-primary/5 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition"
              >
                +60 min (1 Hour Complete Lecture)
              </button>
            </section>

            {/* Academic Action Desk */}
            <section className="surface-card p-6">
              <h3 className="font-display text-base font-bold text-foreground">
                {t("dash.quick_access", "Academic Action Desk")}
              </h3>
              <p className="text-xs text-muted-foreground">Official study tools & resources</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  to="/resources"
                  className="flex flex-col rounded-2xl border border-border bg-background p-3.5 hover:border-primary/40 hover:bg-muted/40 transition"
                >
                  <Library className="h-4 w-4 text-primary" />
                  <span className="mt-2 text-xs font-bold text-foreground">
                    {t("dash.ncert_books", "NCERT Textbooks")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Offline Vault</span>
                </Link>

                <Link
                  to="/ai-study-buddy"
                  className="flex flex-col rounded-2xl border border-primary/20 bg-primary/5 p-3.5 hover:bg-primary/10 transition"
                >
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="mt-2 text-xs font-bold text-foreground">
                    {t("dash.ai_tutor_desk", "AI Academic Tutor")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Voice explanations</span>
                </Link>

                <Link
                  to="/opportunities"
                  className="flex flex-col rounded-2xl border border-border bg-background p-3.5 hover:border-primary/40 hover:bg-muted/40 transition"
                >
                  <Award className="h-4 w-4 text-primary" />
                  <span className="mt-2 text-xs font-bold text-foreground">Scholarships</span>
                  <span className="text-[10px] text-muted-foreground">Govt & Olympiads</span>
                </Link>

                <Link
                  to="/progress"
                  className="flex flex-col rounded-2xl border border-border bg-background p-3.5 hover:border-primary/40 hover:bg-muted/40 transition"
                >
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="mt-2 text-xs font-bold text-foreground">
                    {t("dash.analytics_view", "Analytics")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Progress Reports</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
