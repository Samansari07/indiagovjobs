import { NavLink, Outlet, Link } from "react-router-dom";

const LINKS = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/exams", label: "Exams" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-surface-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-base font-bold text-ink">
            IndiaGov<span className="text-amber-600">Jobs</span> <span className="ml-1 rounded bg-ink-50 px-2 py-0.5 text-xs font-medium text-ink_text-muted">Admin</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-ink_text-muted hover:text-ink">
            Back to site
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[200px_1fr]">
        <nav aria-label="Admin" className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `shrink-0 rounded-card px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-ink text-white" : "text-ink_text-muted hover:bg-ink-50"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
