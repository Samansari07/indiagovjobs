export default function EmptyState({
  title = "Nothing here yet",
  description = "",
  action = null,
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-surface-border px-6 py-12 text-center">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-prose text-sm text-ink_text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
