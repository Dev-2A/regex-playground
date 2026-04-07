import { useMemo } from "react";
import { measureNode } from "../../utils/diagramLayout";
import RailroadRenderer from "./RailroadRenderer";

function DiagramPanel({ ast, parseError }) {
  const layout = useMemo(() => {
    if (!ast) return null;
    return measureNode(ast);
  }, [ast]);

  return (
    <div className="flex-1 p-4 min-h-0 flex flex-col">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        Railroad Diagram
      </p>

      <div className="flex-1 bg-gray-900 rounded-lg overflow-auto min-h-0 flex items-center justify-center">
        {!ast && !parseError && (
          <p className="text-sm text-gray-600">
            정규식을 입력하면 구조가 시각화됩니다.
          </p>
        )}

        {parseError && (
          <p className="text-sm text-red-400 font-mono px-4">⚠ {parseError}</p>
        )}

        {layout && (
          <div className="p-4">
            <RailroadRenderer layout={layout} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DiagramPanel;
