import { useState } from "react";

function PanelLayout({ left, right, bottom }) {
  const [mobileTab, setMobileTab] = useState("editor");

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 모바일 탭 바 (md 이하에서만 표시) */}
      <div className="flex md:hidden border-b border-gray-800 bg-gray-950">
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
            mobileTab === "editor"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-500"
          }`}
        >
          에디터
        </button>
        <button
          onClick={() => setMobileTab("diagram")}
          className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
            mobileTab === "diagram"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-500"
          }`}
        >
          다이어그램
        </button>
        <button
          onClick={() => setMobileTab("reference")}
          className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
            mobileTab === "reference"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-500"
          }`}
        >
          레퍼런스
        </button>
      </div>

      {/* 데스크톱: 좌우 2컬럼 / 모바일: 탭 전환 */}
      <div className="flex flex-1 min-h-0">
        {/* 왼쪽 패널 */}
        <div
          className={`
            w-full md:w-1/2 flex flex-col border-r border-gray-800 min-h-0
            ${mobileTab === "editor" ? "flex" : "hidden md:flex"}
          `}
        >
          {left}
        </div>

        {/* 오른쪽 패널 */}
        <div
          className={`
            w-full md:w-1/2 flex flex-col min-h-0
            ${mobileTab === "diagram" || mobileTab === "reference" ? "flex" : "hidden md:flex"}
          `}
        >
          {right}
        </div>
      </div>

      {/* 하단: 히스토리 바 */}
      {bottom && <div className="border-t border-gray-800">{bottom}</div>}
    </div>
  );
}

export default PanelLayout;
