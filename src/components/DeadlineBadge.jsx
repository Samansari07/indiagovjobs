import { getDeadlineInfo } from "../utils/deadline";

const TONE_STYLES = {
  closed: "bg-closed-50 text-closed",
  urgent: "bg-closed-50 text-closed",
  soon: "bg-amber-50 text-amber-600",
  open: "bg-verified-50 text-verified",
  neutral: "bg-ink-50 text-ink-400",
};

export default function DeadlineBadge({ status, applicationEnd, className = "" }) {
  const { label, tone } = getDeadlineInfo(status, applicationEnd);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_STYLES[tone]} ${className}`}
    >
      {label}
    </span>
  );
}
