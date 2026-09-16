export default function ErrorState({ onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-card border border-closed-50 bg-closed-50/40 px-6 py-10 text-center"
    >
      <h3 className="text-base font-semibold text-closed">Something went wrong</h3>
      <p className="max-w-prose text-sm text-ink_text-muted">
        We couldn&apos;t load this right now. Please check your connection and try again.
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary">
          Try again
        </button>
      )}
    </div>
  );
}
