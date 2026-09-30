import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useStudent, studyStreak } from "@/lib/student-store";
import { overallCompletion, subjectProgressList } from "@/lib/syllabus-progress";
import { useMemo } from "react";
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  Clock,
  BookOpen,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress Analytics — EdSync" },
      {
        name: "description",
        content:
          "Charts for syllabus completion, chapter progress, study hours and weekly trends.",
      },
      { property: "og:title", content: "Progress Analytics — EdSync" },
      {
        property: "og:description",
        content: "Syllabus completion, study hours and weekly streaks in clear charts.",
      },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { profile, study } = useStudent();

  const progress = useMemo(
    () => (profile ? subjectProgressList(profile, study) : []),
    [profile, study],
  );
  const overall = overallCompletion(progress);

  // Generate last 7 days chart data
  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const dayName = days[d.getDay()];
      const mins = study.studyMinutes[iso] ?? 0;
      result.push({
        date: dayName,
        fullDate: iso,
        minutes: mins,
      });
    }
    return result;
  }, [study.studyMinutes]);

  const streak = studyStreak(study.studyMinutes);

  const milestones = [
    { title: "First Step", desc: "Complete 1st chapter", achieved: overall.completed >= 1, icon: BookOpen },
    { title: "Consistency", desc: "3-Day Study Streak", achieved: streak >= 3, icon: Flame },
    { title: "Deep Focus", desc: "Study 5+ hours total", achieved: overall.completed >= 3, icon: Clock },
    { title: "Mastery Quest", desc: "50% Syllabus Done", achieved: overall.percent >= 50, icon: Award },
  ];

  return (
    <AppShell
      title="Progress & Analytics"
      description="Visual study time trends, syllabus completion meters & achievement milestones"
    >
      <div className="space-y-6">
        {/* Top Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface-card p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Current Streak</span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">{streak} Days</p>
            <p className="mt-1 text-xs text-muted-foreground">Keep the momentum going!</p>
          </div>

          <div className="surface-card p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Total Chapters Done</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {overall.completed} / {overall.total}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{overall.percent}% total curriculum</p>
          </div>

          <div className="surface-card p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Daily Target</span>
              <Target className="h-4 w-4 text-cyan-500" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {study.dailyTargetMinutes} min
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Recommended daily rhythm</p>
          </div>

          <div className="surface-card p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Overall Status</span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-primary">Active</p>
            <p className="mt-1 text-xs text-muted-foreground">Offline sync active</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Study Time Chart */}
          <section className="surface-card p-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-base font-bold sm:text-lg">Weekly Study Activity</h3>
                <p className="text-xs text-muted-foreground">Minutes logged per day</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                Last 7 Days
              </span>
            </div>

            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.6} />
                  <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.6} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="surface-card p-2 text-xs shadow-lg">
                            <p className="font-bold">{payload[0]?.payload?.fullDate}</p>
                            <p className="text-primary font-semibold">{payload[0]?.value} minutes studied</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                    {weeklyData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === weeklyData.length - 1 ? "var(--color-primary)" : "var(--color-muted-foreground)"}
                        opacity={index === weeklyData.length - 1 ? 1 : 0.4}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Subject Mastery Meters */}
          <section className="surface-card p-6">
            <div className="border-b border-border pb-4">
              <h3 className="font-display text-base font-bold sm:text-lg">Curriculum Breakdown</h3>
              <p className="text-xs text-muted-foreground">Progress by individual subject</p>
            </div>

            <div className="mt-5 space-y-4">
              {progress.map((item) => (
                <div key={item.subject}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-foreground">{item.subject}</span>
                    <span className="text-xs font-bold text-primary">
                      {item.available ? `${item.completed} / ${item.total} ch (${item.percent}%)` : "Pending"}
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-300"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Milestones & Badges */}
        <section className="surface-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className="font-display text-lg font-bold">Study Milestones & Badges</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className={`rounded-2xl border p-4 transition ${
                    m.achieved
                      ? "border-primary/40 bg-primary/5 shadow-xs"
                      : "border-border bg-muted/20 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-xl ${
                        m.achieved
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {m.achieved ? (
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                        Unlocked 🏆
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-muted-foreground">In Progress</span>
                    )}
                  </div>

                  <h4 className="mt-3 font-bold text-sm text-foreground">{m.title}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
