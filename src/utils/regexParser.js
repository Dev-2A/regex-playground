/**
 * Regex Parser — 정규식 문자열을 AST(Abstract Syntax Tree)로 변환
 *
 * 지원하는 문법:
 * - 리터럴 문자, 이스케이프 시퀀스 (\d, \w, \s, \b, \n, \t 등)
 * - 문자 클래스 [abc], [a-z], [^abc]
 * - 그룹 (abc), (?:abc), (?<name>abc)
 * - 수량자 *, +, ?, {n}, {n,}, {n,m}, 비탐욕 ?
 * - 앵커 ^, $
 * - 교대 a|b
 * - . (any character)
 */

// AST 노드 타입
export const NodeType = {
  ALTERNATIVE: "alternative", // a|b
  SEQUENCE: "sequence", // abc (연속)
  GROUP: "group", // (abc) 또는 (?:abc)
  QUANTIFIER: "quantifier", // a*, a+, a?, a{n,m}
  CHAR_CLASS: "charClass", // [abc]
  CHAR_RANGE: "charRange", // a-z (charClass 내부)
  LITERAL: "literal", // a, b, c
  ESCAPE: "escape", // \d, \w, \s
  DOT: "dot", // .
  ANCHOR: "anchor", // ^, $
  BACKREFERENCE: "backreference", // \1, \2
};

class RegexParser {
  constructor(pattern) {
    this.pattern = pattern;
    this.pos = 0;
    this.groupCount = 0;
  }

  parse() {
    const result = this.parseAlternative();
    if (this.pos < this.pattern.length) {
      throw new Error(
        `파싱 실패: 위치 ${this.pos}에서 예상치 못한 문자 '${this.peek()}'`,
      );
    }
    return result;
  }

  peek() {
    return this.pattern[this.pos];
  }

  advance() {
    return this.pattern[this.pos++];
  }

  hasMore() {
    return this.pos < this.pattern.length;
  }

  // 교대: a|b|c
  parseAlternative() {
    const alternatives = [this.parseSequence()];

    while (this.hasMore() && this.peek() === "|") {
      this.advance(); // '|'
      alternatives.push(this.parseSequence());
    }

    if (alternatives.length === 1) {
      return alternatives[0];
    }

    return {
      type: NodeType.ALTERNATIVE,
      alternatives,
    };
  }

  // 연속: abc
  parseSequence() {
    const items = [];

    while (this.hasMore() && this.peek() !== ")" && this.peek() !== "|") {
      items.push(this.parseQuantifier());
    }

    if (items.length === 0) {
      return { type: NodeType.LITERAL, value: "", display: "empty" };
    }

    if (items.length === 1) {
      return items[0];
    }

    return {
      type: NodeType.SEQUENCE,
      items,
    };
  }

  // 수량자: a*, a+, a?, a{n,m}
  parseQuantifier() {
    let node = this.parseAtom();

    if (this.hasMore() && isQuantifierStart(this.peek())) {
      const quantifier = this.readQuantifier();
      node = {
        type: NodeType.QUANTIFIER,
        child: node,
        ...quantifier,
      };
    }

    return node;
  }

  readQuantifier() {
    const ch = this.advance();
    let min, max, display;

    if (ch === "*") {
      min = 0;
      max = Infinity;
      display = "*";
    } else if (ch === "+") {
      min = 1;
      max = Infinity;
      display = "+";
    } else if (ch === "?") {
      min = 0;
      max = 1;
      display = "?";
    } else if (ch === "{") {
      const result = this.readBraceQuantifier();
      min = result.min;
      max = result.max;
      display = result.display;
    }

    // 비탐욕(lazy) ?
    let greedy = true;
    if (this.hasMore() && this.peek() === "?") {
      this.advance();
      greedy = false;
    }

    return { min, max, greedy, display: display + (greedy ? "" : "?") };
  }

  readBraceQuantifier() {
    let numStr = "";
    while (this.hasMore() && this.peek() >= "0" && this.peek() <= "9") {
      numStr += this.advance();
    }
    const min = parseInt(numStr, 10);

    if (this.hasMore() && this.peek() === "}") {
      this.advance();
      return { min, max: min, display: `{${min}}` };
    }

    if (this.hasMore() && this.peek() === ",") {
      this.advance();
      let maxStr = "";
      while (this.hasMore() && this.peek() >= "0" && this.peek() <= "9") {
        maxStr += this.advance();
      }
      if (this.hasMore() && this.peek() === "}") {
        this.advance();
      }
      const max = maxStr ? parseInt(maxStr, 10) : Infinity;
      const maxDisplay = maxStr || "";
      return { min, max, display: `{${min},${maxDisplay}}` };
    }

    return { min, max: min, display: `{${min}}` };
  }

  // 원자(atom): 리터럴, 그룹, 문자 클래스, . , ^, $
  parseAtom() {
    const ch = this.peek();

    if (ch === "(") {
      return this.parseGroup();
    }

    if (ch === "[") {
      return this.parseCharClass();
    }

    if (ch === "\\") {
      return this.parseEscape();
    }

    if (ch === ".") {
      this.advance();
      return { type: NodeType.DOT };
    }

    if (ch === "^") {
      this.advance();
      return { type: NodeType.ANCHOR, kind: "start" };
    }

    if (ch === "$") {
      this.advance();
      return { type: NodeType.ANCHOR, kind: "end" };
    }

    // 일반 리터럴
    this.advance();
    return { type: NodeType.LITERAL, value: ch };
  }

  // 그룹: (abc), (?:abc), (?<name>abc), (?=abc), (?!abc)
  parseGroup() {
    this.advance(); // '('

    let capturing = true;
    let name = null;
    let lookahead = null;

    if (this.hasMore() && this.peek() === "?") {
      this.advance(); // '?'

      if (this.hasMore() && this.peek() === ":") {
        this.advance(); // ':'
        capturing = false;
      } else if (this.hasMore() && this.peek() === "<") {
        this.advance(); // '<'
        // (?<name>...) 네임드 그룹
        name = "";
        while (this.hasMore() && this.peek() !== ">") {
          name += this.advance();
        }
        if (this.hasMore()) this.advance(); // '>'
      } else if (this.hasMore() && this.peek() === "=") {
        this.advance();
        capturing = false;
        lookahead = "positive";
      } else if (this.hasMore() && this.peek() === "!") {
        this.advance();
        capturing = false;
        lookahead = "negative";
      }
    }

    let groupNumber = null;
    if (capturing) {
      this.groupCount++;
      groupNumber = this.groupCount;
    }

    const child = this.parseAlternative();

    if (this.hasMore() && this.peek() === ")") {
      this.advance(); // ')'
    }

    return {
      type: NodeType.GROUP,
      capturing,
      groupNumber,
      name,
      lookahead,
      child,
    };
  }

  // 문자 클래스: [abc], [a-z], [^abc]
  parseCharClass() {
    this.advance(); // '['

    let negated = false;
    if (this.hasMore() && this.peek() === "^") {
      negated = true;
      this.advance();
    }

    const items = [];

    while (this.hasMore() && this.peek() !== "]") {
      const first = this.readCharClassAtom();

      // a-z 범위 체크
      if (
        this.hasMore() &&
        this.peek() === "-" &&
        this.pos + 1 < this.pattern.length &&
        this.pattern[this.pos + 1] !== "]"
      ) {
        this.advance(); // '-'
        const second = this.readCharClassAtom();
        items.push({
          type: NodeType.CHAR_RANGE,
          from: first,
          to: second,
          display: `${first}-${second}`,
        });
      } else {
        items.push({ type: NodeType.LITERAL, value: first });
      }
    }

    if (this.hasMore()) this.advance(); // ']'

    return {
      type: NodeType.CHAR_CLASS,
      negated,
      items,
    };
  }

  readCharClassAtom() {
    if (this.peek() === "\\") {
      this.advance();
      const ch = this.advance();
      return getEscapeDisplay(ch);
    }
    return this.advance();
  }

  // 이스케이프: \d, \w, \s, \n, \1 등
  parseEscape() {
    this.advance(); // '\'
    if (!this.hasMore()) {
      return { type: NodeType.LITERAL, value: "\\" };
    }

    const ch = this.advance();

    // 역참조 \1 ~ \9
    if (ch >= "1" && ch <= "9") {
      return { type: NodeType.BACKREFERENCE, ref: parseInt(ch, 10) };
    }

    const shorthandMap = {
      d: "숫자 [0-9]",
      D: "비숫자 [^0-9]",
      w: "단어 [A-Za-z0-9_]",
      W: "비단어 [^A-Za-z0-9_]",
      s: "공백",
      S: "비공백",
      b: "단어 경계",
      B: "비단어 경계",
    };

    if (shorthandMap[ch]) {
      return {
        type: NodeType.ESCAPE,
        value: ch,
        display: `\\${ch}`,
        description: shorthandMap[ch],
      };
    }

    const specialMap = {
      n: "\n",
      t: "\t",
      r: "\r",
      f: "\f",
      v: "\v",
      0: "\0",
    };

    if (specialMap[ch] !== undefined) {
      return { type: NodeType.LITERAL, value: `\\${ch}`, display: `\\${ch}` };
    }

    // 일반 이스케이프 (예: \. \* \+ 등)
    return { type: NodeType.LITERAL, value: ch };
  }
}

function isQuantifierStart(ch) {
  return ch === "*" || ch === "+" || ch === "?" || ch === "{";
}

function getEscapeDisplay(ch) {
  const map = {
    d: "\\d",
    D: "\\D",
    w: "\\w",
    W: "\\W",
    s: "\\s",
    S: "\\S",
    n: "\\n",
    t: "\\t",
    r: "\\r",
  };
  return map[ch] || ch;
}

/**
 * 정규식 문자열을 AST로 파싱
 * @param {string} pattern - 정규식 패턴 문자열 (슬래시, 플래그 제외)
 * @returns {{ ast: object|null, error: string|null }}
 */
export function parseRegex(pattern) {
  if (!pattern) return { ast: null, error: null };

  try {
    const parser = new RegexParser(pattern);
    const ast = parser.parse();
    return { ast, error: null };
  } catch (e) {
    return { ast: null, error: e.message };
  }
}
