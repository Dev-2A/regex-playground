import { useMemo } from "react";

function ReplaceInput({
  replaceValue,
  onReplaceChange,
  regex,
  testString,
  visible,
  onToggle,
}) {
  const replaceResult = useMemo(() => {
    if (!regex || !testString || !replaceValue) return null;
    try {
      return testString.replace(regex, replaceValue);
    } catch {
      return null;
    }
  }, [regex, testString, replaceValue]);

  const replaceCount = useMemo(() => {
    if (!regex || !testString) return 0;
    try {
      const matches = testString.match(regex);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [regex, testString]);

  return (
    <div className="border-b border-gray-800">
      {/* 토글 버튼 */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        <span>{visible ? "▼" : "▶"}</span>
        <span className="uppercase tracking-wider">Replace Mode</span>
        {visible && replaceCount > 0 && replaceValue && (
          <span className="text-blue-400 ml-auto">{replaceCount}건 치환</span>
        )}
      </button>

      {visible && (
        <div className="px-4 pb-4 space-y-3">
          {/* 치환 문자열 입력 */}
          <div>
            <p className="text-xs text-gray-500 mb-1">치환 문자열</p>
            <input
              type="text"
              value={replaceValue}
              onChange={(e) => onReplaceChange(e.target.value)}
              placeholder="치환할 문자열 (예: $1-$2, 역참조 사용 가능)"
              spellCheck={false}
              className="w-full bg-gray-900 rounded-lg px-4 py-2.5 font-mono text-sm text-gray-100 outline-none ring-1 ring-gray-800 focus:ring-blue-500/50 transition-colors placeholder:text-gray-600"
            />
          </div>

          {/* 치환 도우미 버튼 */}
          <div className="flex flex-wrap gap-1">
            {["$1", "$2", "$&", "$`", "$'", "$$"].map((token) => (
              <button
                key={token}
                onClick={() => onReplaceChange(replaceValue + token)}
                className="px-2 py-1 rounded text-xs font-mono bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
                title={getReplaceTokenDesc(token)}
              >
                {token}
              </button>
            ))}
          </div>

          {/* 치환 결과 미리보기 */}
          {replaceResult !== null && (
            <div>
              <p className="text-xs text-gray-500 mb-1">치환 결과 미리보기</p>
              <div className="bg-gray-900 rounded-lg px-4 py-3 ring-1 ring-gray-800 min-h-[60px] max-h-[120px] overflow-y-auto">
                <ReplacePreview
                  original={testString}
                  result={replaceResult}
                  regex={regex}
                  replaceValue={replaceValue}
                />
              </div>
            </div>
          )}

          {regex && testString && !replaceValue && (
            <p className="text-xs text-gray-600">
              치환 문자열을 입력하면 결과를 미리 볼 수 있습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ReplacePreview({ original, result, regex, replaceValue }) {
  if (!replaceValue) return null;

  // 원본에서 매치된 부분과 치환된 부분을 diff 스타일로 보여줌
  return (
    <div className="space-y-2">
      {/* 원본 (삭선) */}
      <div className="flex items-start gap-2">
        <span className="shrink-0 text-xs font-bold text-red-400 mt-0.5 w-8">
          원본
        </span>
        <div className="font-mono text-sm text-gray-400 whitespace-pre-wrap break-all">
          <OriginalWithStrikethrough text={original} regex={regex} />
        </div>
      </div>

      {/* 결과 */}
      <div className="flex items-start gap-2">
        <span className="shrink-0 text-xs font-bold text-emerald-400 mt-0.5 w-8">
          결과
        </span>
        <div className="font-mono text-sm text-gray-200 whitespace-pre-wrap break-all">
          <ResultWithHighlight
            original={original}
            result={result}
            regex={regex}
            replaceValue={replaceValue}
          />
        </div>
      </div>
    </div>
  );
}

function OriginalWithStrikethrough({ text, regex }) {
  if (!regex) return <span>{text}</span>;

  const parts = [];
  const re = new RegExp(regex.source, regex.flags);
  let lastIndex = 0;
  let match;

  if (re.flags.includes("g")) {
    while ((match = re.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`t-${lastIndex}`}>
            {text.slice(lastIndex, match.index)}
          </span>,
        );
      }
      parts.push(
        <span
          key={`m-${match.index}`}
          className="line-through text-red-400 bg-red-500/10 rounded-sm px-[1px]"
        >
          {match[0]}
        </span>,
      );
      lastIndex = match.index + match[0].length;
      if (match[0].length === 0) {
        re.lastIndex++;
      }
    }
  } else {
    match = re.exec(text);
    if (match) {
      if (match.index > 0) {
        parts.push(<span key="pre">{text.slice(0, match.index)}</span>);
      }
      parts.push(
        <span
          key="match"
          className="line-through text-red-400 bg-red-500/10 rounded-sm px-[1px]"
        >
          {match[0]}
        </span>,
      );
      lastIndex = match.index + match[0].length;
    }
  }

  if (lastIndex < text.length) {
    parts.push(<span key="rest">{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? <>{parts}</> : <span>{text}</span>;
}

function ResultWithHighlight({ original, result, regex, replaceValue }) {
  // 치환된 부분을 찾아서 초록색으로 하이라이팅
  // 간단한 방식: 원본에서 매치 위치를 찾고, 결과에서 치환된 텍스트를 하이라이팅

  if (!regex || !replaceValue) return <span>{result}</span>;

  const parts = [];
  const re = new RegExp(regex.source, regex.flags);
  let originalCursor = 0;
  let resultCursor = 0;
  let match;

  const matches = [];
  const reCopy = new RegExp(regex.source, regex.flags);

  if (reCopy.flags.includes("g")) {
    while ((match = reCopy.exec(original)) !== null) {
      matches.push(match);
      if (match[0].length === 0) reCopy.lastIndex++;
    }
  } else {
    match = reCopy.exec(original);
    if (match) matches.push(match);
  }

  let tempResult = result;
  let offset = 0;

  for (const m of matches) {
    const replaced = m[0].replace(
      new RegExp(regex.source, regex.flags.replace("g", "")),
      replaceValue,
    );
    const beforeMatch = original.slice(originalCursor, m.index);

    // 매치 전 부분
    if (beforeMatch) {
      parts.push(<span key={`b-${m.index}`}>{beforeMatch}</span>);
    }

    // 치환된 부분
    parts.push(
      <span
        key={`r-${m.index}`}
        className="text-emerald-300 bg-emerald-500/15 rounded-sm px-[1px]"
      >
        {replaced}
      </span>,
    );

    originalCursor = m.index + m[0].length;
  }

  // 나머지
  if (originalCursor < original.length) {
    parts.push(<span key="rest">{original.slice(originalCursor)}</span>);
  }

  return parts.length > 0 ? <>{parts}</> : <span>{result}</span>;
}

function getReplaceTokenDesc(token) {
  const map = {
    $1: "첫 번째 캡처 그룹",
    $2: "두 번째 캡처 그룹",
    "$&": "매치된 전체 문자열",
    "$`": "매치 앞의 문자열",
    "$'": "매치 뒤의 문자열",
    $$: "리터럴 $ 문자",
  };
  return map[token] || token;
}

export default ReplaceInput;
