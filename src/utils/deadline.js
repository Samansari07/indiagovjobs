// Single source of truth for all deadline/date logic.
// Never recompute "days left" inline in a component — always call these.

/**
 * Returns a whole number of calendar days between "today" (local) and the
 * given deadline date (local, midnight-normalized). Positive = future.
 */
function daysUntil(dateString) {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);

  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target - today) / msPerDay);
}

/**
 * Given a job/exam's status field and application_end date, return a
 * label + tone for UI display. Never trust "days left" alone — a closed
 * status always wins over the date math.
 */
export function getDeadlineInfo(status, applicationEndDate) {
  if (status && status !== "open") {
    return { label: "Application Closed", tone: "closed", days: null };
  }

  if (!applicationEndDate) {
    return { label: "Deadline not specified", tone: "neutral", days: null };
  }

  const days = daysUntil(applicationEndDate);

  if (days < 0) {
    return { label: "Application Closed", tone: "closed", days };
  }
  if (days === 0) {
    return { label: "Closing Today", tone: "urgent", days };
  }
  if (days === 1) {
    return { label: "Closes Tomorrow", tone: "urgent", days };
  }
  if (days <= 3) {
    return { label: `${days} Days Left`, tone: "urgent", days };
  }
  if (days <= 7) {
    return { label: `${days} Days Left`, tone: "soon", days };
  }
  if (days <= 14) {
    return { label: "Closing Soon", tone: "soon", days };
  }
  return { label: "Open", tone: "open", days };
}

export function formatDate(dateString) {
  if (!dateString) return "Not specified";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "Not specified";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatLastVerified(dateString) {
  if (!dateString) return "Verification needed";
  return formatDate(dateString);
}
