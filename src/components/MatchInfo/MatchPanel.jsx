import { useMemo } from "react";
import { getMatches } from "../../utils/matchHelper";

const MATCH_COLORS = [
  "border-blue-400 bg-blue-500/10",
  "border-emerald-400 bg-emerald-500/10",
  "border-amber-400 bg-amber-500/10",
  "border-purple-400 bg-purple-500/10",
  "border-rose-400 bg-rose-500/10",
  "border-cyan-400 bg-cyan-500/10",
];

function MatchPanel({ regex, testString = "" }) {
  const matches = useMemo(
    () => getMatches(regex, testString),
    [regex, testString],
  );

  return (
    <div className="p-3 md:p-4 border-t border-gray-800 h-44 md:h-52 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Match Information
        </p>
        {matches.length > 0 && (
          <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
            {matches.length}개 매치
          </span>
        )}
      </div>

      {!regex && (
        <div className="flex flex-col items-center justify-center py-6 text-gray-600">
          <span className="text-2xl mb-2">🔍</span>
          <p className="text-sm">정규식을 입력하면 매치 정보가 표시됩니다.</p>
        </div>
      )}

      {regex && matches.length === 0 && testString && (
        <div className="flex flex-col items-center justify-center py-6 text-gray-600">
          <span className="text-2xl mb-2">🚫</span>
          <p className="text-sm">매치 결과 없음</p>
        </div>
      )}

      {regex && !testString && (
        <div className="flex flex-col items-center justify-center py-6 text-gray-600">
          <span className="text-2xl mb-2">📝</span>
          <p className="text-sm">테스트 문자열을 입력하세요.</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-2">
          {matches.map((match, i) => (
            <MatchItem key={i} match={match} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function MatchItem({ match, index }) {
  const colorClass = MATCH_COLORS[index % MATCH_COLORS.length];
  const hasGroups = match.groups.length > 0;
  const hasNamedGroups = Object.keys(match.namedGroups).length > 0;

  return (
    <div className={`border-l-2 ${colorClass} rounded-r-lg px-3 py-2`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-gray-400">
          Match #{index + 1}
        </span>
        <span className="text-xs text-gray-500 font-mono">
          [{match.index}–{match.end}]
        </span>
      </div>

      <div className="font-mono text-sm text-gray-200 bg-gray-900/50 rounded px-2 py-1 mb-1 break-all">
        {match.value || <span className="text-gray-500 italic">빈 문자열</span>}
      </div>

      {hasGroups && (
        <div className="mt-2 space-y-1">
          {match.groups.map((group, gi) => (
            <div key={gi} className="flex items-start gap-2 text-xs">
              <span className="text-gray-500 font-mono shrink-0">
                Group {gi + 1}:
              </span>
              <span className="text-gray-300 font-mono break-all">
                {group ?? (
                  <span className="text-gray-600 italic">undefined</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {hasNamedGroups && (
        <div className="mt-2 space-y-1">
          {Object.entries(match.namedGroups).map(([name, value]) => (
            <div key={name} className="flex items-start gap-2 text-xs">
              <span className="text-blue-400 font-mono shrink-0">
                &lt;{name}&gt;:
              </span>
              <span className="text-gray-300 font-mono break-all">
                {value ?? (
                  <span className="text-gray-600 italic">undefined</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchPanel;
