const MATCH_COLORS = [
  "bg-blue-500/30 border-b-2 border-blue-400",
  "bg-emerald-500/30 border-b-2 border-emerald-400",
  "bg-amber-500/30 border-b-2 border-amber-400",
  "bg-purple-500/30 border-b-2 border-purple-400",
  "bg-rose-500/30 border-b-2 border-rose-400",
  "bg-cyan-500/30 border-b-2 border-cyan-400",
];

function HighlightedText({ segments }) {
  return (
    <div className="whitespace-pre-wrap break-all font-mono text-sm leading-relaxed">
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark
            key={i}
            className={`
              ${MATCH_COLORS[seg.matchIndex % MATCH_COLORS.length]}
              text-gray-100 rounded-sm px-px
            `}
            title={`Match #${seg.matchIndex + 1}`}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i} className="text-gray-300">
            {seg.text}
          </span>
        ),
      )}
    </div>
  );
}

export default HighlightedText;
