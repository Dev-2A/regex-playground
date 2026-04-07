function ZoomControls({ scale, onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="flex items-center gap-1 bg-gray-800/80 backdrop-blur rounded-lg p-1">
      <button
        onClick={onZoomOut}
        className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors text-sm font-bold"
        title="축소"
      >
        −
      </button>
      <button
        onClick={onReset}
        className="px-2 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors text-xs font-mono"
        title="리셋"
      >
        {Math.round(scale * 100)}%
      </button>
      <button
        onClick={onZoomIn}
        className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors text-sm font-bold"
        title="확대"
      >
        +
      </button>
    </div>
  );
}

export default ZoomControls;
