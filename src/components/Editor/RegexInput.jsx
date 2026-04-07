import FlagToggle from "./FlagToggle";

function RegexInput({
  pattern,
  onPatternChange,
  flags = {},
  onToggleFlag,
  error,
  onSave,
}) {
  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Regular Expression
        </p>
        <div className="flex items-center gap-2">
          {pattern && (
            <button
              onClick={onSave}
              className="px-2 py-1 rounded text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
              title="히스토리에 저장"
            >
              💾 저장
            </button>
          )}
          <FlagToggle flags={flags} onToggle={onToggleFlag} />
        </div>
      </div>

      <div
        className={`
          flex items-center bg-gray-900 rounded-lg ring-1 transition-colors
          ${error ? "ring-red-500/50" : "ring-gray-800 focus-within:ring-blue-500/50"}
        `}
      >
        <span className="pl-4 text-gray-500 font-mono text-sm select-none">
          /
        </span>
        <input
          type="text"
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          placeholder="정규식을 입력하세요... (예: \d{3}-\d{4})"
          spellCheck={false}
          className="flex-1 bg-transparent px-2 py-3 font-mono text-sm text-gray-100 outline-none placeholder:text-gray-600"
        />
        <span className="pr-4 text-gray-500 font-mono text-sm select-none">
          /
          {Object.entries(flags)
            .filter(([, v]) => v)
            .map(([k]) => k)
            .join("")}
        </span>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 font-mono">⚠ {error}</p>
      )}
    </div>
  );
}

export default RegexInput;
