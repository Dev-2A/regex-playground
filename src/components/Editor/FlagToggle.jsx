const FLAG_INFO = {
  g: { label: "global", desc: "모든 매치 검색" },
  i: { label: "insensitive", desc: "대소문자 무시" },
  m: { label: "multiline", desc: "^$가 각 줄에 매치" },
  s: { label: "dotAll", desc: ".이 줄바꿈도 매치" },
};

function FlaggToggle({ flags = {}, onToggle }) {
  return (
    <div className="flex items-center gap-1">
      {Object.entries(FLAG_INFO).map(([key, { label, desc }]) => (
        <button
          key={key}
          onClick={() => onToggle(key)}
          title={`${label} — ${desc}`}
          className={`
            px-2 py-1 rounded text-xs font-mono font-bold transition-all duration-150
            ${
              flags[key]
                ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40"
                : "bg-gray-800 text-gray-500 hover:text-gray-400 hover:bg-gray-750"
            }
          `}
        >
          {key}
        </button>
      ))}
    </div>
  );
}

export default FlaggToggle;
