import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminListJobs, adminListExams } from "../../services/adminService";

function StatCard({ label, value, to }) {
  const content = (
    <div className="card">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink_text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

export default function AdminOverview() {
  const [jobs, setJobs] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminListJobs(), adminListExams()])
      .then(([j, e]) => { setJobs(j); setExams(e); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const needsVerification = [...jobs, ...exams].filter((x) => !x.last_verified_at).length;
  const openJobs = jobs.filter((j) => j.status === "open").length;

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">Overview</h1>
      {loading ? (
        <p className="mt-4 text-sm text-ink_text-muted">Loading…</p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total jobs" value={jobs.length} to="/admin/jobs" />
          <StatCard label="Open jobs" value={openJobs} to="/admin/jobs" />
          <StatCard label="Total exams" value={exams.length} to="/admin/exams" />
          <StatCard label="Needs verification" value={needsVerification} />
        </div>
      )}
    </div>
  );
}
