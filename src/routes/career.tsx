import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { askEdSyncAI } from "@/lib/ai";
import { careerPaths } from "@/data/career-paths";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Career Navigator — EdSync" },
      {
        name: "description",
        content:
          "Explore career fields, skills, projects and higher-study pathways.",
      },
      {
        property: "og:title",
        content: "Career Navigator — EdSync",
      },
      {
        property: "og:description",
        content:
          "Explore career fields, skills, projects and higher-study pathways.",
      },
    ],
  }),
  component: CareerPage,
});

function CareerPage() {
  const [search, setSearch] = useState("");

  const filteredCareers = careerPaths.filter((career) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      career.title.toLowerCase().includes(query) ||
      career.description.toLowerCase().includes(query) ||
      career.skills.some((skill) => skill.toLowerCase().includes(query)) ||
      career.relatedSubjects.some((subject) =>
        subject.toLowerCase().includes(query),
      )
    );
  });

  return (
    <AppShell
      title="Career Navigator"
      description="Explore fields, skills, projects and higher-study pathways."
    >
      <div className="space-y-8">
        {/* Search */}
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Explore career paths</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search by career, subject or skill.
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try bioinformatics, genetics, Python..."
            className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary"
          />
        </section>

        {/* Career cards */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Career pathways</h2>
            <p className="text-sm text-muted-foreground">
              Learn what each field involves and how you can start building
              relevant skills.
            </p>
          </div>

          {filteredCareers.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center">
              <p className="font-medium">No matching career paths found.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different subject or skill.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredCareers.map((career) => (
                <article
                  key={career.title}
                  className="rounded-2xl border bg-card p-5 shadow-sm"
                >
                  <h3 className="text-lg font-semibold">{career.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {career.description}
                  </p>

                  <div className="mt-5">
                    <h4 className="text-sm font-semibold">
                      Related subjects
                    </h4>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {career.relatedSubjects.map((subject) => (
                        <span
                          key={subject}
                          className="rounded-full bg-muted px-3 py-1 text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-sm font-semibold">
                      Useful skills
                    </h4>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {career.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border px-3 py-1 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-sm font-semibold">
                      Beginner steps
                    </h4>

                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {career.beginnerSteps.map((step) => (
                        <li key={step}>• {step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-sm font-semibold">
                      Project ideas
                    </h4>

                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {career.projectIdeas.map((project) => (
                        <li key={project}>• {project}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-sm font-semibold">
                      Higher study
                    </h4>

                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {career.higherStudy.map((study) => (
                        <li key={study}>• {study}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Career AI */}
        <CareerAI />
      </div>
    </AppShell>
  );
}

function CareerAI() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "What skills should I learn for bioinformatics?",
    "What projects can I do as a beginner?",
    "How can biotechnology lead to computational biology?",
    "What should I learn in my first year?",
  ];

  async function askCareerAI(question: string) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    setLoading(true);
    setAnswer("");

    try {
      const result = await askEdSyncAI({
        data: {
          message: trimmedQuestion,
          context: JSON.stringify({
            section: "Career Navigator",
            instruction:
              "Help the student understand career options. Explain skills, beginner projects, learning paths and higher-study routes. Do not promise jobs, salaries, admissions, internships, deadlines or guaranteed outcomes.",
            careers: careerPaths.map((career) => ({
              title: career.title,
              description: career.description,
              skills: career.skills,
              beginnerSteps: career.beginnerSteps,
              projectIdeas: career.projectIdeas,
              higherStudy: career.higherStudy,
            })),
          }),
        },
      });

      if (!result.success) {
        throw new Error(result.answer || "Career AI request failed");
      }

      setAnswer(result.answer);
    } catch (error) {
      console.error("Career AI error:", error);

      setAnswer(
        "I couldn't connect to the Career AI right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
            ✦
          </div>

          <div>
            <h2 className="text-xl font-semibold">Career AI</h2>
            <p className="text-sm text-muted-foreground">
              Ask questions about skills, projects and learning paths.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mb-5 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setMessage(suggestion);
              void askCareerAI(suggestion);
            }}
            disabled={loading}
            className="rounded-full border px-3 py-2 text-xs transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void askCareerAI(message);
            }
          }}
          placeholder="Ask Career AI something..."
          disabled={loading}
          className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
        />

        <button
          type="button"
          onClick={() => void askCareerAI(message)}
          disabled={loading || !message.trim()}
          className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      {/* Response */}
      {answer && (
        <div className="mt-5 rounded-xl border bg-muted/30 p-4">
          <div className="mb-2 text-sm font-semibold">Career AI</div>

          <div className="whitespace-pre-wrap text-sm leading-6">
            {answer}
          </div>
        </div>
      )}
    </section>
  );
}
context: JSON.stringify({
  section: "Career Navigator",

  instruction:
    "Help students explore careers across biology, chemistry, physics, mathematics, computer science, social sciences, languages, commerce, geography, arts and interdisciplinary fields. Explain relevant subjects, skills, beginner learning steps, project ideas and higher-study routes. Do not tell students that one career is best for them. Do not promise jobs, salaries, admissions, internships or guaranteed outcomes. Encourage students to compare options based on their interests, subjects and skills.",

  careers: careerPaths.map((career) => ({
    title: career.title,
    category: career.category,
    relatedSubjects: career.relatedSubjects,
    description: career.description,
    skills: career.skills,
    beginnerSteps: career.beginnerSteps,
    projectIdeas: career.projectIdeas,
    higherStudy: career.higherStudy,
  })),
})