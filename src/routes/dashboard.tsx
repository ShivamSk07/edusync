import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { BookOpen, Clock, Flame, Target } from "lucide-react";
import { useEffect, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { boardLabel } from "@/data/academics";
import { useConnectivity } from "@/hooks/use-connectivity";
import { studyStreak, useStudent } from "@/lib/student-store";
import { overallCompletion, subjectProgressList } from "@/lib/syllabus-progress";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
    beforeLoad: async () => {
    const session = await authClient.getSession();

    if (!session.data?.session) {
      throw redirect({
        to: "/auth",
      });
    }
  },
  head: () => ({
    meta: [
      { title: "Dashboard — EdSync" },
      {
        name: "description",
        content:
          "Your EdSync dashboard: study streak, daily target, syllabus completion, subject progress and connectivity status.",
      },
      { property: "og:title", content: "Dashboard — EdSync" },
      {
        property: "og:description",
        content: "Study streak, daily target, syllabus completion and subject progress at a glance.",
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
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate text-xs font-medium tracking-wide uppercase">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { hydrated, profile, study } = useStudent();
  const { status } = useConnectivity();

  useEffect(() => {
    if (hydrated && !profile) void navigate({ to: "/onboarding" });
  }, [hydrated, profile, navigate]);

  const progress = useMemo(
    () => (profile ? subjectProgressList(profile, study) : []),
    [profile, study],
  );
  const overall = overallCompletion(progress);

  if (!hydrated || !profile) {
    return (
      <AppShell title="Dashboard">
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </AppShell>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayMinutes = study.studyMinutes[today] ?? 0;
  const totalMinutes = Object.values(study.studyMinutes).reduce((a, b) => a + b, 0);

  return (
    <AppShell
      title={`Hello, ${profile.name.split(" ")[0]}`}
      description={`Class ${profile.classLevel} · ${boardLabel(profile.board)}${profile.state ? ` · ${profile.state}` : ""}`}
    >
      <div className="space-y-6">
        {profile.isDemo && (
          <p className="rounded-xl border border-accent/40 bg-accent/15 px-4 py-3 text-sm text-accent-foreground">
            You're in demo mode. The student profile and activity here are sample data.
          </p>
        )}

        <p className="rounded-xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
          {status === "offline"
            ? "You're offline. Your changes are saved locally and will sync when you're online."
            : "You're online. Downloaded content and offline sync arrive in the next build phase."}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Target}
            label="Today's target"
            value={`${todayMinutes} / ${study.dailyTargetMinutes} min`}
            note="Study time logging arrives with the routine tracker."
          />
          <StatCard icon={Flame} label="Study streak" value={`${studyStreak(study.studyMinutes)} days`} />
          <StatCard
            icon={Clock}
            label="Total study time"
            value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}
          />
          <StatCard
            icon={BookOpen}
            label="Syllabus completion"
            value={`${overall.percent}%`}
            note={`${overall.completed} of ${overall.total} chapters marked done`}
          />
        </div>

        <section className="surface-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold">Subject progress</h2>
            <Link to="/study" className="text-sm font-medium text-primary hover:underline">
              Open Study
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {progress.map((item) => (
              <div key={item.subject}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium">{item.subject}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {item.available ? `${item.completed}/${item.total} chapters` : "Being prepared"}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-base font-semibold">Recent activity</h2>
          {study.lastOpened ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Last opened: {study.lastOpened.subject} — {study.lastOpened.chapter}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing opened yet. Start from the Study page.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
