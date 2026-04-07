import { useMemo, useCallback } from "react";
import { measureNode } from "../../utils/diagramLayout";
import RailroadRenderer from "./RailroadRenderer";
import ZoomControls from "./ZoomControls";
import { usePanZoom } from "../../hooks/usePanZoom";

function DiagramPanel({ ast, parseError }) {
  const layout = useMemo(() => {
    if (!ast) return null;
    return measureNode(ast);
  }, [ast]);

  const { containerRef, transform, resetTransform, handlers } = usePanZoom();

  const handleZoomIn = useCallback(() => {
    const event = new WheelEvent("wheel", { deltaY: -100 });
    containerRef.current?.dispatchEvent(event);
  }, [containerRef]);

  const handleZoomOut = useCallback(() => {
    const event = new WheelEvent("wheel", { deltaY: 100 });
    containerRef.current?.dispatchEvent(event);
  }, [containerRef]);

  return (
    <div className="flex-1 p-3 md:p-4 min-h-0 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Railroad Diagram
        </p>
        {layout && (
          <ZoomControls
            scale={transform.scale}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={resetTransform}
          />
        )}
      </div>

      <div
        ref={containerRef}
        className="flex-1 bg-gray-900 rounded-lg overflow-hidden min-h-0 relative"
        style={{ cursor: layout ? "grab" : "default" }}
        {...(layout ? handlers : {})}
      >
        {!ast && !parseError && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <span className="text-4xl mb-3">🛤️</span>
            <p className="text-sm">정규식을 입력하면 구조가 시각화됩니다.</p>
            <p className="text-xs text-gray-700 mt-1">
              Railroad Diagram으로 흐름을 한눈에 파악하세요
            </p>
          </div>
        )}

        {parseError && (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-2xl mb-2">⚠️</span>
            <p className="text-sm text-red-400 font-mono px-4 text-center">
              {parseError}
            </p>
          </div>
        )}

        {layout && (
          <div
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transformOrigin: "0 0",
              transition: "none",
            }}
            className="p-4 inline-block"
          >
            <RailroadRenderer layout={layout} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DiagramPanel;
