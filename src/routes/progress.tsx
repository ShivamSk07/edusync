import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PhaseNotice } from "@/components/phase-notice";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — EdSync" },
      {
        name: "description",
        content:
          "Charts for syllabus completion, chapter progress, quiz performance, study hours and weekly trends.",
      },
      { property: "og:title", content: "Progress — EdSync" },
      {
        property: "og:description",
        content: "Syllabus completion, quiz performance and study-hour trends in clear charts.",
      },
    ],
  }),
  component: () => (
    <AppShell title="Progress" description="How your study is tracking over time">
      <PhaseNotice
        feature="Progress charts"
        detail="Quiz results, study hours and weekly trends need the quiz and routine features first. Chapter-level completion is already visible on the dashboard and study pages."
      />
    </AppShell>
  ),
});
