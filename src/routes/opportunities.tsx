import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  opportunities,
  type OpportunityType,
} from "@/data/opportunities";
import {
  Briefcase,
  Search,
  ExternalLink,
  ShieldCheck,
  Bookmark,
  Calendar,
  Building2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Student Opportunities & Scholarships — EdSync" },
      {
        name: "description",
        content:
          "Discover verified government scholarships, internships, fellowships, competitions and student funding schemes from official sources.",
      },
    ],
  }),
  component: OpportunitiesPage,
});

const filters: Array<"All" | OpportunityType> = [
  "All",
  "Scholarship",
  "Internship",
  "Fellowship",
  "Government Scheme",
  "Competition",
  "Learning Program",
];

function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | OpportunityType>("All");
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("edsync_saved_opps") || "[]");
    } catch {
      return [];
    }
  });

  function toggleSave(title: string) {
    let next: string[];
    if (savedIds.includes(title)) {
      next = savedIds.filter((id) => id !== title);
      toast.info("Opportunity removed from saved list.");
    } else {
      next = [...savedIds, title];
      toast.success("Opportunity bookmarked!");
    }
    setSavedIds(next);
    localStorage.setItem("edsync_saved_opps", JSON.stringify(next));
  }

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((opportunity) => {
      const matchesFilter =
        activeFilter === "All" || opportunity.type === activeFilter;

      const matchesSearch =
        query.length === 0 ||
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.organization.toLowerCase().includes(query) ||
        opportunity.type.toLowerCase().includes(query) ||
        opportunity.eligibility.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

  return (
    <AppShell
      title="Student Opportunities"
      description="Verified government scholarships, fellowships, internships & learning programs"
    >
      <div className="space-y-6">
        {/* Top Filter & Search */}
        <section className="surface-card p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search scholarships, eligibility, schemes (e.g. NSP, AICTE)..."
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Direct official portal links only</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {filter === "All"
                  ? "All Categories"
                  : filter === "Government Scheme"
                    ? "Government Schemes"
                    : filter === "Learning Program"
                      ? "Learning Programs"
                      : `${filter}s`}
              </button>
            ))}
          </div>
        </section>

        {/* Opportunity Cards */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredOpportunities.map((opportunity) => {
              const isSaved = savedIds.includes(opportunity.title);
              return (
                <article
                  key={`${opportunity.title}-${opportunity.sourceName}`}
                  className="surface-card-hover flex h-full flex-col justify-between p-6 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        {opportunity.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleSave(opportunity.title)}
                        aria-label="Bookmark opportunity"
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary transition"
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`}
                        />
                      </button>
                    </div>

                    <h3 className="text-base font-bold leading-snug text-foreground">
                      {opportunity.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{opportunity.organization}</span>
                    </div>

                    <div className="mt-4 rounded-xl bg-muted/40 p-3 text-xs leading-relaxed">
                      <p className="font-semibold text-foreground mb-0.5">Eligibility:</p>
                      <p className="text-muted-foreground">{opportunity.eligibility}</p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                        <span>Deadline: {opportunity.deadline}</span>
                      </span>
                      <span>Source: {opportunity.sourceName}</span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border pt-4">
                    <a
                      href={opportunity.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-center text-xs font-bold text-primary-foreground transition hover:opacity-90 shadow-xs"
                    >
                      <span>Apply on Official Portal</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="surface-card p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-3 font-semibold">No opportunities matched your query</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try searching for a different keyword or resetting filters.
            </p>
          </div>
        )}

        {/* Verified Portals Box */}
        <section className="surface-card p-6 border-dashed">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Trusted Government Portals
          </h3>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {[
              { name: "National Scholarship Portal", url: "https://scholarships.gov.in/" },
              { name: "AICTE Internship Portal", url: "https://internship.aicte-india.org/" },
              { name: "Common Fellowship Portal", url: "https://www.fellowships.gov.in/" },
              { name: "myScheme Portal", url: "https://www.myscheme.gov.in/" },
            ].map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <span>{p.name}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}