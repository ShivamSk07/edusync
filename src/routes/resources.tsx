import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { resources } from "@/data/resources";
import { boards } from "@/data/boards";
import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { downloadResource } from "@/lib/resource-download";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — EdSync" },
      {
        name: "description",
        content:
          "Official textbooks, syllabi and learning resources for students.",
      },
    ],
  }),

  component: ResourcesPage,
});

function ResourcesPage() {
  const [selectedBoard, setSelectedBoard] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [search, setSearch] = useState("");

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const boardMatches =
        selectedBoard === "all" ||
        resource.boards.includes(selectedBoard);

      const classMatches =
        selectedClass === "all" ||
        resource.classes.includes(selectedClass);

      const searchMatches =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.provider.toLowerCase().includes(query) ||
        resource.subjects.some((subject) =>
          subject.toLowerCase().includes(query),
        );

      return boardMatches && classMatches && searchMatches;
    });
  }, [selectedBoard, selectedClass, search]);

  return (
    <AppShell
      title="Resources"
      description="Official learning material, textbooks and syllabus resources"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Your learning resources
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Explore official syllabus information, textbooks and
                government learning resources based on your board and class.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Board
              </label>

              <select
                value={selectedBoard}
                onChange={(event) =>
                  setSelectedBoard(event.target.value)
                }
                className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm"
              >
                <option value="all">All boards</option>

                {boards.map((board) => (
                  <option key={board.id} value={board.name}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Class
              </label>

              <select
                value={selectedClass}
                onChange={(event) =>
                  setSelectedClass(event.target.value)
                }
                className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm"
              >
                <option value="all">All classes</option>

                {Array.from({ length: 12 }, (_, index) => {
                  const classNumber = String(index + 1);

                  return (
                    <option
                      key={classNumber}
                      value={classNumber}
                    >
                      Class {classNumber}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Search
              </label>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search resources..."
                  className="w-full rounded-xl border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                Official resources
              </h2>

              <p className="text-sm text-muted-foreground">
                {filteredResources.length} resource
                {filteredResources.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />

              <h3 className="mt-3 font-semibold">
                No matching resources
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Try another board, class or search term.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredResources.map((resource) => (
                <article
                  key={resource.id}
                  className="rounded-2xl border bg-card p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {resource.type}
                      </span>

                      <h3 className="mt-3 text-lg font-semibold">
                        {resource.title}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-muted-foreground">
                        {resource.provider}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {resource.description}
                  </p>

                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Available for
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {resource.boards.map((board) => (
                        <span
                          key={board}
                          className="rounded-full bg-muted px-3 py-1 text-xs"
                        >
                          {board}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Subjects
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {resource.subjects.slice(0, 6).map((subject) => (
                        <span
                          key={subject}
                          className="rounded-full border px-3 py-1 text-xs"
                        >
                          {subject}
                        </span>
                      ))}

                      {resource.subjects.length > 6 && (
                        <span className="rounded-full border px-3 py-1 text-xs">
                          +{resource.subjects.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
  <button
    type="button"
    onClick={async () => {
      try {
        await downloadResource(
          resource.id,
          resource.title,
          resource.officialUrl,
        );

        alert("Resource saved for offline use.");
      } catch (error) {
        console.error(
          "Resource download failed:",
          error,
        );

        alert(
          "This resource could not be downloaded directly. Please open the official source instead.",
        );
      }
    }}
    className="inline-flex w-full items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
  >
    Download for Offline
  </button>

  <div className="mt-5 grid gap-2 sm:grid-cols-2">
  <a
    href={resource.officialUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
  >
    Open Official
    <ExternalLink className="h-4 w-4" />
  </a>

  <button
    type="button"
    onClick={async () => {
      try {
        await downloadResource(resource);

        alert(
          "Resource downloaded. It is now available offline in EdSync.",
        );
      } catch (error) {
        console.error(error);

        alert(
          "EdSync could not download this resource. Please check your connection or open the official source.",
        );
      }
    }}
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
  >
    Download Offline
  </button>
</div>
</div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
const [offlineResources, setOfflineResources] =
  useState<OfflineResource[]>([]);

useEffect(() => {
  getAllOfflineResources().then(
    setOfflineResources,
  );
}, []);

<section className="rounded-2xl border bg-card p-5">
  <h2 className="text-lg font-semibold">
    Downloaded for Offline
  </h2>

  <p className="mt-1 text-sm text-muted-foreground">
    These resources remain available without internet.
  </p>

  <div className="mt-4 grid gap-3">
    {offlineResources.map((resource) => (
      <button
        key={resource.id}
        type="button"
        onClick={() =>
          setReaderResourceId(resource.id)
        }
        className="flex items-center justify-between rounded-xl border p-4 text-left hover:bg-muted"
      >
        <div>
          <p className="font-medium">
            {resource.title}
          </p>

          <p className="text-xs text-muted-foreground">
            {resource.subject ?? "Learning resource"}
          </p>
        </div>

        <span className="text-xs text-success">
          Available offline
        </span>
      </button>
    ))}
  </div>
</section>
