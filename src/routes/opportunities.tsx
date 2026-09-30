import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  opportunities,
  type OpportunityType,
} from "@/data/opportunities";

export const Route = createFileRoute("/opportunities")({
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
  const [activeFilter, setActiveFilter] =
    useState<"All" | OpportunityType>("All");

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((opportunity) => {
      const matchesFilter =
        activeFilter === "All" ||
        opportunity.type === activeFilter;

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
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
            Student Opportunities
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Opportunities for You
          </h1>

          <p className="mt-3 max-w-3xl text-muted-foreground">
            Discover scholarships, internships, fellowships, government
            schemes, competitions and learning programs from official sources.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search opportunities..."
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
          />
        </div>

        {/* Category filters */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background hover:bg-muted"
              }`}
            >
              {filter === "All"
                ? "All"
                : filter === "Government Scheme"
                  ? "Government Schemes"
                  : filter === "Learning Program"
                    ? "Learning Programs"
                    : `${filter}s`}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="mb-5">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredOpportunities.length}
            </span>{" "}
            opportunit
            {filteredOpportunities.length === 1 ? "y" : "ies"}
          </p>
        </div>

        {/* Cards */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={`${opportunity.title}-${opportunity.sourceName}`}
                opportunity={opportunity}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <h2 className="text-xl font-semibold">
              No opportunities found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Try another search term or category.
            </p>
          </div>
        )}

        {/* Official sources */}
        <section className="mt-12 rounded-2xl border border-border bg-muted/30 p-6">
          <h2 className="text-lg font-semibold">
            Official Opportunity Sources
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            EdSync uses official portals as the source for opportunity
            discovery. Always verify the latest eligibility and deadline before
            applying.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <OfficialSource
              name="National Scholarship Portal"
              url="https://scholarships.gov.in/"
            />

            <OfficialSource
              name="AICTE Internship Portal"
              url="https://internship.aicte-india.org/"
            />

            <OfficialSource
              name="Common Fellowship Portal"
              url="https://www.fellowships.gov.in/"
            />

            <OfficialSource
              name="myScheme"
              url="https://www.myscheme.gov.in/"
            />
          </div>
        </section>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          EdSync is an independent student-support platform. It is not an
          official government portal and does not process applications on
          behalf of government organizations.
        </p>
      </div>
    </main>
  );
}

function OpportunityCard({
  opportunity,
}: {
  opportunity: (typeof opportunities)[number];
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">

      {/* Category + verification */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {opportunity.type}
        </span>

        <span className="text-xs font-medium text-muted-foreground">
          ✓ Official source
        </span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold leading-snug">
        {opportunity.title}
      </h2>

      {/* Organization */}
      <p className="mt-2 text-sm text-muted-foreground">
        {opportunity.organization}
      </p>

      {/* Eligibility */}
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Eligibility
        </p>

        <p className="mt-1 text-sm leading-relaxed">
          {opportunity.eligibility}
        </p>
      </div>

      {/* Deadline */}
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Deadline
        </p>

        <p className="mt-1 text-sm font-medium">
          {opportunity.deadline}
        </p>
      </div>

      {/* Source */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground">
          Source: {opportunity.sourceName}
        </p>

        <p className="text-xs text-muted-foreground">
          Last verified: {opportunity.lastVerified}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-auto pt-6">
        <a
          href={opportunity.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Visit Official Source
        </a>
      </div>
    </article>
  );
}

function OfficialSource({
  name,
  url,
}: {
  name: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-muted"
    >
      {name}
    </a>
  );
}