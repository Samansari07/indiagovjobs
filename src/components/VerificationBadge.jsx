import { formatLastVerified } from "../utils/deadline";

export default function VerificationBadge({ lastVerifiedAt, className = "" }) {
  const verified = Boolean(lastVerifiedAt);
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        verified ? "text-verified" : "text-ink-400"
      } ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {verified ? (
          <path
            d="M10 2l2.2 1.6 2.7-.1.9 2.6 2.3 1.5-1 2.6 1 2.6-2.3 1.5-.9 2.6-2.7-.1L10 18l-2.2-1.6-2.7.1-.9-2.6-2.3-1.5 1-2.6-1-2.6 2.3-1.5.9-2.6 2.7.1L10 2z"
            fill="currentColor"
            opacity="0.15"
          />
        ) : null}
        <path
          d="M6 10l2.5 2.5L14 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {verified ? `Last verified: ${formatLastVerified(lastVerifiedAt)}` : "Verification needed"}
    </span>
  );
}
