import { Link } from "react-router-dom";
import DeadlineBadge from "./DeadlineBadge";
import VerificationBadge from "./VerificationBadge";
import { formatDate } from "../utils/deadline";

export default function ExamCard({ exam }) {
  return (
    <Link
      to={`/exams/${exam.slug}`}
      className="card block border-l-4 border-l-ink-100 transition-shadow hover:shadow-sm focus-visible:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-ink">{exam.name}</h3>
          <p className="mt-0.5 truncate text-sm text-ink_text-muted">{exam.organization}</p>
        </div>
        <DeadlineBadge status={exam.status} applicationEnd={exam.application_end} className="shrink-0" />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-ink_text-muted">
        {exam.level && <dd>{exam.level}</dd>}
        {exam.exam_date && <dd>Exam: {formatDate(exam.exam_date)}</dd>}
      </dl>

      <div className="mt-3 border-t border-surface-border pt-2">
        <VerificationBadge lastVerifiedAt={exam.last_verified_at} />
      </div>
    </Link>
  );
}
