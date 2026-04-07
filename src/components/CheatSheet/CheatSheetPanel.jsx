import { useState } from "react";
import { cheatsheetData } from "../../data/cheatsheet";

function CheatSheetPanel({ onInsertPattern }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="border-t border-gray-800 px-4 py-2">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <span>▶</span>
          <span className="uppercase tracking-wider">Cheat Sheet</span>
        </button>
      </div>
    );
  }

  const currentCategory = cheatsheetData[activeCategory];

  return (
    <div className="border-t border-gray-800 flex flex-col h-56">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Cheat Sheet
        </p>
        <button
          onClick={() => setCollapsed(true)}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          title="접기"
        >
          ▼
        </button>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-1 px-4 pb-2 overflow-x-auto scrollbar-hide">
        {cheatsheetData.map((cat, i) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(i)}
            className={`
              shrink-0 px-2 py-1 rounded text-xs transition-all duration-150
              ${
                i === activeCategory
                  ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
              }
            `}
          >
            {cat.icon} {cat.category}
          </button>
        ))}
      </div>

      {/* 아이템 목록 */}
      <div className="flex-1 overflow-y-auto px-4 pb-3 min-h-0">
        <div className="space-y-1">
          {currentCategory.items.map((item, i) => (
            <CheatSheetItem key={i} item={item} onInsert={onInsertPattern} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CheatSheetItem({ item, onInsert }) {
  return (
    <button
      onClick={() => onInsert?.(item.syntax)}
      className="w-full flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/60 transition-colors text-left group"
    >
      {/* 문법 */}
      <code className="shrink-0 text-sm font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded min-w-[60px] text-center">
        {item.syntax}
      </code>

      {/* 설명 + 예제 */}
      <div className="min-w-0">
        <p className="text-sm text-gray-300">{item.desc}</p>
        <p className="text-xs text-gray-500 mt-0.5 font-mono truncate">
          {item.example}
        </p>
      </div>

      {/* 삽입 힌트 */}
      <span className="shrink-0 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
        클릭하여 삽입
      </span>
    </button>
  );
}

export default CheatSheetPanel;
