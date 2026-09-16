import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminListJobs, adminSetJobStatus, adminDeleteJob, adminVerifyJob } from "../../services/adminService";
import { formatLastVerified } from "../../utils/deadline";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";

export default function AdminJobsList() {
  const [status, setStatus] = useState("loading");
  const [jobs, setJobs] = useState([]);

  function load() {
    setStatus("loading");
    adminListJobs()
      .then((data) => { setJobs(data); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }

  useEffect(load, []);

  async function handleStatus(job, newStatus) {
    await adminSetJobStatus(job.id, newStatus);
    load();
  }

  async function handleVerify(job) {
    await adminVerifyJob(job.id);
    load();
  }

  async function handleDelete(job) {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    await adminDeleteJob(job.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Jobs</h1>
        <Link to="/admin/jobs/new" className="btn-primary">Create job</Link>
      </div>

      <div className="mt-5">
        {status === "loading" && <p className="text-sm text-ink_text-muted">Loading…</p>}
        {status === "error" && <ErrorState onRetry={load} />}
        {status === "ready" && jobs.length === 0 && (
          <EmptyState title="No jobs yet" action={<Link to="/admin/jobs/new" className="btn-primary">Create the first job</Link>} />
        )}
        {status === "ready" && jobs.length > 0 && (
          <div className="overflow-x-auto rounded-card border border-surface-border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-surface-border bg-ink-50 text-xs uppercase text-ink_text-muted">
                <tr>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Last verified</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-surface-border last:border-0">
                    <td className="px-3 py-2.5">
                      <Link to={`/admin/jobs/${job.id}`} className="font-medium text-ink hover:underline">
                        {job.title}
                      </Link>
                      <p className="text-xs text-ink_text-muted">{job.organization}</p>
                    </td>
                    <td className="px-3 py-2.5 capitalize">{job.status}</td>
                    <td className="px-3 py-2.5 text-ink_text-muted">{formatLastVerified(job.last_verified_at)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {job.status !== "open" && (
                          <button type="button" onClick={() => handleStatus(job, "open")} className="rounded-card border border-surface-border px-2 py-1 text-xs hover:border-ink">Publish</button>
                        )}
                        {job.status === "open" && (
                          <button type="button" onClick={() => handleStatus(job, "closed")} className="rounded-card border border-surface-border px-2 py-1 text-xs hover:border-ink">Close</button>
                        )}
                        <button type="button" onClick={() => handleVerify(job)} className="rounded-card border border-verified/40 px-2 py-1 text-xs text-verified hover:border-verified">Verify now</button>
                        <button type="button" onClick={() => handleDelete(job)} className="rounded-card border border-closed/40 px-2 py-1 text-xs text-closed hover:border-closed">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
