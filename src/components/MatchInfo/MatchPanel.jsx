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
    <div className="p-4 border-t border-gray-800 h-52 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Match Information
        </p>
        {matches.length > 0 && (
          <span className="text-xs text-gray-400">{matches.length}개 매치</span>
        )}
      </div>

      {!regex && (
        <p className="text-sm text-gray-600">
          정규식을 입력하면 매치 정보가 표시됩니다.
        </p>
      )}

      {regex && matches.length === 0 && testString && (
        <p className="text-sm text-gray-600">매치 결과 없음</p>
      )}

      {regex && !testString && (
        <p className="text-sm text-gray-600">테스트 문자열을 입력하세요.</p>
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
      {/* 매치 헤더 */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-gray-400">
          Match #{index + 1}
        </span>
        <span className="text-xs text-gray-500 font-mono">
          [{match.index}–{match.end}]
        </span>
      </div>

      {/* 매치 값 */}
      <div className="font-mono text-sm text-gray-200 bg-gray-900/50 rounded px-2 py-1 mb-1 break-all">
        {match.value || <span className="text-gray-500 italic">빈 문자열</span>}
      </div>

      {/* 캡처 그룹 */}
      {hasGroups && (
        <div className="mt-2 space-y-1">
          {match.groups.map((group, gi) => (
            <div key={gi} className="flex items-center gap-2 text-xs">
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

      {/* 네임드 캡처 그룹 */}
      {hasNamedGroups && (
        <div className="mt-2 space-y-1">
          {Object.entries(match.namedGroups).map(([name, value]) => (
            <div key={name} className="flex items-center gap-2 text-xs">
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
