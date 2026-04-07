import { useState } from "react";

function HistoryPanel({ history, onSelect, onRemove, onClear }) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="px-4 py-2">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <span>▶</span>
          <span className="uppercase tracking-wider">
            History ({history.length})
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(true)}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            title="접기"
          >
            ▼
          </button>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            History ({history.length})
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            전체 삭제
          </button>
        )}
      </div>

      {/* 히스토리 리스트 — 가로 스크롤 */}
      {history.length === 0 ? (
        <p className="text-xs text-gray-600">
          정규식을 입력하고 저장 버튼을 누르면 히스토리에 기록됩니다.
        </p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {history.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryItem({ item, onSelect, onRemove }) {
  const timeAgo = getTimeAgo(item.timestamp);

  return (
    <div className="shrink-0 group relative bg-gray-900 rounded-lg px-3 py-2 hover:bg-gray-800 transition-colors min-w-[160px] max-w-[240px]">
      {/* 삭제 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded text-gray-600 hover:text-red-400 hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all text-xs"
        title="삭제"
      >
        ✕
      </button>

      {/* 클릭하면 불러오기 */}
      <button onClick={() => onSelect(item)} className="text-left w-full">
        <div className="flex items-center gap-1 mb-1">
          <code className="text-xs font-mono text-blue-400 truncate max-w-[180px]">
            /{item.pattern}/{item.flags}
          </code>
        </div>
        {item.testString && (
          <p className="text-xs text-gray-500 truncate">{item.testString}</p>
        )}
        <p className="text-xs text-gray-600 mt-1">{timeAgo}</p>
      </button>
    </div>
  );
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 30) return `${days}일 전`;
  return new Date(timestamp).toLocaleDateString("ko-KR");
}

export default HistoryPanel;
