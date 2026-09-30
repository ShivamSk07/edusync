import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getAvailableMentors } from "@/lib/mentorship";

export const Route = createFileRoute("/mentorship")({
  head: () => ({
    meta: [
      {
        title: "Mentorship — EdSync",
      },
      {
        name: "description",
        content:
          "Explore mentors and guidance opportunities through EdSync.",
      },
    ],
  }),

  component: MentorshipPage,
});

function MentorshipPage() {
  const availableMentors = getAvailableMentors();

  return (
    <AppShell
      title="Mentorship"
      description="Connect your learning goals with relevant guidance."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-2xl font-semibold">
            Find the right guidance
          </h2>

          <p className="mt-2 text-muted-foreground">
            Explore mentors based on academic interests, subjects and career
            areas.
          </p>
        </div>

        {availableMentors.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-muted-foreground">
              No mentors are currently available.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {availableMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {mentor.name
                      .split(" ")
                      .map((name) => name[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div>
                    <h3 className="font-semibold">{mentor.name}</h3>

                    <p className="text-sm text-muted-foreground">
                      {mentor.expertise}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {mentor.bio}
                </p>

                <div className="mt-4">
                  <p className="text-sm font-medium">Areas of guidance</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {mentor.careerAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full bg-muted px-3 py-1 text-xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    onClick={() => {
                      alert(
                        `Mentorship request for ${mentor.name} will be available soon.`,
                      );
                    }}
                  >
                    View Mentor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}