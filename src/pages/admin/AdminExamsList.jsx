import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminListExams, adminSetExamStatus, adminDeleteExam, adminVerifyExam } from "../../services/adminService";
import { formatLastVerified } from "../../utils/deadline";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";

export default function AdminExamsList() {
  const [status, setStatus] = useState("loading");
  const [exams, setExams] = useState([]);

  function load() {
    setStatus("loading");
    adminListExams()
      .then((data) => { setExams(data); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }

  useEffect(load, []);

  async function handleStatus(exam, newStatus) {
    await adminSetExamStatus(exam.id, newStatus);
    load();
  }
  async function handleVerify(exam) {
    await adminVerifyExam(exam.id);
    load();
  }
  async function handleDelete(exam) {
    if (!window.confirm(`Delete "${exam.name}"? This cannot be undone.`)) return;
    await adminDeleteExam(exam.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Exams</h1>
        <Link to="/admin/exams/new" className="btn-primary">Create exam</Link>
      </div>

      <div className="mt-5">
        {status === "loading" && <p className="text-sm text-ink_text-muted">Loading…</p>}
        {status === "error" && <ErrorState onRetry={load} />}
        {status === "ready" && exams.length === 0 && (
          <EmptyState title="No exams yet" action={<Link to="/admin/exams/new" className="btn-primary">Create the first exam</Link>} />
        )}
        {status === "ready" && exams.length > 0 && (
          <div className="overflow-x-auto rounded-card border border-surface-border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-surface-border bg-ink-50 text-xs uppercase text-ink_text-muted">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Last verified</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="border-b border-surface-border last:border-0">
                    <td className="px-3 py-2.5">
                      <Link to={`/admin/exams/${exam.id}`} className="font-medium text-ink hover:underline">{exam.name}</Link>
                      <p className="text-xs text-ink_text-muted">{exam.organization}</p>
                    </td>
                    <td className="px-3 py-2.5 capitalize">{exam.status}</td>
                    <td className="px-3 py-2.5 text-ink_text-muted">{formatLastVerified(exam.last_verified_at)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {exam.status !== "open" && (
                          <button type="button" onClick={() => handleStatus(exam, "open")} className="rounded-card border border-surface-border px-2 py-1 text-xs hover:border-ink">Publish</button>
                        )}
                        {exam.status === "open" && (
                          <button type="button" onClick={() => handleStatus(exam, "closed")} className="rounded-card border border-surface-border px-2 py-1 text-xs hover:border-ink">Close</button>
                        )}
                        <button type="button" onClick={() => handleVerify(exam)} className="rounded-card border border-verified/40 px-2 py-1 text-xs text-verified hover:border-verified">Verify now</button>
                        <button type="button" onClick={() => handleDelete(exam)} className="rounded-card border border-closed/40 px-2 py-1 text-xs text-closed hover:border-closed">Delete</button>
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
