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
    <div className="p-3 md:p-4 border-b border-gray-800">
      <div className="flex items-center justify-between mb-2 gap-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider shrink-0">
          Regular Expression
        </p>
        <div className="flex items-center gap-1 md:gap-2">
          {pattern && (
            <button
              onClick={onSave}
              className="px-2 py-1 rounded text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors shrink-0"
              title="히스토리에 저장"
            >
              💾
              <span className="hidden sm:inline ml-1">저장</span>
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
        <span className="pl-3 md:pl-4 text-gray-500 font-mono text-sm select-none">
          /
        </span>
        <input
          type="text"
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          placeholder="정규식을 입력하세요..."
          spellCheck={false}
          className="flex-1 bg-transparent px-2 py-2.5 md:py-3 font-mono text-sm text-gray-100 outline-none placeholder:text-gray-600 min-w-0"
        />
        <span className="pr-3 md:pr-4 text-gray-500 font-mono text-sm select-none shrink-0">
          /
          {Object.entries(flags)
            .filter(([, v]) => v)
            .map(([k]) => k)
            .join("")}
        </span>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 font-mono break-all">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

export default RegexInput;
