export const cheatsheetData = [
  {
    category: "문자 클래스",
    icon: "🔤",
    items: [
      { syntax: ".", desc: "줄바꿈 제외 모든 문자", example: "a.c → abc, a1c" },
      { syntax: "\\d", desc: "숫자 [0-9]", example: "\\d → 3, 7" },
      { syntax: "\\D", desc: "숫자 아닌 문자", example: "\\D → a, !" },
      {
        syntax: "\\w",
        desc: "단어 문자 [A-Za-z0-9_]",
        example: "\\w → a, 3, _",
      },
      { syntax: "\\W", desc: "단어 아닌 문자", example: "\\W → @, !" },
      { syntax: "\\s", desc: "공백 문자", example: "\\s → 스페이스, 탭" },
      { syntax: "\\S", desc: "공백 아닌 문자", example: "\\S → a, 1" },
    ],
  },
  {
    category: "문자 셋",
    icon: "📦",
    items: [
      { syntax: "[abc]", desc: "a, b, c 중 하나", example: "[abc] → a" },
      { syntax: "[^abc]", desc: "a, b, c 제외", example: "[^abc] → d, 1" },
      { syntax: "[a-z]", desc: "a부터 z까지", example: "[a-z] → m" },
      { syntax: "[A-Z]", desc: "A부터 Z까지", example: "[A-Z] → M" },
      { syntax: "[0-9]", desc: "0부터 9까지", example: "[0-9] → 5" },
    ],
  },
  {
    category: "수량자",
    icon: "🔢",
    items: [
      { syntax: "*", desc: "0회 이상", example: "ab*c → ac, abc, abbc" },
      { syntax: "+", desc: "1회 이상", example: "ab+c → abc, abbc" },
      { syntax: "?", desc: "0회 또는 1회", example: "colou?r → color, colour" },
      { syntax: "{n}", desc: "정확히 n회", example: "a{3} → aaa" },
      { syntax: "{n,}", desc: "n회 이상", example: "a{2,} → aa, aaa" },
      { syntax: "{n,m}", desc: "n~m회", example: "a{2,4} → aa, aaa, aaaa" },
      { syntax: "*?", desc: "0회 이상 (비탐욕)", example: "최소 매치 우선" },
      { syntax: "+?", desc: "1회 이상 (비탐욕)", example: "최소 매치 우선" },
    ],
  },
  {
    category: "앵커",
    icon: "⚓",
    items: [
      { syntax: "^", desc: "문자열/줄 시작", example: "^Hello → Hello..." },
      { syntax: "$", desc: "문자열/줄 끝", example: "world$ → ...world" },
      { syntax: "\\b", desc: "단어 경계", example: "\\bword\\b → word" },
      { syntax: "\\B", desc: "비단어 경계", example: "\\Bword → sword" },
    ],
  },
  {
    category: "그룹 & 참조",
    icon: "🔗",
    items: [
      { syntax: "(abc)", desc: "캡처 그룹", example: "(ab)+ → abab" },
      { syntax: "(?:abc)", desc: "비캡처 그룹", example: "(?:ab)+ → abab" },
      { syntax: "(?<name>)", desc: "네임드 그룹", example: "(?<year>\\d{4})" },
      { syntax: "\\1", desc: "역참조 (그룹 1)", example: "(a)\\1 → aa" },
      { syntax: "a|b", desc: "교대 (OR)", example: "cat|dog → cat, dog" },
    ],
  },
  {
    category: "전방탐색",
    icon: "👀",
    items: [
      {
        syntax: "(?=abc)",
        desc: "긍정 전방탐색",
        example: "a(?=b) → a (뒤에 b 올 때)",
      },
      {
        syntax: "(?!abc)",
        desc: "부정 전방탐색",
        example: "a(?!b) → a (뒤에 b 안 올 때)",
      },
    ],
  },
  {
    category: "플래그",
    icon: "🚩",
    items: [
      {
        syntax: "g",
        desc: "global — 모든 매치 검색",
        example: "첫 번째만이 아닌 전체",
      },
      {
        syntax: "i",
        desc: "insensitive — 대소문자 무시",
        example: "/abc/i → ABC",
      },
      {
        syntax: "m",
        desc: "multiline — ^$가 줄 단위",
        example: "여러 줄 텍스트 매칭",
      },
      {
        syntax: "s",
        desc: "dotAll — .이 줄바꿈 포함",
        example: ".이 \\n도 매치",
      },
    ],
  },
];
