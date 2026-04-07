import { NodeType } from "./regexParser";

// 기본 상수
const CONF = {
  CHAR_WIDTH: 9, // 글자 하나의 px 폭 (monospace 기준)
  NODE_HEIGHT: 32, // 노드 박스 높이
  NODE_PAD_X: 16, // 노드 내부 좌우 패딩
  NODE_PAD_Y: 8, // 노드 내부 상하 패딩
  GAP_X: 16, // 노드 사이 수평 간격
  GAP_Y: 12, // 분기(alternative) 수직 간격
  ARROW_SIZE: 6, // 화살표 크기
  QUANT_LABEL_HEIGHT: 20, // 수량자 라벨 높이
  RAIL_RADIUS: 10, // 레일 곡선 반지름
  MIN_NODE_WIDTH: 40, // 노드 최소 폭
};

/**
 * AST를 레이아웃 트리로 변환 - 각 노드에 width, height 할당
 */
export function measureNode(node) {
  if (!node) {
    return { ...node, width: 0, height: 0 };
  }

  switch (node.type) {
    case NodeType.LITERAL:
      return measureLiteral(node);
    case NodeType.ESCAPE:
      return measureEscape(node);
    case NodeType.DOT:
      return measureSimple(node, "any");
    case NodeType.ANCHOR:
      return measureSimple(node, node.kind === "start" ? "^" : "$");
    case NodeType.BACKREFERENCE:
      return measureSimple(node, `\\${node.ref}`);
    case NodeType.CHAR_CLASS:
      return measureCharClass(node);
    case NodeType.SEQUENCE:
      return measureSequence(node);
    case NodeType.ALTERNATIVE:
      return measureAlternative(node);
    case NodeType.GROUP:
      return measureGroup(node);
    case NodeType.QUANTIFIER:
      return measureQuantifier(node);
    default:
      return measureSimple(node, "?");
  }
}

function textWidth(text) {
  return Math.max(
    CONF.MIN_NODE_WIDTH,
    text.length * CONF.CHAR_WIDTH + CONF.NODE_PAD_X * 2,
  );
}

function measureLiteral(node) {
  const display = node.display || node.value || "ε";
  const w = textWidth(display);
  return { ...node, width: w, height: CONF.NODE_HEIGHT, display };
}

function measureEscape(node) {
  const display = node.display || `\\${node.value}`;
  const w = textWidth(display);
  return { ...node, width: w, height: CONF.NODE_HEIGHT, display };
}

function measureSimple(node, label) {
  const w = textWidth(label);
  return { ...node, width: w, height: CONF.NODE_HEIGHT, display: label };
}

function measureCharClass(node) {
  let inner = node.items
    .map((item) => {
      if (item.type === NodeType.CHAR_RANGE)
        return item.display || `${item.from}-${item.to}`;
      return item.value;
    })
    .join("");

  const display = node.negated ? `[^${inner}]` : `[${inner}]`;
  const w = textWidth(display);
  return { ...node, width: w, height: CONF.NODE_HEIGHT, display };
}

function measureSequence(node) {
  const items = node.items.map(measureNode);
  const totalWidth =
    items.reduce((sum, n) => sum + n.width, 0) +
    CONF.GAP_X * (items.length - 1);
  const maxHeight = Math.max(...items.map((n) => n.height));
  return { ...node, items, width: totalWidth, height: maxHeight };
}

function measureAlternative(node) {
  const alternatives = node.alternatives.map(measureNode);
  const maxWidth = Math.max(...alternatives.map((n) => n.width));
  // 좌우에 분기/합류 공간 추가
  const totalWidth = maxWidth + CONF.RAIL_RADIUS * 4;
  const totalHeight =
    alternatives.reduce((sum, n) => sum + n.height, 0) +
    CONF.GAP_Y * (alternatives.length - 1);
  return { ...node, alternatives, width: totalWidth, height: totalHeight };
}

function measureGroup(node) {
  const child = measureNode(node.child);
  // 그룹 라벨 영역
  const labelHeight = 18;
  const width = child.width + CONF.GAP_X * 2;
  const height = child.height + labelHeight;
  return { ...node, child, width, height, labelHeight };
}

function measureQuantifier(node) {
  const child = measureNode(node.child);
  const needsLoop = node.max > 1 || node.max === Infinity;
  const loopExtra = needsLoop ? CONF.QUANT_LABEL_HEIGHT + CONF.GAP_Y : 0;
  const needsSkip = node.min === 0;
  const skipExtra = needsSkip ? CONF.QUANT_LABEL_HEIGHT + CONF.GAP_Y : 0;

  const width = child.width + CONF.RAIL_RADIUS * 4;
  const height = child.height + loopExtra + skipExtra;

  return {
    ...node,
    child,
    width,
    height,
    needsLoop,
    needsSkip,
    loopExtra,
    skipExtra,
  };
}

export { CONF };
