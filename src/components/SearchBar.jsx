export default function SearchBar({ value, onChange, placeholder = "Search jobs or organizations" }) {
  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        {placeholder}
      </label>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="9" cy="9" r="6" stroke="#5B6472" strokeWidth="1.6" />
        <path d="M14 14l4 4" stroke="#5B6472" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-card border border-surface-border bg-white py-3 pl-10 pr-4 text-sm text-ink_text focus-visible:border-ink"
      />
    </div>
  );
}
