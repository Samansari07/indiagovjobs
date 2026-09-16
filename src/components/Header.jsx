import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "../services/authService";

const NAV_LINKS = [
  { to: "/jobs", label: "Government Jobs" },
  { to: "/exams", label: "Exams" },
  { to: "/find-my-jobs", label: "Find My Jobs" },
];

export default function Header() {
  const { user, isAdmin, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-display text-lg font-bold text-ink">
          IndiaGov<span className="text-amber-600">Jobs</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-ink" : "text-ink_text-muted hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className="text-sm font-medium text-ink_text-muted hover:text-ink">
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && !user && (
            <Link to="/login" className="btn-primary">
              Sign in
            </Link>
          )}
          {!loading && user && (
            <>
              <Link to="/saved-jobs" className="text-sm font-medium text-ink_text-muted hover:text-ink">
                Saved
              </Link>
              <Link to="/profile" className="text-sm font-medium text-ink_text-muted hover:text-ink">
                Profile
              </Link>
              <button type="button" onClick={() => signOut()} className="btn-secondary">
                Sign out
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-card p-2 md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="#14213D" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-surface-border px-4 pb-4 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-card px-2 py-2.5 text-sm font-medium text-ink_text hover:bg-ink-50"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {isAdmin && (
              <li>
                <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="block rounded-card px-2 py-2.5 text-sm font-medium hover:bg-ink-50">
                  Admin
                </NavLink>
              </li>
            )}
            <li className="mt-2 border-t border-surface-border pt-2">
              {!user ? (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary w-full">
                  Sign in
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/saved-jobs" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-sm font-medium">
                    Saved jobs
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-sm font-medium">
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="btn-secondary w-full"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
