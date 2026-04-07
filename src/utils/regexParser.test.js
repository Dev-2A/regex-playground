import { parseRegex, NodeType } from "./regexParser.js";

const tests = [
  { pattern: "abc", desc: "리터럴 연속" },
  { pattern: "a|b|c", desc: "교대" },
  { pattern: "(abc)", desc: "캡처 그룹" },
  { pattern: "(?:abc)", desc: "비캡처 그룹" },
  { pattern: "(?<name>abc)", desc: "네임드 그룹" },
  { pattern: "[a-z]", desc: "문자 클래스 범위" },
  { pattern: "[^abc]", desc: "부정 문자 클래스" },
  { pattern: "\\d+", desc: "이스케이프 + 수량자" },
  { pattern: "a{2,5}", desc: "범위 수량자" },
  { pattern: "^hello$", desc: "앵커" },
  { pattern: ".", desc: "any" },
  { pattern: "(\\w+)@(\\w+\\.\\w+)", desc: "이메일 패턴" },
];

tests.forEach(({ pattern, desc }) => {
  const { ast, error } = parseRegex(pattern);
  console.log(`\n[${desc}] /${pattern}/`);
  if (error) {
    console.log("  ❌ Error:", error);
  } else {
    console.log("  ✅", JSON.stringify(ast, null, 2).slice(0, 200));
  }
});
