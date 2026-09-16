import { Link } from "react-router-dom";
import DeadlineBadge from "./DeadlineBadge";
import VerificationBadge from "./VerificationBadge";
import { getDeadlineInfo } from "../utils/deadline";

const BORDER_TONE = {
  closed: "border-l-closed",
  urgent: "border-l-closed",
  soon: "border-l-amber",
  open: "border-l-verified",
  neutral: "border-l-ink-100",
};

export default function JobCard({ job }) {
  const { tone } = getDeadlineInfo(job.status, job.application_end);

  return (
    <Link
      to={`/jobs/${job.slug}`}
      className={`card block border-l-4 ${BORDER_TONE[tone]} transition-shadow hover:shadow-sm focus-visible:shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-ink">{job.title}</h3>
          <p className="mt-0.5 truncate text-sm text-ink_text-muted">{job.organization}</p>
        </div>
        <DeadlineBadge status={job.status} applicationEnd={job.application_end} className="shrink-0" />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-ink_text-muted">
        {job.state && (
          <div className="flex gap-1">
            <dt className="sr-only">State</dt>
            <dd>{job.state}</dd>
          </div>
        )}
        {job.qualification && (
          <div className="flex gap-1">
            <dt className="sr-only">Qualification</dt>
            <dd>{job.qualification}</dd>
          </div>
        )}
        {job.vacancies != null && (
          <div className="flex gap-1">
            <dt className="sr-only">Vacancies</dt>
            <dd>{job.vacancies} vacancies</dd>
          </div>
        )}
      </dl>

      <div className="mt-3 border-t border-surface-border pt-2">
        <VerificationBadge lastVerifiedAt={job.last_verified_at} />
      </div>
    </Link>
  );
}
