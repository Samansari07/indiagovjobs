import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Seo from "../components/Seo";
import DeadlineBadge from "../components/DeadlineBadge";
import VerificationBadge from "../components/VerificationBadge";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { getExamBySlug } from "../services/examsService";
import { formatDate } from "../utils/deadline";

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink_text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink_text">{value ?? "Not specified"}</dd>
    </div>
  );
}

export default function ExamDetails() {
  const { slug } = useParams();
  const [status, setStatus] = useState("loading");
  const [exam, setExam] = useState(null);

  useEffect(() => {
    let mounted = true;
    setStatus("loading");
    getExamBySlug(slug)
      .then((data) => {
        if (!mounted) return;
        if (!data) setStatus("not_found");
        else { setExam(data); setStatus("ready"); }
      })
      .catch(() => mounted && setStatus("error"));
    return () => { mounted = false; };
  }, [slug]);

  if (status === "loading") return <div className="mx-auto max-w-3xl px-4 py-10"><LoadingSkeleton count={1} /></div>;
  if (status === "error") return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorState /></div>;
  if (status === "not_found") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="Exam not found" description="This listing may have been removed or the link is incorrect." action={<Link to="/exams" className="btn-primary">Browse Exams</Link>} />
      </div>
    );
  }

  const seoTitle = `${exam.name} – Eligibility, Dates & Official Notification`;
  const seoDescription = `${exam.name} conducted by ${exam.organization}. Qualification: ${exam.qualification ?? "see details"}.`;

  return (
    <>
      <Seo path={`/exams/${exam.slug}`} title={seoTitle} description={seoDescription} />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">{exam.name}</h1>
            <p className="mt-1 text-sm text-ink_text-muted">{exam.organization}</p>
          </div>
          <DeadlineBadge status={exam.status} applicationEnd={exam.application_end} />
        </div>

        <div className="mt-3">
          <VerificationBadge lastVerifiedAt={exam.last_verified_at} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {exam.official_url ? (
            <a href={exam.official_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Official Website
            </a>
          ) : (
            <span className="rounded-card bg-ink-50 px-4 py-3 text-sm text-ink_text-muted">Official link not available yet</span>
          )}
          {exam.notification_url && (
            <a href={exam.notification_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Official Notification
            </a>
          )}
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
          <Field label="Level" value={exam.level} />
          <Field label="Qualification" value={exam.qualification} />
          <Field label="Application start" value={formatDate(exam.application_start)} />
          <Field label="Application deadline" value={formatDate(exam.application_end)} />
          <Field label="Exam date" value={formatDate(exam.exam_date)} />
        </dl>

        {exam.description && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-ink">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink_text">{exam.description}</p>
          </div>
        )}
      </div>
    </>
  );
}
