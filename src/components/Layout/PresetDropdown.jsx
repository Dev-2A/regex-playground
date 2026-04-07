import { useState, useRef, useEffect } from "react";
import { presets } from "../../data/presets";

function PresetDropdown({ onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
      >
        📋 예제
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              프리셋 예제
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onSelect(preset);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-gray-800 transition-colors border-b border-gray-800/50 last:border-b-0"
              >
                <p className="text-sm text-gray-200">{preset.name}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">
                  /{preset.pattern.slice(0, 40)}
                  {preset.pattern.length > 40 ? "..." : ""}/{preset.flags}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PresetDropdown;
