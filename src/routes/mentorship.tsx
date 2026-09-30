import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getAvailableMentors } from "@/lib/mentorship";
import { useState } from "react";
import {
  UserRound,
  GraduationCap,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Calendar,
  X,
  Send,
  Building,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mentorship")({
  head: () => ({
    meta: [
      {
        title: "Mentorship & Guidance — EdSync",
      },
      {
        name: "description",
        content:
          "Connect with verified academic mentors and career advisors through EdSync.",
      },
    ],
  }),
  component: MentorshipPage,
});

type MentorshipRequest = {
  mentorId: string;
  mentorName: string;
  topic: string;
  question: string;
  submittedAt: string;
  status: "Pending Review" | "Matched";
};

function MentorshipPage() {
  const availableMentors = getAvailableMentors();
  const [selectedMentor, setSelectedMentor] = useState<(typeof availableMentors)[number] | null>(null);
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [requests, setRequests] = useState<MentorshipRequest[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("edsync_mentorship_requests") || "[]");
    } catch {
      return [];
    }
  });

  function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMentor) return;

    if (!topic.trim() || !question.trim()) {
      toast.error("Please fill in the discussion topic and your question.");
      return;
    }

    const newReq: MentorshipRequest = {
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      topic: topic.trim(),
      question: question.trim(),
      submittedAt: new Date().toLocaleDateString(),
      status: "Pending Review",
    };

    const next = [newReq, ...requests];
    setRequests(next);
    localStorage.setItem("edsync_mentorship_requests", JSON.stringify(next));

    toast.success(`Guidance request sent to ${selectedMentor.name}!`);
    setSelectedMentor(null);
    setTopic("");
    setQuestion("");
  }

  return (
    <AppShell
      title="Academic Mentorship"
      description="Connect your learning goals with verified researchers, educators and senior mentors"
    >
      <div className="space-y-6">
        {/* Banner */}
        <section className="surface-card p-6 sm:p-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <UserRound className="h-3.5 w-3.5" /> 1-on-1 Guidance
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Learn from experienced mentors
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Have doubts about higher education, competitive exam strategies, or project ideas? Send your question to a dedicated subject mentor.
            </p>
          </div>
        </section>

        {/* Existing Requests Track */}
        {requests.length > 0 && (
          <section className="surface-card p-5 border-primary/30">
            <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-4 w-4" /> My Active Guidance Requests ({requests.length})
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {requests.map((r, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{r.mentorName}</span>
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-primary">{r.topic}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.question}</p>
                  <p className="mt-2 text-[10px] text-muted-foreground">Submitted on {r.submittedAt}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mentors Grid */}
        <section>
          <h3 className="font-display text-lg font-bold sm:text-xl mb-4">
            Available Mentors ({availableMentors.length})
          </h3>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {availableMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="surface-card-hover flex flex-col justify-between p-6 transition"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 font-display text-base font-bold text-primary-foreground shadow-xs">
                      {mentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-foreground">{mentor.name}</h4>
                      <p className="text-xs font-semibold text-primary">{mentor.expertise}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    {mentor.bio}
                  </p>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Focus Areas
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {mentor.careerAreas.map((area) => (
                        <span
                          key={area}
                          className="rounded-lg border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(mentor)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground transition hover:opacity-90 shadow-xs"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Request Guidance</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Request Modal */}
        {selectedMentor && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-xs p-4">
            <div className="surface-card w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h4 className="font-bold text-lg text-foreground">
                    Request Guidance with {selectedMentor.name}
                  </h4>
                  <p className="text-xs text-primary">{selectedMentor.expertise}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitRequest} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Discussion Topic
                  </label>
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Competitive exam preparation & syllabus strategy"
                    required
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Question / Details
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    placeholder="Describe what you need guidance on..."
                    required
                    className="mt-1 w-full rounded-xl border border-input bg-background p-3.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}