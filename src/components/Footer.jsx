import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="max-w-prose text-sm text-ink_text-muted">
          IndiaGovJobs is an independent information platform. It is not affiliated with,
          endorsed by, or an official website of the Government of India or any state
          government. Always verify job and exam details on the official source before applying.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <h4 className="text-sm font-semibold text-ink">Explore</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-ink_text-muted">
              <li><Link to="/jobs" className="no-underline hover:underline">Government Jobs</Link></li>
              <li><Link to="/exams" className="no-underline hover:underline">Exams</Link></li>
              <li><Link to="/find-my-jobs" className="no-underline hover:underline">Find My Jobs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink">Account</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-ink_text-muted">
              <li><Link to="/login" className="no-underline hover:underline">Sign in</Link></li>
              <li><Link to="/saved-jobs" className="no-underline hover:underline">Saved jobs</Link></li>
            </ul>
          </div>
        </div>

        <p className="mt-8 text-xs text-ink_text-muted">
          © {new Date().getFullYear()} IndiaGovJobs. All job and exam data is sourced from
          publicly available official notifications where possible.
        </p>
      </div>
    </footer>
  );
}
