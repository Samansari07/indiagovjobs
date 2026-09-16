import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Seo from "../components/Seo";
import DeadlineBadge from "../components/DeadlineBadge";
import VerificationBadge from "../components/VerificationBadge";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { getJobBySlug } from "../services/jobsService";
import { formatDate } from "../utils/deadline";
import { useAuth } from "../hooks/useAuth";
import { addBookmark, removeBookmark, isJobBookmarked } from "../services/bookmarksService";

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink_text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink_text">{value ?? "Not specified"}</dd>
    </div>
  );
}

export default function JobDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [status, setStatus] = useState("loading");
  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  useEffect(() => {
    let mounted = true;
    setStatus("loading");
    getJobBySlug(slug)
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setStatus("not_found");
        } else {
          setJob(data);
          setStatus("ready");
        }
      })
      .catch(() => mounted && setStatus("error"));
    return () => { mounted = false; };
  }, [slug]);

  useEffect(() => {
    if (!user || !job) return;
    isJobBookmarked(user.id, job.id).then(setSaved).catch(() => {});
  }, [user, job]);

  async function toggleBookmark() {
    if (!user || !job) return;
    setSavingBookmark(true);
    try {
      if (saved) {
        await removeBookmark(user.id, job.id);
        setSaved(false);
      } else {
        await addBookmark(user.id, job.id);
        setSaved(true);
      }
    } catch {
      // no-op; UI stays in previous state
    } finally {
      setSavingBookmark(false);
    }
  }

  if (status === "loading") {
    return <div className="mx-auto max-w-3xl px-4 py-10"><LoadingSkeleton count={1} /></div>;
  }
  if (status === "error") {
    return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorState /></div>;
  }
  if (status === "not_found") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="Job not found" description="This listing may have been removed or the link is incorrect." action={<Link to="/jobs" className="btn-primary">Browse Government Jobs</Link>} />
      </div>
    );
  }

  const seoTitle = `${job.title} – Eligibility, Vacancies, Dates & Official Notification`;
  const seoDescription = `${job.title} at ${job.organization}${job.state ? ` (${job.state})` : ""}. Qualification: ${job.qualification ?? "see details"}. Apply on the official website.`;

  // Structured data reflects ONLY fields present in the database — never invented.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.title,
    datePosted: job.created_at,
    validThrough: job.application_end || undefined,
    hiringOrganization: { "@type": "Organization", name: job.organization },
    ...(job.official_url ? { url: job.official_url } : {}),
  };

  return (
    <>
      <Seo path={`/jobs/${job.slug}`} title={seoTitle} description={seoDescription} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">{job.title}</h1>
            <p className="mt-1 text-sm text-ink_text-muted">{job.organization}{job.department ? ` · ${job.department}` : ""}</p>
          </div>
          <DeadlineBadge status={job.status} applicationEnd={job.application_end} />
        </div>

        <div className="mt-3">
          <VerificationBadge lastVerifiedAt={job.last_verified_at} />
        </div>

        <div className="card mt-6 border-l-4 border-l-amber">
          <p className="text-sm font-medium text-ink">
            Before applying, verify the latest details in the official notification.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {job.official_url ? (
            <a href={job.official_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Apply on Official Website
            </a>
          ) : (
            <span className="rounded-card bg-ink-50 px-4 py-3 text-sm text-ink_text-muted">
              Official application link not available yet
            </span>
          )}
          {job.notification_url && (
            <a href={job.notification_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Official Notification
            </a>
          )}
          {user && (
            <button type="button" onClick={toggleBookmark} disabled={savingBookmark} className="btn-secondary">
              {saved ? "Saved ✓" : "Save Job"}
            </button>
          )}
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
          <Field label="State" value={job.state} />
          <Field label="Job type" value={job.job_type} />
          <Field label="Qualification" value={job.qualification} />
          <Field label="Stream" value={job.stream} />
          <Field label="Vacancies" value={job.vacancies} />
          <Field label="Age range" value={job.age_min || job.age_max ? `${job.age_min ?? "?"}–${job.age_max ?? "?"} yrs` : null} />
          <Field label="Salary" value={job.salary_min || job.salary_max ? `₹${job.salary_min ?? "?"} – ₹${job.salary_max ?? "?"}` : null} />
          <Field label="Application start" value={formatDate(job.application_start)} />
          <Field label="Application deadline" value={formatDate(job.application_end)} />
          <Field label="Exam date" value={formatDate(job.exam_date)} />
        </dl>

        {job.selection_process && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-ink">Selection Process</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink_text">{job.selection_process}</p>
          </div>
        )}

        {job.description && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-ink">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink_text">{job.description}</p>
          </div>
        )}

        {(job.eligible_categories?.length || job.eligible_genders?.length || job.eligible_states?.length) ? (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-ink">Eligibility</h2>
            <div className="mt-2 space-y-2 text-sm text-ink_text">
              {job.eligible_categories?.length ? <p>Categories: {job.eligible_categories.join(", ")}</p> : null}
              {job.eligible_genders?.length ? <p>Genders: {job.eligible_genders.join(", ")}</p> : null}
              {job.eligible_states?.length ? <p>States: {job.eligible_states.join(", ")}</p> : null}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
