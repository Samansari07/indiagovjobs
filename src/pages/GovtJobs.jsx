import { useEffect, useState } from "react";
import Seo from "../components/Seo";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import FilterDrawer from "../components/FilterDrawer";
import JobCard from "../components/JobCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { listJobs } from "../services/jobsService";
import { INDIAN_STATES, QUALIFICATIONS, STREAMS } from "../utils/options";

const FILTERS = [
  { key: "state", label: "State", options: INDIAN_STATES },
  { key: "qualification", label: "Qualification", options: QUALIFICATIONS },
  { key: "stream", label: "Stream", options: STREAMS },
  { key: "jobType", label: "Job Type", options: ["Permanent", "Temporary", "Contract"] },
];

export default function GovtJobs() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("closing_soon");
  const [page, setPage] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [state, setState] = useState({ status: "loading", jobs: [], total: 0, pageSize: 20 });

  useEffect(() => {
    let mounted = true;
    setState((s) => ({ ...s, status: "loading" }));
    listJobs({ page, search, sort, ...filters })
      .then((res) => mounted && setState({ status: "ready", ...res }))
      .catch(() => mounted && setState((s) => ({ ...s, status: "error" })));
    return () => { mounted = false; };
  }, [page, search, sort, filters]);

  function updateFilter(key, val) {
    setPage(0);
    setFilters((f) => ({ ...f, [key]: val }));
  }

  function clearFilters() {
    setPage(0);
    setFilters({});
  }

  const totalPages = Math.max(1, Math.ceil(state.total / state.pageSize));

  return (
    <>
      <Seo
        path="/jobs"
        description="Browse verified government job listings across India, with filters for state, qualification, stream and deadline."
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-ink">Government Jobs</h1>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={(v) => { setPage(0); setSearch(v); }} />
          </div>
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort by"
              className="rounded-card border border-surface-border bg-white px-3 py-2.5 text-sm"
            >
              <option value="closing_soon">Closing soon</option>
              <option value="latest">Latest</option>
            </select>
            <button type="button" onClick={() => setDrawerOpen(true)} className="btn-secondary">
              Filters
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <FilterPanel filters={FILTERS} values={filters} onChange={updateFilter} onClear={clearFilters} />
          </aside>

          <div>
            {state.status === "loading" && <LoadingSkeleton count={6} />}
            {state.status === "error" && <ErrorState onRetry={() => setPage((p) => p)} />}
            {state.status === "ready" && state.jobs.length === 0 && (
              <EmptyState title="No jobs match your filters" description="Try clearing some filters or searching a different term." action={<button type="button" onClick={clearFilters} className="btn-secondary">Clear filters</button>} />
            )}
            {state.status === "ready" && state.jobs.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {state.jobs.map((j) => <JobCard key={j.id} job={j} />)}
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-ink_text-muted">
                  <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-40">
                    Previous
                  </button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary disabled:opacity-40">
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <FilterPanel filters={FILTERS} values={filters} onChange={updateFilter} onClear={clearFilters} />
      </FilterDrawer>
    </>
  );
}
