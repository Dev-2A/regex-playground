import { useMemo } from "react";
import { getMatches, buildHighlightSegments } from "../../utils/matchHelper";
import HighlightedText from "./HighlightedText";

function TestStringInput({ testString = "", onTestStringChange, regex }) {
  const matches = useMemo(
    () => getMatches(regex, testString),
    [regex, testString],
  );
  const segments = useMemo(
    () => buildHighlightSegments(testString, matches),
    [testString, matches],
  );

  return (
    <div className="flex-1 p-4 min-h-0 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Test String
        </p>
        {matches.length > 0 && (
          <span className="text-xs text-blue-400">{matches.length}개 매치</span>
        )}
      </div>

      <div className="relative flex-1 min-h-0">
        {/* 하이라이팅 오버레이 */}
        <div className="absolute inset-0 z-0 bg-gray-900 rounded-lg px-4 py-3 overflow-auto pointer-events-none">
          <HighlightedText segments={segments} />
        </div>

        {/* 실제 입력 textarea */}
        <textarea
          value={testString}
          onChange={(e) => onTestStringChange(e.target.value)}
          placeholder="매칭할 테스트 문자열을 입력하세요..."
          spellCheck={false}
          className="relative z-10 w-full h-full bg-transparent rounded-lg px-4 py-3 font-mono text-sm text-transparent caret-gray-100 outline-none resize-none ring-1 ring-gray-800 focus:ring-blue-500/50 transition-colors placeholder:text-gray-600"
        />
      </div>
    </div>
  );
}

export default TestStringInput;
