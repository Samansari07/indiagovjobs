export default function MatchScore({ score }) {
  const tone = score >= 80 ? "text-verified" : score >= 50 ? "text-amber-600" : "text-ink_text-muted";
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative h-12 w-12 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(#1F8A5F ${score}%, #E4E7EC 0)`,
        }}
        role="img"
        aria-label={`${score} percent match`}
      >
        <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white text-xs font-bold text-ink">
          {score}%
        </div>
      </div>
      <span className={`text-sm font-semibold ${tone}`}>Match</span>
    </div>
  );
}
