export default function MatchReasons({ reasons }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {reasons.map((reason, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span aria-hidden="true" className="mt-0.5 shrink-0">
            {reason.ok === true && <span className="text-verified">✓</span>}
            {reason.ok === false && <span className="text-closed">✕</span>}
            {reason.ok === null && <span className="text-ink_text-muted">–</span>}
          </span>
          <span className={reason.ok === false ? "text-closed" : "text-ink_text"}>
            {reason.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
