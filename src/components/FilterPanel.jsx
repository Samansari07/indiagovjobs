export default function FilterPanel({ filters, values, onChange, onClear }) {
  return (
    <div className="space-y-4">
      {filters.map((f) => (
        <div key={f.key}>
          <label htmlFor={f.key} className="mb-1 block text-xs font-semibold text-ink_text-muted">
            {f.label}
          </label>
          <select
            id={f.key}
            value={values[f.key] || ""}
            onChange={(e) => onChange(f.key, e.target.value)}
            className="w-full rounded-card border border-surface-border bg-white px-3 py-2.5 text-sm text-ink_text focus-visible:border-ink"
          >
            <option value="">All</option>
            {f.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button type="button" onClick={onClear} className="btn-secondary w-full">
        Clear filters
      </button>
    </div>
  );
}
