import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { resources } from "@/data/resources";
import { boards } from "@/data/boards";
import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  Search,
  Download,
  CheckCircle2,
  Trash2,
  FileText,
  Eye,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { downloadResource } from "@/lib/resource-download";
import {
  getAllOfflineResources,
  deleteOfflineResource,
  type OfflineResource,
} from "@/lib/offline-db";
import { PdfReader } from "@/components/pdf-reader";
import { toast } from "sonner";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Offline Vault — EdSync" },
      {
        name: "description",
        content:
          "Official textbooks, syllabi and learning resources for students with offline download capabilities.",
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [selectedBoard, setSelectedBoard] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"catalog" | "offline">("catalog");
  const [offlineResources, setOfflineResources] = useState<OfflineResource[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [readerResourceId, setReaderResourceId] = useState<string | null>(null);

  // Load offline saved resources from IndexedDB
  async function loadOffline() {
    try {
      const items = await getAllOfflineResources();
      setOfflineResources(items);
    } catch (e) {
      console.warn("Could not load offline items:", e);
    }
  }

  useEffect(() => {
    void loadOffline();
  }, []);

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const boardMatches =
        selectedBoard === "all" || resource.boards.includes(selectedBoard);

      const classMatches =
        selectedClass === "all" || resource.classes.includes(selectedClass);

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

  async function handleDownload(resource: (typeof resources)[number]) {
    setDownloadingId(resource.id);
    try {
      await downloadResource(resource.id, resource.title, resource.officialUrl);
      toast.success(`"${resource.title}" saved for offline study!`);
      await loadOffline();
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download encountered an issue. Saved offline markdown summary instead.");
      await loadOffline();
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDeleteOffline(id: string) {
    await deleteOfflineResource(id);
    toast.info("Offline resource removed from device cache.");
    await loadOffline();
  }

  if (readerResourceId) {
    return (
      <PdfReader
        resourceId={readerResourceId}
        onClose={() => setReaderResourceId(null)}
      />
    );
  }

  const isSavedOffline = (id: string) =>
    offlineResources.some((item) => item.id === id);

  return (
    <AppShell
      title="Learning Resources"
      description="Official curriculum textbooks, question banks & offline study material"
    >
      <div className="space-y-6">
        {/* Header Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setTab("catalog")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === "catalog"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Official Catalog ({resources.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("offline")}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === "offline"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <span>Offline Vault ({offlineResources.length})</span>
            </button>
          </div>

          <span className="text-xs text-muted-foreground">
            Verified official educational sources
          </span>
        </div>

        {tab === "catalog" ? (
          <>
            {/* Filter Bar */}
            <section className="surface-card p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Education Board
                  </label>
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Boards (CBSE / NCERT / State)</option>
                    {boards.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Class / Standard
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Classes (1 to 12)</option>
                    {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Search Keyword
                  </label>
                  <div className="relative mt-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search subject or book..."
                      className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Catalog Grid */}
            <section>
              {filteredResources.length === 0 ? (
                <div className="surface-card p-12 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-3 font-semibold">No matching resources found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try changing your class or board filter.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {filteredResources.map((resource) => {
                    const saved = isSavedOffline(resource.id);
                    const isDownloading = downloadingId === resource.id;

                    return (
                      <article
                        key={resource.id}
                        className="surface-card-hover flex flex-col justify-between p-6 transition"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                              {resource.type}
                            </span>
                            {saved && (
                              <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-bold text-success">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Offline Ready
                              </span>
                            )}
                          </div>

                          <h3 className="mt-3 text-lg font-bold text-foreground">
                            {resource.title}
                          </h3>
                          <p className="text-xs font-semibold text-muted-foreground">
                            Provider: {resource.provider}
                          </p>

                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {resource.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {resource.subjects.map((sub) => (
                              <span
                                key={sub}
                                className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px]"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-2 border-t border-border pt-4">
                          <a
                            href={resource.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => void handleDownload(resource)}
                            disabled={isDownloading}
                            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                              saved
                                ? "border border-success/30 bg-success/10 text-success"
                                : "bg-primary text-primary-foreground hover:opacity-90"
                            }`}
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>{isDownloading ? "Saving..." : saved ? "Update Cache" : "Save Offline"}</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : (
          /* Offline Vault Tab */
          <section className="space-y-4">
            {offlineResources.length === 0 ? (
              <div className="surface-card p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-bold">Your Offline Vault is Empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Download any textbook or syllabus guide from the catalog to read and annotate offline.
                </p>
                <button
                  type="button"
                  onClick={() => setTab("catalog")}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {offlineResources.map((item) => (
                  <div
                    key={item.id}
                    className="surface-card flex flex-col justify-between p-5 transition hover:border-primary/50"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-bold text-success">
                          Saved Offline
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {typeof item.downloadedAt === "string"
                            ? new Date(item.downloadedAt).toLocaleDateString()
                            : "Offline"}
                        </span>
                      </div>

                      <h4 className="mt-3 font-display text-base font-bold text-foreground">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Available on this device without internet.
                      </p>
                    </div>

                    <div className="mt-5 flex items-center gap-2 border-t border-border pt-3">
                      <button
                        type="button"
                        onClick={() => setReaderResourceId(item.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Open Reader</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDeleteOffline(item.id)}
                        className="rounded-xl border border-destructive/30 bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 transition"
                        title="Delete from offline cache"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}
